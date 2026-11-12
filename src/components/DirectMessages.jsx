import Avatar from "./Avatar.jsx";

const people = ["Alan", "Bob", "Carol", "Dean", "Elin"];

export default function DirectMessages({ onOpenPerson, threads }) {
  return (
    <section className="directory-view">
      <div className="view-intro">
        <span className="view-kicker">PRIVATE CONVERSATIONS</span>
        <h2>Direct messages</h2>
        <p>Pick someone from your team to start a conversation.</p>
      </div>
      <div className="people-list">
        {people.map((person) => {
          const lastMessage = threads[`dm:${person}`]?.at(-1);
          return (
            <button className="person-card" type="button" key={person} onClick={() => onOpenPerson(person)}>
              <Avatar name={person} />
              <span className="person-copy">
                <strong>{person}</strong>
                <small>{lastMessage?.content ?? "Start a new conversation"}</small>
              </span>
              <span className="person-online" aria-label="Online" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
