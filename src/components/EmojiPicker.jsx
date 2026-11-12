const emojis = ["😀", "🙌", "✨", "🎉", "💡", "❤️", "👍", "🔥", "😂", "👀", "🚀", "🙏"];

export default function EmojiPicker({ onSelect, onClose, label = "Choose an emoji" }) {
  return (
    <div className="emoji-picker" role="dialog" aria-label={label}>
      <div className="picker-heading">
        <span>Quick reactions</span>
        <button className="icon-button picker-close" onClick={onClose} aria-label="Close emoji picker">
          ×
        </button>
      </div>
      <div className="emoji-grid">
        {emojis.map((emoji) => (
          <button
            className="emoji-option"
            key={emoji}
            type="button"
            onClick={() => onSelect(emoji)}
            aria-label={`Insert ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
