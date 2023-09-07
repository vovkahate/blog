import ArticlePreview from './articlePreview';

const ArticleList = ({ articles, favorited }) => {
    const articleElements = articles.map((article) => (
        <div
            className="article-preview"
            key={article.slug}
        >
            <ArticlePreview
                article={article}
                favorited={favorited}
            />
        </div>
    ));
    return <div className="article-list">{articleElements}</div>;
};

export default ArticleList;
