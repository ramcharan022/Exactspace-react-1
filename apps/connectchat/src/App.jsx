import { useEffect, useMemo, useRef, useState } from "react";
import ActivityFeed from "./components/ActivityFeed.jsx";
import ChannelDialog from "./components/ChannelDialog.jsx";
import ChatHeader from "./components/ChatHeader.jsx";
import ChatInput from "./components/ChatInput.jsx";
import DirectMessages from "./components/DirectMessages.jsx";
import Icon from "./components/Icon.jsx";
import MessageList from "./components/MessageList.jsx";
import WorkspaceSidebar from "./components/WorkspaceSidebar.jsx";
import "./styles.css";

const USER_LIST = ["Alan", "Bob", "Carol", "Dean", "Elin"];
const LEGACY_STORAGE_KEY = "connectchat.messages.v1";
const WORKSPACE_STORAGE_KEY = "connectchat.workspace.v2";
const THEME_STORAGE_KEY = "connectchat.theme";
const DEFAULT_CHANNELS = ["team-chat", "design", "random"];

function createStarterMessages() {
  const now = Date.now();
  return [
    {
      id: "welcome-1",
      author: "Alan",
      content: "Morning team! I’ve shared the first round of concepts. Would love your thoughts when you have a moment ✨",
      timestamp: new Date(now - 1000 * 60 * 38).toISOString(),
      likes: 2,
      reactions: { "❤️": 1, "🔥": 1 },
      myReactions: [],
      edited: false,
    },
    {
      id: "welcome-2",
      author: "Carol",
      content: "These are looking great, Alan! The warmer palette feels much more welcoming.",
      timestamp: new Date(now - 1000 * 60 * 30).toISOString(),
      likes: 1,
      reactions: { "👍": 2, "❤️": 1 },
      myReactions: [],
      edited: false,
    },
    {
      id: "welcome-3",
      author: "Dean",
      content: "Agreed. I especially like how clean the new message composer feels. Nice work, everyone 🙌",
      timestamp: new Date(now - 1000 * 60 * 18).toISOString(),
      likes: 0,
      reactions: { "😂": 1, "🔥": 1 },
      myReactions: [],
      edited: false,
    },
    {
      id: "welcome-4",
      author: "Elin",
      content: "Thanks for the thoughtful feedback. I’ll pull everything together and share an update this afternoon.",
      timestamp: new Date(now - 1000 * 60 * 9).toISOString(),
      likes: 0,
      reactions: {},
      myReactions: [],
      edited: false,
    },
  ];
}

function isValidMessage(message) {
  return (
    message !== null &&
    typeof message === "object" &&
    typeof message.id === "string" &&
    USER_LIST.includes(message.author) &&
    typeof message.content === "string" &&
    typeof message.timestamp === "string" &&
    Number.isFinite(message.likes) &&
    message.reactions !== null &&
    typeof message.reactions === "object" &&
    Array.isArray(message.myReactions) &&
    typeof message.edited === "boolean"
  );
}

function isValidThreads(threads) {
  return Object.values(threads).every(
    (messages) => Array.isArray(messages) && messages.every(isValidMessage),
  );
}

function loadWorkspace() {
  try {
    const savedWorkspace = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (savedWorkspace !== null) {
      const parsed = JSON.parse(savedWorkspace);
      if (
        Array.isArray(parsed.channels) &&
        parsed.channels.every((channel) => typeof channel === "string" && /^[a-z0-9][a-z0-9-]*$/.test(channel)) &&
        parsed.threads !== null &&
        typeof parsed.threads === "object" &&
        !Array.isArray(parsed.threads) &&
        isValidThreads(parsed.threads)
      ) {
        return {
          channels: [...new Set([...DEFAULT_CHANNELS, ...parsed.channels])],
          threads: parsed.threads,
          workspaceName: typeof parsed.workspaceName === "string" ? parsed.workspaceName : "Studio North",
          error: "",
        };
      }
      throw new Error("Saved workspace data is not in the expected format.");
    }

    const legacyMessages = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyMessages !== null) {
      const parsedMessages = JSON.parse(legacyMessages);
      if (Array.isArray(parsedMessages) && parsedMessages.every(isValidMessage)) {
        return {
          channels: DEFAULT_CHANNELS,
          threads: { "channel:team-chat": parsedMessages },
          workspaceName: "Studio North",
          error: "",
        };
      }
    }

    return {
      channels: DEFAULT_CHANNELS,
      threads: { "channel:team-chat": createStarterMessages() },
      workspaceName: "Studio North",
      error: "",
    };
  } catch (error) {
    console.error("Could not restore ConnectChat workspace.", error);
    return {
      channels: DEFAULT_CHANNELS,
      threads: { "channel:team-chat": createStarterMessages() },
      workspaceName: "Studio North",
      error: "We couldn’t restore saved messages. New messages will still appear in this session.",
    };
  }
}

