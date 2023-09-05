import ArticleList from './components/articleList';
import Article from './components/article';
import { useState } from 'react';
import { Pagination } from 'antd';
import axios from 'axios';
import { useQuery } from 'react-query';
import {} from 'react-router-dom';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const App = () => {
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 5;
    async function fetchData(pageNumber) {
        const offset = (pageNumber - 1) * PAGE_SIZE;

        const response = await axios.get(
            `https://blog.kata.academy/api/articles?offset=${offset}&limit=${PAGE_SIZE}`
        );

        console.log(response.data);
        return response.data;
    }

    const { isLoading, error, data } = useQuery(
        ['articles', page],
        () => fetchData(page),
        {
            keepPreviousData: true,
        }
    );

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
                    <h6 className="header-title">Realworld Blog</h6>
                    <div className="header-title-buttons">Sign In</div>
                    <div className="header-title-buttons signin">Sign Up</div>
                </header>
                <div className="body">
                    <Routes>
                        <Route
                            path="/articles/*"
                            element={<ArticleList articles={data.articles} />}
                        />
                        <Route
                            path="/articles/:id"
                            element={<Article />}
                        />
                    </Routes>
                </div>
                <Pagination
                    defaultCurrent={1}
                    total={data.articlesCount}
                    onChange={(page) => setPage(page)}
                    showSizeChanger={false}
                    current={page}
                    style={{ marginBottom: '20px' }}
                />
            </div>
        </BrowserRouter>
    );
};

export default App;
