function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
  const day = getOrdinal(date.getDate());
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${dayOfWeek} ${day} ${month} ${year}`;
}

function Journal(props) {
  return (
    <article className="journal-entry-row">
      <div className="info-container">
        <p className="journal-date">{formatDate(props.date)}</p>
        <p className="journal-content">{props.content}</p>

        <div className="tags">
          {props.tags && props.tags.map(tag => (
            <span className="tag" key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default Journal;