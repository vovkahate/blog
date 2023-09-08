import { useParams } from 'react-router-dom';
import ArticlePreview from './articlePreview';

const Article = ({ articles, favorited }) => {
    const { slug } = useParams();
    const article = articles.find((item) => item.slug === slug);
    const author = JSON.parse(localStorage.getItem('userInfo'));
    return (
        <div className="article">
            <div className="article-preview-in-article">
                <ArticlePreview
                    article={article}
                    favorited={favorited}
                    author={author.username}
                />
            </div>
            <div className="article-body">{article.body}</div>
        </div>
    );
};

export default Article;
