import { useEffect, useRef, useState } from "react";
import EmojiPicker from "./EmojiPicker.jsx";
import Icon from "./Icon.jsx";
import MentionDropdown from "./MentionDropdown.jsx";

const usernames = ["Alan", "Bob", "Carol", "Dean", "Elin"];

function getMentionQuery(value) {
  const match = value.match(/(?:^|\s)@([a-zA-Z]*)$/);
  return match ? match[1] : null;
}

export default function ChatInput({ onSend, onTyping, placeholder = "Message #team-chat" }) {
  const [draft, setDraft] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const textareaRef = useRef(null);
  const mentionQuery = getMentionQuery(draft);
  const mentionMatches =
    mentionQuery === null
      ? []
      : usernames.filter((name) => name.toLowerCase().startsWith(mentionQuery.toLowerCase()));

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 144)}px`;
  }, [draft]);

  function insertEmoji(emoji) {
    setDraft((current) => `${current}${emoji}`);
    setIsEmojiPickerOpen(false);
    textareaRef.current?.focus();
  }

  function selectMention(name) {
    setDraft((current) => current.replace(/(?:^|\s)@[a-zA-Z]*$/, (match) => {
      const prefix = match.startsWith(" ") ? " " : "";
      return `${prefix}@${name} `;
    }));
    textareaRef.current?.focus();
  }

  function submitMessage() {
    const content = draft.trim();
    if (!content) return;
    onSend(content);
    setDraft("");
    setIsEmojiPickerOpen(false);
    onTyping?.(false);
  }

  function handleKeyDown(event) {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    if (mentionMatches.length > 0) {
      selectMention(mentionMatches[0]);
      return;
    }
    submitMessage();
  }

  return (
    <div className="composer-wrap">
      <MentionDropdown names={mentionMatches} onSelect={selectMention} />
      {isEmojiPickerOpen && (
        <EmojiPicker onSelect={insertEmoji} onClose={() => setIsEmojiPickerOpen(false)} label="Insert an emoji" />
      )}
      <div className="composer">
        <textarea
          ref={textareaRef}
          rows={1}
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            onTyping?.(Boolean(event.target.value.trim()));
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Message"
        />
        <div className="composer-toolbar">
          <div className="composer-actions">
            <button
              className={`icon-button composer-tool${isEmojiPickerOpen ? " is-active" : ""}`}
              type="button"
              onClick={() => setIsEmojiPickerOpen((open) => !open)}
              aria-label="Add emoji"
              aria-expanded={isEmojiPickerOpen}
            >
              <Icon name="smile" size={18} />
            </button>
            <span className="composer-hint">Use <kbd>@</kbd> to mention someone</span>
          </div>
          <div className="send-actions">
            <span className="keyboard-hint"><kbd>↵</kbd> to send</span>
            <button
              className="send-button"
              type="button"
              onClick={submitMessage}
              disabled={!draft.trim()}
              aria-label="Send message"
            >
              <Icon name="send" size={16} />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
