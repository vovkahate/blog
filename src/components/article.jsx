import { useParams } from 'react-router-dom';
import ArticlePreview from './articlePreview';

const Article = ({ articles, favorited }) => {
    const { slug } = useParams(); // смотрю какой slug
    const article = articles.find((item) => item.slug === slug); // выбираю по slug пост из 5 текущих которые в пропсах прилетели
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const { username } = userInfo || {};

    return (
        <div className="article">
            <div className="article-preview-in-article">
                <ArticlePreview
                    article={article}
                    favorited={favorited}
                    {...(username && { author: username })} // ахах))0
                />
            </div>
            <div className="article-body">{article.body}</div>
        </div>
    );
};

export default Article;
