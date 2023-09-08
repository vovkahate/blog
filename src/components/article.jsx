import { useParams } from 'react-router-dom';
import ArticlePreview from './articlePreview';

const Article = ({ articles, favorited }) => {
    const { slug } = useParams();
    const article = articles.find((item) => item.slug === slug);
    return (
        <div className="article">
            <div className="article-preview-in-article">
                <ArticlePreview
                    article={article}
                    favorited={favorited}
                />
            </div>
            <div className="article-body">{article.body}</div>
        </div>
    );
};

export default Article;
