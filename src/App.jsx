import ArticleList from './components/articleList';
import Article from './components/article';
import { useState } from 'react';
import { Pagination } from 'antd';
import { useQuery } from '@tanstack/react-query';
import FetchService from './services/fetch.service';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const App = () => {
    const [page, setPage] = useState(1);
    const { isLoading, error, data } = useQuery({
        queryKey: ['articles', page],
        queryFn: () => FetchService.fetchData(page),
        keepPreviousData: true,
    });

    if (isLoading && !data) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <BrowserRouter>
            <div className="wrapper">
                <header>
                    <h6 className="header-title">
                        <Link
                            to="/"
                            style={{ textDecoration: 'none', color: 'black' }}
                        >
                            Realworld Blog
                        </Link>
                    </h6>
                    <p className="header-title-buttons">Sign In</p>
                    <p className="header-title-buttons signin">Sign Up</p>
                </header>
                <div className="body">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <>
                                    <ArticleList articles={data.articles} />
                                    <Pagination
                                        defaultCurrent={1}
                                        total={data.articlesCount}
                                        onChange={(page) => setPage(page)}
                                        showSizeChanger={false}
                                        current={page}
                                        style={{ marginBottom: '20px' }}
                                    />
                                </>
                            }
                        />
                        <Route
                            path="/articles/*"
                            element={<ArticleList articles={data.articles} />}
                        />
                        <Route
                            path="/articles/:slug"
                            element={<Article articles={data.articles} />}
                        />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
