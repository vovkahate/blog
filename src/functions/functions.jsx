import axios from 'axios';
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

const artilceLike = async (slug, queryClient) => {
    const bearer = JSON.parse(localStorage.getItem('userInfo'));
    if (!bearer) {
        return;
    }

    await axios.post(
        `https://blog.kata.academy/api/articles/${slug}/favorite`,
        null,
        {
            headers: {
                Authorization: `Bearer ${bearer.token}`,
            },
        }
    );

    queryClient.invalidateQueries('articles');
};

export { formatDate, makeTags, artilceLike };
