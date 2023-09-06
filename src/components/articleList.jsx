import ArticlePreview from './articlePreview';

const ArticleList = ({ articles }) => {
    const articleElements = articles.map((article) => (
        <div
            className="article-preview"
            key={article.slug}
        >
            <ArticlePreview article={article} />
        </div>
    ));
    return <div className="article-list">{articleElements}</div>;
};

export default ArticleList;
