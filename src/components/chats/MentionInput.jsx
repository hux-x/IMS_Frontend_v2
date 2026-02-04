import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

const MentionInput = ({
  value,
  onChange,
  onMentionSelect,
  availableUsers,
  currentUserId,
  placeholder,
  onKeyPress,
  disabled,
  isGroupChat,
}) => {
  const [showMentionList, setShowMentionList] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const textareaRef = useRef(null);
  const mentionListRef = useRef(null);

  // Filter users based on search and exclude current user
  const filteredUsers = availableUsers
    .filter(user => user._id !== currentUserId)
    .filter(user => 
      user.name.toLowerCase().includes(mentionSearch.toLowerCase())
    );

  useEffect(() => {
    // Reset selected index when filtered users change
    setSelectedMentionIndex(0);
  }, [filteredUsers.length]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    onChange(e);
    setCursorPosition(cursorPos);

    // Only check for mentions in group chats
    if (!isGroupChat) {
      setShowMentionList(false);
      return;
    }

    // Check if we should show mention list
    const textBeforeCursor = newValue.substring(0, cursorPos);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtSymbol !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtSymbol + 1);
      
      // Show mention list if @ is at start or preceded by space/newline
      const charBeforeAt = lastAtSymbol > 0 ? textBeforeCursor[lastAtSymbol - 1] : ' ';
      const shouldShow = /\s/.test(charBeforeAt) || lastAtSymbol === 0;
      
      if (shouldShow && !textAfterAt.includes(' ')) {
        setMentionSearch(textAfterAt);
        setShowMentionList(true);
      } else {
        setShowMentionList(false);
      }
    } else {
      setShowMentionList(false);
    }
  };

  const insertMention = (user) => {
    const textBeforeCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');
    
    const beforeMention = value.substring(0, lastAtSymbol);
    const mentionText = `@${user.name} `;
    const newValue = beforeMention + mentionText + textAfterCursor;
    
    onChange({ target: { value: newValue } });
    onMentionSelect(user);
    
    setShowMentionList(false);
    setMentionSearch('');
    
    // Set cursor after the mention
    setTimeout(() => {
      const newCursorPos = beforeMention.length + mentionText.length;
      textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos);
      textareaRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (showMentionList && filteredUsers.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIndex(prev => 
          prev < filteredUsers.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIndex(prev => prev > 0 ? prev - 1 : 0);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertMention(filteredUsers[selectedMentionIndex]);
      } else if (e.key === 'Escape') {
        setShowMentionList(false);
      }
    }
  };

  // Scroll selected mention into view
  useEffect(() => {
    if (showMentionList && mentionListRef.current) {
      const selectedElement = mentionListRef.current.children[selectedMentionIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedMentionIndex, showMentionList]);

  return (
    <div className="relative flex-1">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows="1"
        style={{ minHeight: "40px", maxHeight: "120px" }}
      />
      
      {showMentionList && filteredUsers.length > 0 && (
        <div 
          ref={mentionListRef}
          className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50"
        >
          {filteredUsers.map((user, index) => (
            <button
              key={user._id}
              onClick={() => insertMention(user)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors ${
                index === selectedMentionIndex ? 'bg-blue-50' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {user.profile_picture_url ? (
                  <img
                    src={user.profile_picture_url}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentionInput;