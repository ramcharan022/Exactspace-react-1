import { useState } from "react";
import Avatar from "./Avatar.jsx";
import Icon from "./Icon.jsx";

const workspaces = ["Studio North", "Product Lab", "Design Collective"];

export default function WorkspaceSidebar({
  channels,
  activeView,
  activeChannel,
  workspaceName,
  theme,
  profileStatus,
  mobileOpen,
  onNavigate,
  onSelectWorkspace,
  onAddChannel,
  onThemeToggle,
  onStatusChange,
  onClose,
}) {
  const [openMenu, setOpenMenu] = useState("");

  function chooseWorkspace(name) {
    onSelectWorkspace(name);
    setOpenMenu("");
  }

  function navigate(view, channel = "") {
    onNavigate(view, channel);
    setOpenMenu("");
    onClose();
  }

  return (
    <aside className={`workspace-sidebar${mobileOpen ? " mobile-open" : ""}`}>
      <div className="workspace-brand">
        <span className="brand-mark"><Icon name="sparkles" size={20} /></span>
        <span>Connect<span className="brand-light">Chat</span></span>
        <button className="icon-button mobile-sidebar-close" type="button" onClick={onClose} aria-label="Close navigation">
          <Icon name="close" size={19} />
        </button>
      </div>

      <div className="sidebar-popover-anchor workspace-anchor">
        <button
          type="button"
          className="workspace-switcher"
          aria-expanded={openMenu === "workspace"}
          onClick={() => setOpenMenu((current) => current === "workspace" ? "" : "workspace")}
        >
          <span className="workspace-monogram">{workspaceName[0]}</span>
          <span className="workspace-name">{workspaceName}<small>Free workspace</small></span>
          <Icon name="chevron" size={15} className={`workspace-chevron${openMenu === "workspace" ? " is-open" : ""}`} />
        </button>
        {openMenu === "workspace" && (
          <div className="sidebar-popover workspace-menu" role="menu" aria-label="Choose workspace">
            <p className="popover-label">YOUR WORKSPACES</p>
            {workspaces.map((name) => (
              <button
                type="button"
                role="menuitem"
                className={`workspace-option${name === workspaceName ? " selected" : ""}`}
                key={name}
                onClick={() => chooseWorkspace(name)}
              >
                <span className="workspace-option-mark">{name[0]}</span>
                <span>{name}</span>
                {name === workspaceName && <span className="workspace-check">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className="sidebar-nav" aria-label="Workspace navigation">
        <p className="nav-section-title">WORKSPACE</p>
        <button
          type="button"
          className={`nav-item${activeView === "activity" ? " selected" : ""}`}
          onClick={() => navigate("activity")}
        >
          <span className="nav-symbol">◫</span> Activity <span className="nav-count">2</span>
        </button>
        <button
          type="button"
          className={`nav-item${activeView === "direct-messages" || activeView === "dm-thread" ? " selected" : ""}`}
          onClick={() => navigate("direct-messages")}
        >
          <span className="nav-symbol">✉</span> Direct messages
        </button>
        <div className="channel-heading">
          <span>CHANNELS</span>
          <button className="icon-button sidebar-add" type="button" onClick={onAddChannel} aria-label="Add a channel" title="Add a channel">
            <Icon name="plus" size={15} />
          </button>
        </div>
        {channels.map((channel) => (
          <button
            type="button"
            className={`nav-item channel-item${activeView === "channel" && activeChannel === channel ? " active" : ""}`}
            key={channel}
            onClick={() => navigate("channel", channel)}
          >
            <Icon name="hash" size={16} /> {channel}
            {channel === "team-chat" && <span className="active-dot" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="profile-anchor sidebar-popover-anchor">
          {openMenu === "profile" && (
            <div className="sidebar-popover profile-menu" role="menu" aria-label="Profile settings">
              <div className="profile-menu-heading">
                <span className="profile-avatar">Y</span>
                <span className="profile-name">You<small>{profileStatus}</small></span>
              </div>
              <button type="button" role="menuitem" className="profile-menu-item" onClick={() => onStatusChange(profileStatus === "Online" ? "Away" : "Online")}>
                <span className={`profile-menu-status${profileStatus === "Online" ? " online" : ""}`} />
                Set status to {profileStatus === "Online" ? "Away" : "Online"}
              </button>
              <button type="button" role="menuitem" className="profile-menu-item" onClick={onThemeToggle}>
                <span className="profile-menu-theme">{theme === "light" ? "☾" : "☀"}</span>
                Switch to {theme === "light" ? "dark" : "light"} mode
              </button>
            </div>
          )}
          <div className="profile-card">
            <span className="profile-avatar">Y</span>
            <span className="profile-name">You<small>{profileStatus === "Online" ? "Here and happy" : "Away"}</small></span>
            <span className={`profile-status${profileStatus === "Away" ? " is-away" : ""}`} />
            <button
              type="button"
              className="icon-button profile-more"
              aria-label="Profile options"
              aria-expanded={openMenu === "profile"}
              onClick={() => setOpenMenu((current) => current === "profile" ? "" : "profile")}
            >
              <Icon name="more" size={17} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
