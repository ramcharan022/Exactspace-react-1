import Avatar from "./Avatar.jsx";

export default function ActivityFeed({ channels, threads, onOpenChannel }) {
  const activityItems = channels
    .map((channel) => {
      const lastMessage = threads[`channel:${channel}`]?.at(-1);
      return lastMessage ? { channel, message: lastMessage } : null;
    })
    .filter(Boolean)
    .sort((first, second) => new Date(second.message.timestamp) - new Date(first.message.timestamp));

  return (
    <section className="activity-view">
      <div className="view-intro">
        <span className="view-kicker">YOUR WORKSPACE</span>
        <h2>Activity</h2>
        <p>Catch up on the latest conversations across your channels.</p>
      </div>
      {activityItems.length ? (
        <div className="activity-list">
          {activityItems.map(({ channel, message }) => (
            <button className="activity-card" type="button" key={channel} onClick={() => onOpenChannel(channel)}>
              <Avatar name={message.author} />
              <span className="activity-copy">
                <span><strong>{message.author}</strong> posted in <b>#{channel}</b></span>
                <span className="activity-message">{message.content}</span>
                <span className="activity-time">{new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date(message.timestamp))}</span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="directory-empty"><span>✦</span><h3>All caught up</h3><p>New channel activity will show up here.</p></div>
      )}
    </section>
  );
}
