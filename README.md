# ConnectChat

A responsive React chat application built for the Exactspace Technologies Frontend/UI Developer Internship assignment.

## Requirements

- Node.js 18 or newer
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). To create and preview a production build:

```bash
npm run build
npm run preview
```

## Project structure

```text
exactspace-react-assignment/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── apps/
│   └── connectchat/
│       └── src/
│           ├── App.jsx
│           ├── styles.css
│           └── components/
│               ├── ActivityFeed.jsx
│               ├── Avatar.jsx
│               ├── ChannelDialog.jsx
│               ├── ChatHeader.jsx
│               ├── ChatInput.jsx
│               ├── DirectMessages.jsx
│               ├── EmojiPicker.jsx
│               ├── Icon.jsx
│               ├── MentionDropdown.jsx
│               ├── MessageItem.jsx
│               ├── MessageList.jsx
│               └── WorkspaceSidebar.jsx
├── index.html
├── src/
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

## Component and hook overview

- **`App`** owns channel and direct-message threads, navigation, appearance, and search state. It chooses a random author from Alan, Bob, Carol, Dean, and Elin, and handles sending, likes, reactions, edits, and deletion. Threads, workspace selection, channels, and theme are persisted in `localStorage`; existing messages from the original `connectchat.messages.v1` key are migrated to `team-chat`.
- **`WorkspaceSidebar`** switches channels and views, changes the selected workspace, opens the channel dialog, and provides profile status and theme controls. On narrow screens it opens as a navigation drawer.
- **`ChatHeader`** renders the active channel or person, search field, and participant summary. `Ctrl+K`/`⌘K` focuses search.
- **`MessageList`** renders the date divider, empty/search states, message list, and scroll anchor. Its `useEffect` scrolls to the latest message when the list grows.
- **`MessageItem`** displays each author's avatar, message, 24-hour timestamp, like count, reactions, and edit/delete controls.
- **`ChatInput`** manages the draft, Enter-to-send/Shift+Enter newline behavior, mention suggestions, emoji-picker visibility, and simulated typing indicator. It auto-sizes the textarea with a ref and effect.
- **`ActivityFeed`** summarizes recent messages and links back to their channels.
- **`DirectMessages`** lists teammates and opens an individual conversation.
- **`ChannelDialog`** validates and creates a channel.
- **`EmojiPicker`** provides selectable emojis for the composer.
- **`MentionDropdown`** lists matching participant names after `@` is typed.
- **`Avatar`** maps each participant to a consistent color.
- **`Icon`** is a small inline-SVG icon set; no icon package is required.

React hooks used:

- **`useState`** stores UI state and chat messages.
- **`useEffect`** synchronizes messages with local storage, sizes the composer, and scrolls the message list.
- **`useRef`** accesses the textarea and scroll anchor without causing re-renders.
- **`useMemo`** derives the filtered messages from the current search query.

## Behavior and testing checklist

There is no separate automated test suite configured. After running `npm run dev`, verify:

1. Send a message using the button and Enter; the new message appears at the end with one of the five random usernames, a timestamp, and zero likes.
2. Shift+Enter inserts a newline. Whitespace-only drafts cannot be sent, and the Send button is disabled for an empty draft.
3. Each click on a message's thumbs-up button increases its like count by one.
4. Click a reaction to add it; click it again to remove your reaction. Confirm reaction counts update.
5. Type `@` and choose a participant from the suggestions. Insert emojis from the composer picker.
6. Search by a participant name and by message text; clear the query to restore the full conversation.
7. Edit a message and save it; confirm the edited label appears. Delete a message and confirm it is removed.
8. Refresh the page and confirm messages, likes, and reactions remain.
9. Switch between channels and direct messages; confirm each thread remains separate after switching and refreshing.
10. Use the Activity view to open a channel. Add a new channel and confirm it is available after refreshing.
11. In the profile menu, switch light/dark mode and change online/away status.
12. Resize to a tablet and phone viewport. Open mobile navigation and confirm the composer and message actions remain usable.
13. Run `npm run build` and confirm Vite completes without errors.

The app starts with a few example messages so the reactions and conversation layout are visible. Clear `connectchat.workspace.v2` and `connectchat.messages.v1` in browser local storage to restore the example conversation.

## Deploy to GitHub Pages

1. Create a GitHub repository and push this project to its default branch.
2. In the repository, open **Settings → Pages** and set the build/deployment source to **GitHub Actions**.
3. The included `.github/workflows/deploy.yml` builds the Vite app and publishes `dist/` on pushes to `main` (and when run manually). Vite reads the repository name from the GitHub Actions environment to set the correct Pages base path. The workflow includes a `404.html` fallback for GitHub Pages.
4. Wait for the **Deploy to GitHub Pages** workflow to finish. The published URL is shown under **Settings → Pages**.

If your default branch is not `main`, update the workflow's branch trigger before pushing.
