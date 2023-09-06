import { Link } from 'react-router-dom';
import { HeartOutlined } from '@ant-design/icons';
import { formatDate, makeTags } from '../functions/functions';

const ArticlePreview = ({ article }) => {
    return (
        <>
            <div className="article-info">
                <div className="title-container">
                    <Link
                        to={`/articles/${article.slug}`}
                        className="article-title"
                    >
                        {article.title.trim()
                            ? article.title.charAt(0).toUpperCase() +
                              article.title.slice(1)
                            : 'No title'}
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
                        alt="Author picture"
                    />
                </div>
            </div>
        </>
    );
};

export default ArticlePreview;
