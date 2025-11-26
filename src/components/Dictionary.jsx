function Dictionary(props) {
    return (
        <article className="dictionary-entry">
            <div className="info-container">
                <h2 className="dictionary-title">{props.title}</h2>
                <p className="dictionary-content">{props.content}</p>

                <div className="tags">
                    {props.tags.map(tag => (
                        <span className="tag" key={tag}>{tag}</span>
                    ))}
                </div>
            </div>
        </article>
    )
}

export default Dictionary;