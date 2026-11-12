export default function MentionDropdown({ names, onSelect }) {
  if (names.length === 0) return null;

  return (
    <div className="mention-dropdown" role="listbox" aria-label="Mention a participant">
      <p className="mention-label">PEOPLE IN THIS SPACE</p>
      {names.map((name) => (
        <button
          className="mention-option"
          key={name}
          type="button"
          role="option"
          aria-selected="false"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onSelect(name)}
        >
          <span className={`mention-avatar mention-${name.toLowerCase()}`}>{name[0]}</span>
          <span>{name}</span>
          <span className="mention-status">online</span>
        </button>
      ))}
    </div>
  );
}