function loadTheme() {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch (error) {
    console.error("Could not restore ConnectChat theme.", error);
    return "light";
  }
}

function createMessageId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function App() {
  const [initialState] = useState(loadWorkspace);
  const [channels, setChannels] = useState(initialState.channels);
  const [threads, setThreads] = useState(initialState.threads);
  const [workspaceName, setWorkspaceName] = useState(initialState.workspaceName);
  const [theme, setTheme] = useState(loadTheme);
  const [view, setView] = useState("channel");
  const [activeChannel, setActiveChannel] = useState("team-chat");
  const [activePerson, setActivePerson] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [storageError, setStorageError] = useState(initialState.error);
  const [profileStatus, setProfileStatus] = useState("Online");
  const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false);
  const [channelNotice, setChannelNotice] = useState("");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const threadKey = view === "channel"
    ? `channel:${activeChannel}`
    : view === "dm-thread"
      ? `dm:${activePerson}`
      : "";
  const messages = threads[threadKey] ?? [];
  const filteredMessages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return messages;
    return messages.filter(
      (message) =>
        message.author.toLowerCase().includes(query) ||
        message.content.toLowerCase().includes(query),
    );
  }, [messages, searchQuery]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        WORKSPACE_STORAGE_KEY,
        JSON.stringify({ channels, threads, workspaceName }),
      );
    } catch (error) {
      console.error("Could not save ConnectChat workspace.", error);
      setStorageError("Your browser couldn’t save this chat. Changes may not survive a refresh.");
    }
  }, [channels, threads, workspaceName]);

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error("Could not save ConnectChat theme.", error);
    }
  }, [theme]);

  useEffect(() => () => window.clearTimeout(typingTimeoutRef.current), []);

  function navigate(nextView, channel = "") {
    setView(nextView);
    if (nextView === "channel" && channel) setActiveChannel(channel);
    if (nextView !== "dm-thread") setActivePerson("");
    setSearchQuery("");
    setIsTyping(false);
  }

  function openDirectMessage(person) {
    setActivePerson(person);
    setView("dm-thread");
    setSearchQuery("");
  }

  function handleTyping(hasDraft) {
    window.clearTimeout(typingTimeoutRef.current);
    setIsTyping(hasDraft);
    if (hasDraft) {
      typingTimeoutRef.current = window.setTimeout(() => setIsTyping(false), 1600);
    }
  }

  function sendMessage(content) {
    if (!threadKey) return;
    const author = USER_LIST[Math.floor(Math.random() * USER_LIST.length)];
    setSearchQuery("");
    setIsTyping(false);
    setThreads((currentThreads) => ({
      ...currentThreads,
      [threadKey]: [
        ...(currentThreads[threadKey] ?? []),
        {
          id: createMessageId(),
          author,
          content,
          timestamp: new Date().toISOString(),
          likes: 0,
          reactions: {},
          myReactions: [],
          edited: false,
        },
      ],
    }));
  }

  function updateMessage(messageId, updater) {
    if (!threadKey) return;
    setThreads((currentThreads) => ({
      ...currentThreads,
      [threadKey]: (currentThreads[threadKey] ?? []).map((message) =>
        message.id === messageId ? updater(message) : message,
      ),
    }));
  }

  function likeMessage(messageId) {
    updateMessage(messageId, (message) => ({ ...message, likes: message.likes + 1 }));
  }

  function reactToMessage(messageId, emoji) {
    updateMessage(messageId, (message) => {
      const isSelected = message.myReactions.includes(emoji);
      const currentCount = message.reactions[emoji] ?? 0;
      const reactions = { ...message.reactions };
      if (isSelected) {
        if (currentCount <= 1) delete reactions[emoji];
        else reactions[emoji] = currentCount - 1;
      } else {
        reactions[emoji] = currentCount + 1;
      }
      return {
        ...message,
        reactions,
        myReactions: isSelected
          ? message.myReactions.filter((reaction) => reaction !== emoji)
          : [...message.myReactions, emoji],
      };
    });
  }

  function editMessage(messageId, content) {
    updateMessage(messageId, (message) => ({ ...message, content, edited: true }));
  }

  function deleteMessage(messageId) {
    if (!threadKey) return;
    setThreads((currentThreads) => ({
      ...currentThreads,
      [threadKey]: (currentThreads[threadKey] ?? []).filter((message) => message.id !== messageId),
    }));
  }

  function createChannel(channelName) {
    if (channels.includes(channelName)) {
      setChannelNotice(`#${channelName} already exists.`);
      setIsChannelDialogOpen(false);
      return;
    }
    setChannels((currentChannels) => [...currentChannels, channelName]);
    setThreads((currentThreads) => ({ ...currentThreads, [`channel:${channelName}`]: [] }));
    setChannelNotice("");
    setIsChannelDialogOpen(false);
    setIsMobileNavOpen(false);
    navigate("channel", channelName);
  }

  const isChatView = view === "channel" || view === "dm-thread";
  const headerTitle = view === "activity"
    ? "Activity"
    : view === "direct-messages"
      ? "Direct messages"
      : view === "dm-thread"
        ? activePerson
        : activeChannel;
  const headerSubtitle = view === "activity"
    ? "Catch up on what’s happening across your workspace."
    : view === "direct-messages"
      ? "Private conversations with your teammates."
      : view === "dm-thread"
        ? "Direct message · ConnectChat"
        : "Good conversations make great teams.";

  return (
    <div className={`app-shell${theme === "dark" ? " theme-dark" : ""}`}>
      {isMobileNavOpen && (
        <button className="mobile-nav-backdrop" type="button" onClick={() => setIsMobileNavOpen(false)} aria-label="Close navigation" />
      )}
      <WorkspaceSidebar
        channels={channels}
        activeView={view}
        activeChannel={activeChannel}
        workspaceName={workspaceName}
        theme={theme}
        profileStatus={profileStatus}
        mobileOpen={isMobileNavOpen}
        onNavigate={navigate}
        onSelectWorkspace={setWorkspaceName}
        onAddChannel={() => {
          setChannelNotice("");
          setIsChannelDialogOpen(true);
        }}
        onThemeToggle={() => setTheme((currentTheme) => currentTheme === "light" ? "dark" : "light")}
        onStatusChange={setProfileStatus}
        onClose={() => setIsMobileNavOpen(false)}
      />

      <main className="chat-panel">
        <ChatHeader
          title={headerTitle}
          subtitle={headerSubtitle}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuToggle={() => setIsMobileNavOpen(true)}
          showSearch={isChatView}
          participants={view === "dm-thread" ? [activePerson] : USER_LIST}
          isDirectMessage={view === "dm-thread"}
        />
        {storageError && (
          <div className="storage-alert" role="status">
            <span>{storageError}</span>
            <button type="button" className="alert-dismiss" onClick={() => setStorageError("")} aria-label="Dismiss storage message">
              <Icon name="close" size={15} />
            </button>
          </div>
        )}
        {channelNotice && (
          <div className="storage-alert channel-alert" role="status">
            <span>{channelNotice}</span>
            <button type="button" className="alert-dismiss" onClick={() => setChannelNotice("")} aria-label="Dismiss message">
              <Icon name="close" size={15} />
            </button>
          </div>
        )}

        {view === "activity" && (
          <ActivityFeed channels={channels} threads={threads} onOpenChannel={(channel) => navigate("channel", channel)} />
        )}
        {view === "direct-messages" && (
          <DirectMessages threads={threads} onOpenPerson={openDirectMessage} />
        )}
        {isChatView && (
          <>
            <MessageList
              key={`messages:${threadKey}`}
              messages={filteredMessages}
              searchQuery={searchQuery}
              onLike={likeMessage}
              onReact={reactToMessage}
              onEdit={editMessage}
              onDelete={deleteMessage}
              isTyping={isTyping}
            />
            <ChatInput
              key={`composer:${threadKey}`}
              onSend={sendMessage}
              onTyping={handleTyping}
              placeholder={view === "dm-thread" ? `Message ${activePerson}` : `Message #${activeChannel}`}
            />
          </>
        )}
      </main>
      {isChannelDialogOpen && (
        <ChannelDialog
          onCreate={createChannel}
          onClose={() => setIsChannelDialogOpen(false)}
        />
      )}
    </div>
  );
}
