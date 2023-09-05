import { Link } from 'react-router-dom';
import { HeartOutlined } from '@ant-design/icons';

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

const ArticleList = ({ articles }) => {
    const articleElements = articles.map((article, index) => (
        <div
            className="article-preview"
            key={article.slug}
        >
            <div className="article-info">
                <div className="title-container">
                    <Link
                        to={`/articles/${article.slug}`}
                        className="article-title"
                    >
                        {' '}
                        {article.title.charAt(0).toUpperCase() +
                            article.title.slice(1)}
                    </Link>
                    <HeartOutlined
                        style={{
                            marginLeft: '10px',
                            marginRight: '5px',
                            color: 'rgba(0, 0, 0, 0.75)',
                        }}
                    />
                    {article.favoritesCount}
                </div>
                <div>{makeTags(article.tagList)}</div>
                <div className="article-description">{article.description}</div>
            </div>
            <div className="article-profile">
                <div className="article-author">
                    <h6 className="author">{article.author.username}</h6>
                    <p className="date">{formatDate(article.createdAt)}</p>
                </div>
                <div>
                    <img
                        src={article.author.image}
                        style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: 50,
                        }}
                    />
                </div>
            </div>
        </div>
    ));
    return <div className="article-list">{articleElements}</div>;
};

export default ArticleList;
