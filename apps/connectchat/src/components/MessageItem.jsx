import { useState } from "react";
import Avatar from "./Avatar.jsx";
import Icon from "./Icon.jsx";

const reactionEmojis = ["👍", "❤️", "😂", "🔥"];

function formatTime(timestamp) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(timestamp));
}

export default function MessageItem({ message, onLike, onReact, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  function saveEdit(event) {
    event.preventDefault();
    const content = editedContent.trim();
    if (!content) return;
    onEdit(message.id, content);
    setIsEditing(false);
  }

  function cancelEdit() {
    setEditedContent(message.content);
    setIsEditing(false);
  }

  return (
    <article className="message-item">
      <Avatar name={message.author} />
      <div className="message-main">
        <div className="message-heading">
          <span className="message-author">{message.author}</span>
          <time className="message-time" dateTime={message.timestamp}>{formatTime(message.timestamp)}</time>
          {message.edited && <span className="edited-label">edited</span>}
        </div>
        {isEditing ? (
          <form className="edit-form" onSubmit={saveEdit}>
            <textarea
              value={editedContent}
              onChange={(event) => setEditedContent(event.target.value)}
              aria-label="Edit message"
              autoFocus
            />
            <div className="edit-actions">
              <button className="text-button" type="button" onClick={cancelEdit}>Cancel</button>
              <button className="small-primary-button" type="submit" disabled={!editedContent.trim()}>Save</button>
            </div>
          </form>
        ) : (
          <p className="message-content">{message.content}</p>
        )}
        {!isEditing && (
          <div className="message-footer">
            <div className="reaction-list" aria-label="Message reactions">
              {reactionEmojis.map((emoji) => {
                const count = message.reactions[emoji] ?? 0;
                const isSelected = message.myReactions.includes(emoji);
                return (
                  <button
                    className={`reaction-chip${isSelected ? " is-selected" : ""}${count ? "" : " reaction-empty"}`}
                    key={emoji}
                    type="button"
                    onClick={() => onReact(message.id, emoji)}
                    aria-label={`${emoji} reaction, ${count} ${count === 1 ? "reaction" : "reactions"}${isSelected ? ", selected" : ""}`}
                    aria-pressed={isSelected}
                  >
                    <span>{emoji}</span>
                    {count > 0 && <span>{count}</span>}
                  </button>
                );
              })}
            </div>
            <button
              className={`like-button${message.likes > 0 ? " has-likes" : ""}`}
              type="button"
              onClick={() => onLike(message.id)}
              aria-label={`Like message, ${message.likes} likes`}
            >
              <Icon name="like" size={15} />
              <span>{message.likes}</span>
            </button>
          </div>
        )}
      </div>
      {!isEditing && (
        <div className="message-actions">
          <button
            className="icon-button message-action"
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label={`Edit ${message.author}'s message`}
            title="Edit message"
          >
            <Icon name="edit" size={15} />
          </button>
          <button
            className="icon-button message-action delete-action"
            type="button"
            onClick={() => onDelete(message.id)}
            aria-label={`Delete ${message.author}'s message`}
            title="Delete message"
          >
            <Icon name="trash" size={15} />
          </button>
        </div>
      )}
    </article>
  );
}
