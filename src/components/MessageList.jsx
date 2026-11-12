import { useEffect, useRef } from "react";
import Avatar from "./Avatar.jsx";
import MessageItem from "./MessageItem.jsx";
import Icon from "./Icon.jsx";

function formatToday(date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default function MessageList({ messages, searchQuery, onLike, onReact, onEdit, onDelete, isTyping = false }) {
  const bottomRef = useRef(null);
  const isSearching = searchQuery.trim().length > 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  if (isSearching && messages.length === 0) {
    return (
      <div className="empty-state search-empty">
        <span className="empty-icon"><Icon name="search" size={21} /></span>
        <h2>No messages found</h2>
        <p>Try a different name or search term.</p>
      </div>
    );
  }

  return (
    <div className="message-list" aria-live="polite">
      <div className="date-divider">
        <span />
        <time dateTime={new Date().toISOString()}>{formatToday(new Date())}</time>
        <span />
      </div>
      {messages.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"><Icon name="sparkles" size={21} /></span>
          <h2>A little quiet in here</h2>
          <p>Start the conversation. Your team is listening.</p>
        </div>
      ) : (
        <div className="messages">
          {messages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              onLike={onLike}
              onReact={onReact}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
      {isTyping && !isSearching && (
        <div className="typing-indicator" role="status">
          <span className="typing-dots"><i /><i /><i /></span>
          <span>Someone is typing</span>
        </div>
      )}
      <div ref={bottomRef} />
      <div className="conversation-note">
        <div className="note-avatars">
          <Avatar name="Alan" size="tiny" />
          <Avatar name="Carol" size="tiny" />
        </div>
        <span>Be kind. Great things start with a conversation.</span>
      </div>
    </div>
  );
}
