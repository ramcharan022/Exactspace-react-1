const iconPaths = {
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  send: <path d="m21 3-7.2 18-3.5-7.3L3 10.2 21 3Zm0 0L10.3 13.7" />,
  smile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14.5s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
    </>
  ),
  like: (
    <>
      <path d="M7 10v10H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h3Zm0 0 4-7a3 3 0 0 1 2 3v3h5.3a2 2 0 0 1 2 2.4l-1.3 7a2 2 0 0 1-2 1.6H7" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </>
  ),
  edit: (
    <>
      <path d="m15 5 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4Z" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" />
    </>
  ),
  hash: <path d="M5 9h14M4 15h14M11 3 8 21m8-18-3 18" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  plus: <path d="M12 5v14m-7-7h14" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  sparkles: (
    <>
      <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" />
      <path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  person: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
};

export default function Icon({ name, size = 18, strokeWidth = 1.8, ...props }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {iconPaths[name]}
    </svg>
  );
}
