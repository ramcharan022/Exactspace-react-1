import { useState } from "react";
import Icon from "./Icon.jsx";

export default function ChannelDialog({ onCreate, onClose }) {
  const [channelName, setChannelName] = useState("");
  const normalizedName = channelName.trim().toLowerCase().replace(/^#+/, "").replace(/\s+/g, "-");
  const isValid = /^[a-z0-9][a-z0-9-]*$/.test(normalizedName);

  function submit(event) {
    event.preventDefault();
    if (isValid) onCreate(normalizedName);
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <form className="channel-dialog" role="dialog" aria-modal="true" aria-labelledby="create-channel-title" onSubmit={submit}>
        <button className="icon-button dialog-close" type="button" onClick={onClose} aria-label="Close dialog">
          <Icon name="close" size={18} />
        </button>
        <span className="dialog-icon"><Icon name="hash" size={20} /></span>
        <h2 id="create-channel-title">Create a channel</h2>
        <p>Give your team a new space to share ideas.</p>
        <label htmlFor="channel-name">Channel name</label>
        <div className="channel-name-input">
          <span>#</span>
          <input
            id="channel-name"
            value={channelName}
            onChange={(event) => setChannelName(event.target.value)}
            placeholder="e.g. product-launch"
            autoFocus
          />
        </div>
        {channelName.trim() && !isValid && <span className="field-hint">Use letters, numbers, and hyphens.</span>}
        <div className="dialog-actions">
          <button className="dialog-cancel" type="button" onClick={onClose}>Cancel</button>
          <button className="dialog-create" type="submit" disabled={!isValid}>Create channel</button>
        </div>
      </form>
    </div>
  );
}
