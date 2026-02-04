import React from "react";
import { UserPlus, Users, Search, MessageSquare, AtSign } from "lucide-react";

const ChatSidebar = ({
  filteredChats,
  selectedChat,
  unreadMessages,
  unreadMentions,
  searchQuery,
  setSearchQuery,
  setShowNewChat,
  setShowGroupModal,
  handleChatSelect,
  getOtherUser,
  isUserOnline,
  getChatName,
  formatTime,
}) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewChat(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="New Chat"
            >
              <UserPlus className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setShowGroupModal(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="New Group Chat"
            >
              <Users className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare className="w-12 h-12 mb-2 text-gray-300" />
            <p className="text-sm">No chats yet</p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const otherUser = getOtherUser(chat);
            const isOnline = otherUser && isUserOnline(otherUser._id);
            const isSelected = selectedChat?._id === chat._id;
            const unreadCount = unreadMessages.get(chat._id) || 0;
            const hasMentions = unreadMentions.has(chat._id);

            return (
              <button
                key={chat._id}
                onClick={() => handleChatSelect(chat)}
                className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                  isSelected ? "bg-blue-50" : ""
                } ${hasMentions ? "bg-yellow-50 hover:bg-yellow-100" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center font-semibold text-white
      ${chat.isGroupChat ? "bg-purple-500" : "bg-blue-500"}`}
                      >
                        {chat.isGroupChat ? (
                          <Users className="w-6 h-6" />
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
                          <span>
                            {otherUser?.name?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>

                      {isOnline && !chat.isGroupChat && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {isOnline && !chat.isGroupChat && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-1">
                      <div className="flex items-center gap-1 flex-1 min-w-0">
                        <h3
                          className={`${
                            unreadCount > 0 ? "font-bold" : "font-semibold"
                          } text-gray-900 truncate`}
                        >
                          {getChatName(chat)}
                        </h3>
                        {hasMentions && (
                          <AtSign className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {chat.latestMessage?.createdAt &&
                          formatTime(chat.latestMessage.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm truncate ${
                          unreadCount > 0
                            ? "font-semibold text-gray-900"
                            : "text-gray-600"
                        }`}
                      >
                        {chat.latestMessage?.message || "No messages yet"}
                      </p>
                      {unreadCount > 0 && (
                        <span className="ml-2 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;