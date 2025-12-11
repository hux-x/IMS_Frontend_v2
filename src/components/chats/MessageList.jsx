// components/MessageList.jsx
import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { MessageSquare, Loader2, ChevronUp } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const MessageList = forwardRef(({
  messages,
  currentUser,
  selectedChat,
  onReply,
  typingText,
  messagesEndRef,
  onLoadMore,
  loadingMore,
  hasMore
}, ref) => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const previousScrollHeightRef = useRef(0);
  const isLoadingMoreRef = useRef(false);
  const scrollPositionBeforeLoadRef = useRef(0);

  // Maintain scroll position when loading more messages
  useEffect(() => {
    const container = ref?.current;
    if (!container || !isLoadingMoreRef.current) return;

    // Wait for DOM to update, then restore scroll position
    requestAnimationFrame(() => {
      const newScrollHeight = container.scrollHeight;
      const scrollDifference = newScrollHeight - previousScrollHeightRef.current;
      
      if (scrollDifference > 0) {
        // Restore scroll position to keep user at the same message
        container.scrollTop = scrollDifference;
        console.log('✨ Scroll position maintained:', {
          oldHeight: previousScrollHeightRef.current,
          newHeight: newScrollHeight,
          difference: scrollDifference,
          newScrollTop: container.scrollTop
        });
      }
      
      isLoadingMoreRef.current = false;
    });
  }, [messages.length, ref]);

  useEffect(() => {
    const container = ref?.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      setShowScrollToTop(scrollTop > 500);

      // Load more when near top (within 150px) and not already loading
      if (scrollTop < 150 && hasMore && !loadingMore && !isLoadingMoreRef.current) {
        console.log('📜 Reached top, triggering load more...');
        
        // Store current scroll state before loading
        previousScrollHeightRef.current = container.scrollHeight;
        scrollPositionBeforeLoadRef.current = scrollTop;
        isLoadingMoreRef.current = true;
        
        onLoadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadingMore, onLoadMore, ref]);

  // Reset loading state when chat changes
  useEffect(() => {
    isLoadingMoreRef.current = false;
  }, [selectedChat?._id]);

  const scrollToTop = () => {
    ref?.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToMessage = (messageId) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('highlight-message');
      setTimeout(() => element.classList.remove('highlight-message'), 2000);
    }
  };

  const handleLoadMoreClick = () => {
    const container = ref?.current;
    if (!container || isLoadingMoreRef.current) return;
    
    console.log('🖱️ Manual load more clicked');
    previousScrollHeightRef.current = container.scrollHeight;
    scrollPositionBeforeLoadRef.current = container.scrollTop;
    isLoadingMoreRef.current = true;
    
    onLoadMore();
  };

  if (messages.length === 0) {
    return (
      <div ref={ref} className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <MessageSquare className="w-16 h-16 mb-4 text-gray-300" />
          <p>No messages yet</p>
          <p className="text-sm">Send a message to start the conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={ref} 
      className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 relative"
      style={{ overflowAnchor: 'none' }} // Prevent browser from auto-adjusting scroll
    >
      {/* Load More Indicator */}
      {loadingMore && (
        <div className="flex justify-center py-2">
          <div className="flex items-center gap-2 text-blue-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Loading older messages...</span>
          </div>
        </div>
      )}
      
      {/* Load More Button (only show when not loading and has more) */}
      {!loadingMore && hasMore && messages.length > 0 && (
        <div className="flex justify-center py-2">
          <button
            onClick={handleLoadMoreClick}
            disabled={isLoadingMoreRef.current}
            className="text-sm text-blue-500 hover:text-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Load older messages
          </button>
        </div>
      )}

      {/* No More Messages Indicator */}
      {!hasMore && messages.length > 0 && (
        <div className="flex justify-center py-2">
          <span className="text-xs text-gray-400">
            • Beginning of conversation •
          </span>
        </div>
      )}

      {/* Messages */}
      {messages.map((message, index) => {
        const isOwn = message.sender._id === currentUser?._id;
        const showAvatar = index === 0 || messages[index - 1].sender._id !== message.sender._id;

        return (
          <MessageBubble
            key={message._id}
            message={message}
            isOwn={isOwn}
            showAvatar={showAvatar}
            showSenderName={!isOwn && selectedChat.isGroupChat}
            onReply={onReply}
            onScrollToReply={scrollToMessage}
          />
        );
      })}
      
      {/* Typing Indicator */}
      {typingText && (
        <div className="flex gap-3">
          <div className="w-8 h-8"></div>
          <TypingIndicator />
        </div>
      )}
      
      {/* Scroll Anchor */}
      <div ref={messagesEndRef} />

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-8 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all z-10"
          title="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
});

MessageList.displayName = 'MessageList';

export default MessageList;