import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/authContext";
import socketService, {
  connectSocket,
  disconnectSocket,
} from "@/apis/socket/config";
import chatService from "@/apis/services/chatService";
import {
  MessageSquare,
  Users,
  Send,
  Paperclip,
  X,
  Reply,
  Loader2,
  Info,
  FolderOpen,
} from "lucide-react";
import { ToastContainer } from "@/components/layout/Toast";
import GroupInfoModal from "@/components/modals/GroupChatModal";
import GroupChatModal from "@/components/modals/GroupChatModal";
import NewChatModal from "@/components/modals/NewChatModal";
import UploadFilesModal from "@/components/modals/UploadFileModal";
import ChatSidebar from "@/components/chats/ChatSidebar";
import UploadProgressToast from "@/components/ui/UploadProgressToast";
import ChatMessages from "@/components/chats/MessageArea";
import MentionInput from "@/components/chats/MentionInput";
import { formatFileSize, formatTime } from "@/components/utils/utils";

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, name, email, setUnread } = useContext(AuthContext);
  const user = userId ? { _id: userId, name, email } : null;

  // State Management
  const [chats, setChats] = useState([]);
  const [chatMessages, setChatMessages] = useState(new Map());
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Map());
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(new Map());
  const [unreadMentions, setUnreadMentions] = useState(new Set());
  const [mentionedUsers, setMentionedUsers] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);
  console.log(mentionedUsers,"MENTIONED USERSSSSSSSSSSSS")

  // Infinite Scroll States
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
  const [cursors, setCursors] = useState(new Map());
  const [hasMoreMessages, setHasMoreMessages] = useState(new Map());

  // Modal States
  const [showNewChat, setShowNewChat] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Refs
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingClearTimeoutsRef = useRef(new Map());
  const messageContainerRef = useRef(null);
  const socketRef = useRef(null);
  const joinedChatsRef = useRef(new Set());
  const dataLoadedRef = useRef(false);
  const isInitialScrollRef = useRef(true);
  const chatSwitchingRef = useRef(false);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const addToast = (message, sender, chatId) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, sender, chatId }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleToastClick = (chatId) => {
    const chat = chats.find((c) => c._id === chatId);
    if (chat) handleChatSelect(chat);
  };

  const scrollToBottom = (behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: "end" });
    }
  };

  const scrollToMessage = (messageId) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("highlight-message");
      setTimeout(() => element.classList.remove("highlight-message"), 2000);
    }
  };

  const getOtherUser = (chat) => {
    if (!chat || chat.isGroupChat) return null;
    if (!chat.users || !Array.isArray(chat.users)) return null;
    return chat.users.find((u) => u && u._id && u._id !== user?._id);
  };

  const isUserOnline = (userId) => {
    return userId ? onlineUsers.has(userId) : false;
  };

  const getChatName = (chat) => {
    if (!chat) return "Unknown";
    if (chat.isGroupChat) return chat.chatName || "Group Chat";
    const otherUser = getOtherUser(chat);
    return otherUser?.name || "Unknown User";
  };

  const getTypingText = () => {
    if (!selectedChat) return "";

    const chatTypers = typingUsers.get(selectedChat._id);
    if (!chatTypers || chatTypers.size === 0) return "";

    if (selectedChat.isGroupChat) {
      const typingUserNames = selectedChat.users
        ?.filter(
          (u) => u && u._id && chatTypers.has(u._id) && u._id !== user?._id
        )
        .map((u) => u.name)
        .slice(0, 2);

      if (!typingUserNames || typingUserNames.length === 0) return "";
      if (typingUserNames.length === 1)
        return `${typingUserNames[0]} is typing...`;
      return `${typingUserNames[0]} and ${typingUserNames[1]} are typing...`;
    } else {
      const otherUser = getOtherUser(selectedChat);
      if (!otherUser || !otherUser._id) return "";
      return chatTypers.has(otherUser._id) ? "typing..." : "";
    }
  };

  // ============================================================================
  // MENTION FUNCTIONS
  // ============================================================================

  const handleMentionSelect = (user) => {
    setMentionedUsers((prev) => {
      const exists = prev.find((u) => u._id === user._id);
      if (exists) return prev;
      return [...prev, user];
    });
  };

  const handleMentionClick = (mentionedUser) => {
    // Find or create a chat with the mentioned user
    const existingChat = chats.find(
      (chat) =>
        !chat.isGroupChat &&
        chat.users.some((u) => u._id === mentionedUser._id)
    );

    if (existingChat) {
      handleChatSelect(existingChat);
    } else {
      handleStartNewChat(mentionedUser);
    }
  };

  const clearMentionForMessage = async (messageId, chatId) => {
    // Remove mention indicator from state
    setUnreadMentions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(chatId);
      return newSet;
    });

    // Optionally, you can call an API to mark mentions as read
    // await chatService.markMentionAsRead(messageId);
  };

  // ============================================================================
  // INFINITE SCROLL FUNCTIONS
  // ============================================================================

  const loadOlderMessages = async (chatId) => {
    if (loadingOlderMessages) {
      console.log("⚠️ Already loading messages, skipping");
      return;
    }

    const hasMore = hasMoreMessages.get(chatId);
    if (hasMore === false) {
      console.log("⚠️ No more messages to load for chat:", chatId);
      return;
    }

    const cursor = cursors.get(chatId);
    console.log(
      "📜 Loading older messages for chat:",
      chatId,
      "with cursor:",
      cursor
    );

    setLoadingOlderMessages(true);

    try {
      const container = messageContainerRef.current;
      const previousScrollHeight = container?.scrollHeight || 0;
      const previousScrollTop = container?.scrollTop || 0;

      const response = await chatService.getMessages(chatId, 20, cursor);

      const responseData = response.data?.data || response.data;
      const newMessages = responseData?.messages || [];
      const totalMessages = responseData?.totalMessages || 0;
      const returnedLimit = responseData?.limit || 20;
      const nextCursor = responseData?.nextCursor || null;
      const backendHasMore = responseData?.hasMore;

      console.log("📦 Pagination response:", {
        newMessagesCount: newMessages.length,
        totalMessages,
        returnedLimit,
        nextCursor,
        backendHasMore,
        cursor,
      });

      if (newMessages && newMessages.length > 0) {
        setChatMessages((prevMap) => {
          const newMap = new Map(prevMap);
          const existingMessages = newMap.get(chatId) || [];

          const existingIds = new Set(existingMessages.map((m) => m._id));
          const uniqueNewMessages = newMessages.filter(
            (m) => !existingIds.has(m._id)
          );

          if (uniqueNewMessages.length === 0) {
            console.log("⚠️ All messages were duplicates");
            return prevMap;
          }

          const updatedMessages = [...uniqueNewMessages, ...existingMessages];
          newMap.set(chatId, updatedMessages);

          console.log("💾 Cache updated:", {
            chatId,
            newUnique: uniqueNewMessages.length,
            totalCached: updatedMessages.length,
          });

          return newMap;
        });

        setMessages((prev) => {
          const currentChatId = selectedChat?._id;
          if (currentChatId !== chatId) {
            console.log("⚠️ Chat changed during load, not updating display");
            return prev;
          }

          const existingIds = new Set(prev.map((m) => m._id));
          const uniqueNewMessages = newMessages.filter(
            (m) => !existingIds.has(m._id)
          );

          if (uniqueNewMessages.length === 0) {
            return prev;
          }

          return [...uniqueNewMessages, ...prev];
        });

        const finalNextCursor =
          nextCursor || (newMessages.length > 0 ? newMessages[0]._id : null);

        const finalHasMore =
          typeof backendHasMore === "boolean"
            ? backendHasMore
            : newMessages.length >= returnedLimit;

        console.log("📊 Next pagination state:", {
          finalNextCursor,
          finalHasMore,
          source:
            typeof backendHasMore === "boolean" ? "backend" : "calculated",
        });

        setCursors((prev) => {
          const newMap = new Map(prev);
          newMap.set(chatId, finalNextCursor);
          return newMap;
        });

        setHasMoreMessages((prev) => {
          const newMap = new Map(prev);
          newMap.set(chatId, finalHasMore);
          return newMap;
        });

        setTimeout(() => {
          if (container && messageContainerRef.current === container) {
            const newScrollHeight = container.scrollHeight;
            const scrollDiff = newScrollHeight - previousScrollHeight;

            const safeScrollTop = Math.max(previousScrollTop + scrollDiff, 200);
            container.scrollTop = safeScrollTop;

            console.log("📍 Scroll restored:", {
              previousScrollTop,
              scrollDiff,
              newScrollTop: container.scrollTop,
              safetyMargin: 200,
            });
          }
        }, 50);

        console.log(
          "✅ Loaded",
          newMessages.length,
          "older messages. Has more:",
          finalHasMore
        );
      } else {
        console.log("🏁 No messages returned, marking as complete");
        setHasMoreMessages((prev) => {
          const newMap = new Map(prev);
          newMap.set(chatId, false);
          return newMap;
        });
      }
    } catch (error) {
      console.error("❌ Error loading older messages:", error);
      setHasMoreMessages((prev) => {
        const newMap = new Map(prev);
        newMap.set(chatId, false);
        return newMap;
      });
    } finally {
      setLoadingOlderMessages(false);
    }
  };

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const [chatsResponse, usersResponse] = await Promise.all([
        chatService.getChats(0, 100),
        chatService.getAllUsers(),
      ]);

      const chatsData = Array.isArray(chatsResponse.data)
        ? chatsResponse.data
        : chatsResponse.data?.data || [];
      setChats(chatsData);

      const usersData = usersResponse.data.employees || [];
      setAllUsers(usersData);

      const messagesMap = new Map();
      const unreadMap = new Map();
      const mentionsSet = new Set();
      const cursorsMap = new Map();
      const hasMoreMap = new Map();

      await Promise.all(
        chatsData.map(async (chat) => {
          try {
            const response = await chatService.getMessages(chat._id, 20);

            const responseData = response.data?.data || response.data;
            const messagesData = responseData?.messages || [];
            const limit = responseData?.limit || 20;
            const nextCursor = responseData?.nextCursor;
            const backendHasMore = responseData?.hasMore;

            if (messagesData && Array.isArray(messagesData)) {
              messagesMap.set(chat._id, messagesData);

              const finalNextCursor =
                nextCursor ||
                (messagesData.length > 0 ? messagesData[0]._id : null);

              const finalHasMore =
                typeof backendHasMore === "boolean"
                  ? backendHasMore
                  : messagesData.length >= limit;

              cursorsMap.set(chat._id, finalNextCursor);
              hasMoreMap.set(chat._id, finalHasMore);

              console.log("📊 Initial pagination state for chat:", chat._id, {
                cursor: finalNextCursor,
                hasMore: finalHasMore,
              });

              const unread = messagesData.filter(
                (m) => m.sender._id !== user?._id && !m.isRead
              ).length;

              if (unread > 0) unreadMap.set(chat._id, unread);

              // Check for unread mentions
              const hasMentions = messagesData.some(
                (m) =>
                  m.mention?.some((mention) => mention._id === user?._id) &&
                  m.sender._id !== user?._id &&
                  !m.isRead
              );

              if (hasMentions) {
                mentionsSet.add(chat._id);
              }
            }
          } catch (error) {
            console.error("Error loading messages for chat:", chat._id, error);
            messagesMap.set(chat._id, []);
            cursorsMap.set(chat._id, null);
            hasMoreMap.set(chat._id, false);
          }
        })
      );

      setChatMessages(messagesMap);
      setCursors(cursorsMap);
      setHasMoreMessages(hasMoreMap);
      setUnreadMessages(unreadMap);
      setUnreadMentions(mentionsSet);

      const totalUnread = Array.from(unreadMap.values()).reduce(
        (acc, val) => acc + val,
        0
      );
      setUnread(totalUnread);

      setTimeout(() => {
        console.log(
          "🔍 Requesting online status for",
          usersData.length,
          "users"
        );
        usersData.forEach((userData) => {
          if (userData._id !== user?._id) {
            socketService.getUserOnlineStatus(userData._id);
          }
        });
      }, 1000);

      if (location.state?.selectedChatId) {
        const chatToSelect = chatsData.find(
          (c) => c._id === location.state.selectedChatId
        );
        if (chatToSelect) {
          console.log(
            "📍 Auto-selecting chat from notification:",
            location.state.selectedChatId
          );
          setTimeout(() => handleChatSelect(chatToSelect), 500);
        }
        window.history.replaceState({}, document.title);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      setChats([]);
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // SOCKET EVENT HANDLERS
  // ============================================================================
const handleNewMessage = (message) => {
  console.log("💬 Message received:", message);

  let messageChatId;
  if (typeof message.chat === "object" && message.chat !== null) {
    messageChatId = message.chat._id?.toString() || message.chat.toString();
  } else {
    messageChatId = message.chat?.toString();
  }

  const selectedChatId = selectedChat?._id?.toString();
  const isCurrentChat = selectedChatId && messageChatId === selectedChatId;

  // Check if current user is mentioned (check both 'mention' and 'mentions' fields)
  const isMentioned = message.mention?.some((m) => m._id === user?._id) || 
                      message.mentions?.some((m) => m._id === user?._id);

  console.log("🏷️ Mention check:", { 
    isMentioned, 
    mentions: message.mentions, 
    mention: message.mention,
    userId: user?._id 
  });

  setChatMessages((prev) => {
    const newMap = new Map(prev);
    const chatMsgs = newMap.get(messageChatId) || [];
    const exists = chatMsgs.some((m) => m._id === message._id);
    if (!exists) {
      newMap.set(messageChatId, [...chatMsgs, message]);
    }
    return newMap;
  });

  setChats((prev) => {
    const chatIndex = prev.findIndex((c) => c._id === messageChatId);
    if (chatIndex === -1) return prev;

    const updatedChats = [...prev];
    const chatToUpdate = { ...updatedChats[chatIndex] };
    chatToUpdate.latestMessage = message;

    updatedChats.splice(chatIndex, 1);
    updatedChats.unshift(chatToUpdate);

    return updatedChats;
  });

  if (isCurrentChat) {
    setMessages((prev) => {
      const exists = prev.some((m) => m._id === message._id);
      if (exists) return prev;
      return [...prev, message];
    });

    setTimeout(() => scrollToBottom(), 100);

    if (message.sender._id !== user?._id) {
      socketService.markMessageAsRead(message._id, user._id);
    }

    // Clear mention indicator if mentioned in current chat
    if (isMentioned) {
      clearMentionForMessage(message._id, messageChatId);
    }
  } else {
    if (message.sender._id !== user?._id) {
      console.log("📬 Incrementing unread count for chat:", messageChatId);

      setUnreadMessages((prev) => {
        const newMap = new Map(prev);
        const current = newMap.get(messageChatId) || 0;
        newMap.set(messageChatId, current + 1);

        const totalUnread = Array.from(newMap.values()).reduce(
          (acc, val) => acc + val,
          0
        );
        setUnread(totalUnread);

        return newMap;
      });

      // Add mention indicator
      if (isMentioned) {
        console.log("✨ Adding mention indicator for chat:", messageChatId);
        setUnreadMentions((prev) => new Set([...prev, messageChatId]));
      }

      // Show toast notification - enhanced for mentions
      console.log("🔔 Showing toast:", { isMentioned, sender: message.sender.name });
      addToast(
        message.message, 
        message.sender.name, 
        messageChatId,
        isMentioned // Pass the isMention flag
      );

      if ("Notification" in window && Notification.permission === "granted") {
        const notificationBody = isMentioned
          ? `${message.sender.name} mentioned you: ${message.message}`
          : message.message;

        new Notification(
          `New message from ${message.sender.name}`,
          {
            body: notificationBody,
            icon: "/logo.png",
            tag: messageChatId,
          }
        );
      }

      try {
        const audio = new Audio("/notification.mp3");
        audio.volume = 0.5;
        audio.play().catch((e) => console.log("Audio play failed:", e));
      } catch (error) {
        console.log("Notification sound error:", error);
      }
    }
  }
};

  const handleUserTyping = ({ userId: typingUserId, chatId }) => {
    if (typingUserId !== user?._id) {
      console.log("⌨️ User typing:", typingUserId, "in chat:", chatId);

      setTypingUsers((prev) => {
        const newMap = new Map(prev);
        const chatTypers = newMap.get(chatId) || new Set();
        chatTypers.add(typingUserId);
        newMap.set(chatId, chatTypers);
        return newMap;
      });

      const timeoutKey = `${chatId}-${typingUserId}`;
      if (typingClearTimeoutsRef.current.has(timeoutKey)) {
        clearTimeout(typingClearTimeoutsRef.current.get(timeoutKey));
      }

      const timeout = setTimeout(() => {
        console.log("⏱️ Clearing typing for user:", typingUserId);
        setTypingUsers((prev) => {
          const newMap = new Map(prev);
          const chatTypers = newMap.get(chatId);
          if (chatTypers) {
            chatTypers.delete(typingUserId);
            if (chatTypers.size === 0) {
              newMap.delete(chatId);
            } else {
              newMap.set(chatId, chatTypers);
            }
          }
          return newMap;
        });
        typingClearTimeoutsRef.current.delete(timeoutKey);
      }, 2000);

      typingClearTimeoutsRef.current.set(timeoutKey, timeout);
    }
  };

  const handleUserStopTyping = ({ userId: typingUserId, chatId }) => {
    console.log("🛑 User stopped typing:", typingUserId);

    const timeoutKey = `${chatId}-${typingUserId}`;
    if (typingClearTimeoutsRef.current.has(timeoutKey)) {
      clearTimeout(typingClearTimeoutsRef.current.get(timeoutKey));
      typingClearTimeoutsRef.current.delete(timeoutKey);
    }

    setTypingUsers((prev) => {
      const newMap = new Map(prev);
      const chatTypers = newMap.get(chatId);
      if (chatTypers) {
        chatTypers.delete(typingUserId);
        if (chatTypers.size === 0) {
          newMap.delete(chatId);
        } else {
          newMap.set(chatId, chatTypers);
        }
      }
      return newMap;
    });
  };

  const handleUserOnline = ({ userId: onlineUserId }) => {
    console.log("✅ User came online:", onlineUserId);
    setOnlineUsers((prev) => new Set([...prev, onlineUserId]));
  };

  const handleUserOffline = ({ userId: offlineUserId }) => {
    console.log("❌ User went offline:", offlineUserId);
    setOnlineUsers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(offlineUserId);
      return newSet;
    });
  };

  const handleUserOnlineStatus = ({ userId: statusUserId, isOnline }) => {
    console.log(
      `🔍 User status: ${statusUserId} is ${isOnline ? "online" : "offline"}`
    );
    if (isOnline) {
      setOnlineUsers((prev) => new Set([...prev, statusUserId]));
    } else {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(statusUserId);
        return newSet;
      });
    }
  };

  const handleMessageRead = ({ messageId }) => {
    console.log("✅ Message read:", messageId);
    setChatMessages((prev) => {
      const newMap = new Map(prev);
      for (const [chatId, msgs] of newMap.entries()) {
        const updated = msgs.map((m) =>
          m._id === messageId ? { ...m, isRead: true } : m
        );
        newMap.set(chatId, updated);
      }
      return newMap;
    });

    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  };

  const handleInitialOnlineUsers = ({ users }) => {
    console.log("👥 Received initial online users:", users.length);
    setOnlineUsers(new Set(users));
  };

  // ============================================================================
  // CHAT ACTIONS
  // ============================================================================

  const handleChatSelect = async (chat) => {
    if (selectedChat?._id === chat._id) return;

    console.log("🔄 Switching to chat:", chat._id);
    chatSwitchingRef.current = true;
    isInitialScrollRef.current = true;

    setSelectedChat(chat);

    // Clear unread count and mentions
    setUnreadMessages((prev) => {
      const newMap = new Map(prev);
      newMap.delete(chat._id);

      const totalUnread = Array.from(newMap.values()).reduce(
        (acc, val) => acc + val,
        0
      );
      setUnread(totalUnread);

      return newMap;
    });

    setUnreadMentions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(chat._id);
      return newSet;
    });

    const cachedMessages = chatMessages.get(chat._id) || [];
    console.log(
      "💾 Loading cached messages for chat:",
      chat._id,
      "Count:",
      cachedMessages.length
    );
    setMessages(cachedMessages);

    cachedMessages.forEach((msg) => {
      if (msg.sender._id !== user?._id && !msg.isRead) {
        console.log("✅ Marking message as read on chat open:", msg._id);
        socketService.markMessageAsRead(msg._id, user._id);
      }
    });

    setTimeout(() => {
      scrollToBottom("auto");
      chatSwitchingRef.current = false;
      console.log("📍 Scrolled to bottom for chat:", chat._id);
    }, 100);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat || sendingMessage) return;

    setSendingMessage(true);

    // Extract mentioned user IDs
    const mentionIds = mentionedUsers.map((u) => u._id);
    console.log("MENTION IDSSSSSSSSSSSSSS : ", mentionIds)

    socketService.sendMessage(
      selectedChat._id,
      user._id,
      messageInput,
      "text",
      null,
      replyingTo?._id,
      mentionIds.length > 0 ? mentionIds : undefined
    );

    setMessageInput("");
    setReplyingTo(null);
    setMentionedUsers([]);
    socketService.sendStopTyping(selectedChat._id, user._id);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setSendingMessage(false);
  };

  const handleTyping = (e) => {
    setMessageInput(e.target.value);

    if (!selectedChat) return;

    socketService.sendTyping(selectedChat._id, user._id);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketService.sendStopTyping(selectedChat._id, user._id);
    }, 1000);
  };

  const handleReply = (message) => {
    setReplyingTo(message);
    document.getElementById("message-input")?.focus();
  };

  const handleStartNewChat = async (selectedUser) => {
    try {
      const response = await chatService.postChat(selectedUser._id);
      const newChat = response.data.data || response.data;

      setChats((prev) => [newChat, ...prev]);
      setChatMessages((prev) => {
        const newMap = new Map(prev);
        newMap.set(newChat._id, []);
        return newMap;
      });

      setCursors((prev) => {
        const newMap = new Map(prev);
        newMap.set(newChat._id, null);
        return newMap;
      });

      setHasMoreMessages((prev) => {
        const newMap = new Map(prev);
        newMap.set(newChat._id, false);
        return newMap;
      });

      socketService.joinChat(newChat._id);
      joinedChatsRef.current.add(newChat._id);

      handleChatSelect(newChat);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleCreateGroupChat = async (groupName, userIds) => {
    try {
      const response = await chatService.createGroup(groupName, userIds);
      const newChat = response.data.data || response.data;

      setChats((prev) => [newChat, ...prev]);
      setChatMessages((prev) => {
        const newMap = new Map(prev);
        newMap.set(newChat._id, []);
        return newMap;
      });

      setCursors((prev) => {
        const newMap = new Map(prev);
        newMap.set(newChat._id, null);
        return newMap;
      });

      setHasMoreMessages((prev) => {
        const newMap = new Map(prev);
        newMap.set(newChat._id, false);
        return newMap;
      });

      socketService.joinChat(newChat._id);
      joinedChatsRef.current.add(newChat._id);

      handleChatSelect(newChat);
    } catch (error) {
      console.error("Error creating group chat:", error);
      throw error;
    }
  };

  const handleUpdateGroup = async (chatId, newName) => {
    try {
      const response = await chatService.renameGroup(chatId, newName);
      const updatedChat = response.data.data || response.data;

      setChats((prev) => prev.map((c) => (c._id === chatId ? updatedChat : c)));
      if (selectedChat?._id === chatId) {
        setSelectedChat(updatedChat);
      }
    } catch (error) {
      console.error("Error updating group:", error);
      throw error;
    }
  };

  const handleAddMember = async (chatId, userId) => {
    try {
      const response = await chatService.addToGroup(chatId, userId);
      const updatedChat = response.data.data || response.data;

      setChats((prev) => prev.map((c) => (c._id === chatId ? updatedChat : c)));
      if (selectedChat?._id === chatId) {
        setSelectedChat(updatedChat);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      throw error;
    }
  };

  const handleRemoveMember = async (chatId, userId) => {
    try {
      const response = await chatService.removeFromGroup(chatId, userId);
      const updatedChat = response.data.data || response.data;

      setChats((prev) => prev.map((c) => (c._id === chatId ? updatedChat : c)));
      if (selectedChat?._id === chatId) {
        setSelectedChat(updatedChat);
      }
    } catch (error) {
      console.error("Error removing member:", error);
      throw error;
    }
  };

  const handleOpenRepository = () => {
    if (selectedChat?.Repository?._id) {
      window.open(`/files/${selectedChat.Repository._id}`, "_blank");
    }
  };

  const handleFileMessageClick = () => {
    if (selectedChat?.Repository?._id) {
      window.open(`/files/${selectedChat.Repository._id}`, "_blank");
    }
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (!userId || dataLoadedRef.current) return;

    console.log("🔌 Initializing socket for user:", userId);
    socketRef.current = connectSocket(userId);

    loadInitialData();
    dataLoadedRef.current = true;

    const requestOnlineStatusTimer = setTimeout(() => {
      console.log("🔍 Requesting online users after connection");
      allUsers.forEach((user) => {
        if (user._id !== userId) {
          socketService.getUserOnlineStatus(user._id);
        }
      });
    }, 1000);

    return () => {
      clearTimeout(requestOnlineStatusTimer);
      typingClearTimeoutsRef.current.forEach((timeout) =>
        clearTimeout(timeout)
      );
      typingClearTimeoutsRef.current.clear();
      socketService.cleanup();
      disconnectSocket();
      dataLoadedRef.current = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!socketRef.current || chats.length === 0) return;

    chats.forEach((chat) => {
      if (!joinedChatsRef.current.has(chat._id)) {
        socketService.joinChat(chat._id);
        joinedChatsRef.current.add(chat._id);
        console.log("✅ Joined chat room:", chat._id);
      }
    });
  }, [chats]);

  useEffect(() => {
    if (!socketRef.current || !userId) return;

    socketService.onMessageReceived(handleNewMessage);
    socketService.onUserTyping(handleUserTyping);
    socketService.onUserStopTyping(handleUserStopTyping);
    socketService.onUserOnline(handleUserOnline);
    socketService.onUserOffline(handleUserOffline);
    socketService.onMessageRead(handleMessageRead);

    if (socketRef.current) {
      socketRef.current.on("initial online users", handleInitialOnlineUsers);
      socketRef.current.on("user online status", handleUserOnlineStatus);
    }

    return () => {
      socketService.offMessageReceived();
      socketService.offUserTyping();
      socketService.offUserStopTyping();
      socketService.offUserOnline();
      socketService.offUserOffline();
      socketService.offMessageRead();

      if (socketRef.current) {
        socketRef.current.off("initial online users", handleInitialOnlineUsers);
        socketRef.current.off("user online status", handleUserOnlineStatus);
      }
    };
  }, [selectedChat, userId, user, chats]);

  useEffect(() => {
    const handleShowProgress = (e) => {
      setUploadProgress(e.detail.files);
    };

    const handleUploadProgress = (e) => {
      setUploadProgress((prev) =>
        prev.map((file) =>
          file.uploadInfo.fileId === e.detail.fileId
            ? { ...file, progress: e.detail.progress }
            : file
        )
      );
    };

    const handleUploadComplete = (e) => {
      if (e.detail.success) {
        setTimeout(() => setUploadProgress([]), 2000);
      } else {
        setUploadProgress([]);
      }
    };

    window.addEventListener("show-upload-progress", handleShowProgress);
    window.addEventListener("upload-progress", handleUploadProgress);
    window.addEventListener("upload-complete", handleUploadComplete);

    return () => {
      window.removeEventListener("show-upload-progress", handleShowProgress);
      window.removeEventListener("upload-progress", handleUploadProgress);
      window.removeEventListener("upload-complete", handleUploadComplete);
    };
  }, []);

  useEffect(() => {
    const container = messageContainerRef.current;
    if (!container || !selectedChat) {
      return;
    }

    console.log("✅ Attaching scroll listener to chat:", selectedChat._id);

    const handleScroll = () => {
      if (chatSwitchingRef.current || isInitialScrollRef.current) {
        console.log("⏸️ Skipping scroll handler (switching or initial)");
        return;
      }

      const scrollTop = container.scrollTop;
      const threshold = 100;

      if (
        scrollTop < threshold &&
        !loadingOlderMessages &&
        hasMoreMessages.get(selectedChat._id)
      ) {
        console.log("🔄 Triggering load older messages");
        loadOlderMessages(selectedChat._id);
      }
    };

    container.addEventListener("scroll", handleScroll);

    const timer = setTimeout(() => {
      isInitialScrollRef.current = false;
      console.log("✅ Initial scroll flag cleared");
    }, 500);

    return () => {
      clearTimeout(timer);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [selectedChat, loadingOlderMessages, hasMoreMessages, cursors]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const filteredChats = chats.filter((chat) => {
    try {
      const chatName = getChatName(chat);
      if (!chatName) return false;
      return chatName.toLowerCase().includes(searchQuery.toLowerCase());
    } catch (error) {
      return false;
    }
  });

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading chats...</p>
        </div>
      </div>
    );
  }

  const otherUser =
    selectedChat && !selectedChat.isGroupChat
      ? selectedChat.users?.find((u) => u._id !== user._id)
      : null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Modals */}
      <GroupChatModal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        allUsers={allUsers}
        currentUserId={user?._id}
        onCreateGroup={handleCreateGroupChat}
      />

      <NewChatModal
        isOpen={showNewChat}
        onClose={() => setShowNewChat(false)}
        allUsers={allUsers}
        currentUserId={user?._id}
        onStartChat={handleStartNewChat}
        existingChats={chats}
      />

      {showUploadModal && selectedChat && (
        <UploadFilesModal
          onClose={() => setShowUploadModal(false)}
          repoId={selectedChat.Repository._id}
          chatId={selectedChat._id}
          userId={user._id}
          onUploadComplete={() => {
            console.log("Files uploaded successfully");
            setShowUploadModal(false);
          }}
        />
      )}

      <GroupInfoModal
        isOpen={showGroupInfo}
        onClose={() => setShowGroupInfo(false)}
        chat={selectedChat}
        currentUserId={user?._id}
        allUsers={allUsers}
        onUpdateGroup={handleUpdateGroup}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
      />

      {/* Sidebar */}
      <ChatSidebar
        filteredChats={filteredChats}
        selectedChat={selectedChat}
        unreadMessages={unreadMessages}
        unreadMentions={unreadMentions}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setShowNewChat={setShowNewChat}
        setShowGroupModal={setShowGroupModal}
        handleChatSelect={handleChatSelect}
        getOtherUser={getOtherUser}
        isUserOnline={isUserOnline}
        getChatName={getChatName}
        formatTime={formatTime}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-white font-semibold ${
                    selectedChat.isGroupChat ? "bg-purple-500" : "bg-blue-500"
                  }`}
                >
                  {selectedChat.isGroupChat ? (
                    <Users className="w-5 h-5" />
                  ) : otherUser?.profile_picture_url ? (
                    <img
                      src={otherUser.profile_picture_url}
                      alt={otherUser.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span>{otherUser?.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {getChatName(selectedChat)}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {getTypingText() ||
                      (selectedChat.isGroupChat
                        ? `${selectedChat.users?.length || 0} members`
                        : isUserOnline(getOtherUser(selectedChat)?._id)
                        ? "Online"
                        : "Offline")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedChat.Repository && (
                  <button
                    onClick={handleOpenRepository}
                    className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                    title="Open Repository Files"
                  >
                    <FolderOpen className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600">Files</span>
                  </button>
                )}
                {selectedChat.isGroupChat && (
                  <button
                    onClick={() => setShowGroupInfo(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="Group Info"
                  >
                    <Info className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Messages Area with Loading Indicator */}
            <div className="flex-1 overflow-hidden relative">
              {loadingOlderMessages && (
                <div className="absolute top-0 left-0 right-0 z-10 flex justify-center py-2 bg-gradient-to-b from-gray-50 to-transparent">
                  <div className="bg-white shadow-md rounded-full px-4 py-2 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-600">
                      Loading older messages...
                    </span>
                  </div>
                </div>
              )}

              <ChatMessages
                messages={messages}
                user={user}
                selectedChat={selectedChat}
                messageContainerRef={messageContainerRef}
                messagesEndRef={messagesEndRef}
                handleFileMessageClick={handleFileMessageClick}
                handleReply={handleReply}
                scrollToMessage={scrollToMessage}
                formatTime={formatTime}
                formatFileSize={formatFileSize}
                getTypingText={getTypingText}
                handleMentionClick={handleMentionClick}
              />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4">
              {replyingTo && (
                <div className="mb-3 bg-gray-100 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Reply className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        Replying to {replyingTo.sender.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {replyingTo.message}
                    </p>
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              )}

              {/* Show mentioned users */}
              {mentionedUsers.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {mentionedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      <span>@{user.name}</span>
                      <button
                        onClick={() =>
                          setMentionedUsers((prev) =>
                            prev.filter((u) => u._id !== user._id)
                          )
                        }
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
                {selectedChat.Repository && (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Upload Files"
                  >
                    <Paperclip className="w-5 h-5 text-gray-600" />
                  </button>
                )}

                <MentionInput
                  value={messageInput}
                  onChange={handleTyping}
                  onMentionSelect={handleMentionSelect}
                  availableUsers={selectedChat.users || []}
                  currentUserId={user?._id}
                  placeholder="Type a message..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={sendingMessage}
                  isGroupChat={selectedChat.isGroupChat}
                />

                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || sendingMessage}
                  className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {sendingMessage ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MessageSquare className="w-20 h-20 mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold mb-2">Welcome to Messages</h2>
            <p className="text-center max-w-md">
              Select a conversation from the sidebar or start a new chat to
              begin messaging
            </p>
          </div>
        )}
      </div>

      <style>{`
        .highlight-message {
          animation: highlight 2s ease;
        }

        @keyframes highlight {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(59, 130, 246, 0.1); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .animate-bounce {
          animation: bounce 1.4s infinite ease-in-out;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>

      <ToastContainer
        toasts={toasts}
        removeToast={removeToast}
        onToastClick={handleToastClick}
      />
      {uploadProgress.length > 0 && (
        <div
          className="fixed z-[9999] space-y-3 max-w-sm w-full"
          style={{
            top: "1rem",
            right: "1rem",
            bottom: "auto",
            left: "auto",
            transform: "none",
          }}
        >
          <UploadProgressToast files={uploadProgress} />
        </div>
      )}
    </div>
  );
};

export default ChatPage;