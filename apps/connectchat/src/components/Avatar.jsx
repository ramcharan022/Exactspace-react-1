const avatarColors = {
  Alan: "avatar-blue",
  Bob: "avatar-orange",
  Carol: "avatar-violet",
  Dean: "avatar-green",
  Elin: "avatar-rose",
};

export default function Avatar({ name, size = "regular" }) {
  return (
    <span
      className={`avatar ${avatarColors[name] ?? "avatar-blue"} avatar-${size}`}
      aria-label={`${name}'s avatar`}
      title={name}
    >
      {name.slice(0, 1)}
    </span>
  );
}
