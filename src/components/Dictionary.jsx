function Dictionary(props) {
    return (
        <article className="dictionary-entry">
            <div className="info-container">
                <h2 className="dictionary-title">{props.title}</h2>
                <button className="dictionary-delete-button" onClick={() => props.onDelete(props.dictionaryId)}> × </button>
                <button className="dictionary-edit-button" onClick={props.onEdit}> ✎ </button>
                <p className="dictionary-content">{props.content}</p>
                <div className="tags">
                    {props.tags.map((tag) => (
                        <span className="tag" key={tag}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    )
}

export default Dictionary;