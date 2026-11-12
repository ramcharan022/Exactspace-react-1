import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar.jsx";
import Icon from "./Icon.jsx";

const participants = ["Alan", "Bob", "Carol", "Dean", "Elin"];

export default function ChatHeader({
  title = "team-chat",
  subtitle = "Good conversations make great teams.",
  searchQuery,
  onSearchChange,
  onMenuToggle,
  showSearch = true,
  participants = ["Alan", "Bob", "Carol", "Dean", "Elin"],
  isDirectMessage = false,
}) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isMobileSearchOpen) searchInputRef.current?.focus();
  }, [isMobileSearchOpen]);

  useEffect(() => {
    if (!showSearch) setIsMobileSearchOpen(false);
  }, [showSearch]);

  useEffect(() => {
    function handleShortcut(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (window.matchMedia("(max-width: 680px)").matches) setIsMobileSearchOpen(true);
        else searchInputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <header className="chat-header">
      <div className="chat-title">
        <button className="mobile-menu-toggle" type="button" onClick={onMenuToggle} aria-label="Open navigation">
          <Icon name="menu" size={20} />
        </button>
        <div className="channel-icon">
          <Icon name={isDirectMessage ? "person" : "hash"} size={19} />
        </div>
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="header-tools">
        {showSearch && <div className={`search-field${isMobileSearchOpen ? " mobile-search-open" : ""}`}>
          <Icon name="search" size={17} className="search-icon" />
          <input
            ref={searchInputRef}
            type="search"
            placeholder="Search messages"
            aria-label="Search messages"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          {!searchQuery && !isMobileSearchOpen && <kbd>⌘ K</kbd>}
          <button
            className="mobile-search-toggle"
            type="button"
            onClick={() => setIsMobileSearchOpen((open) => !open)}
            aria-label={isMobileSearchOpen ? "Close message search" : "Open message search"}
          >
            <Icon name={isMobileSearchOpen ? "close" : "search"} size={17} />
          </button>
        </div>}
        {!isDirectMessage && <div className="participants" aria-label={`${participants.length} participants online`}>
          <div className="participant-stack">
            {participants.slice(0, 3).map((name) => (
              <Avatar key={name} name={name} size="tiny" />
            ))}
            {participants.length > 3 && <span className="participant-overflow">+{participants.length - 3}</span>}
          </div>
          <span className="participant-count"><span className="online-indicator" />{participants.length} online</span>
        </div>}
      </div>
    </header>
  );
}
