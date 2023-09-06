const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};

const makeTags = (tags) => {
    if (tags.length === 0) {
        return <span className="tag">no tag</span>;
    }
    const tagsList = tags.map((tag, index) => (
        <span
            className="tag"
            key={index}
        >
            {tag}
        </span>
    ));
    return tagsList;
};

export { formatDate, makeTags };
