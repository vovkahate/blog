import React from 'react';
import ArticleList from './components/articleList';
import Article from './components/article';
import { useState, useEffect } from 'react';
import { Pagination } from 'antd';
import { useQuery } from '@tanstack/react-query';
import FetchService from './services/fetch.service';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import { NewAccountMemo } from './components/signUp';
import SignIn from './components/signIn';
import EditProfile from './components/editProfile';
import CreatePost from './components/createPost';

const App = () => {
    const [page, setPage] = useState(1);
    const [hasToken, setHasToken] = useState(false);
    const [bearer, setBearer] = useState(null);
    const [name, setName] = useState('');

    const checkToken = React.useCallback(() => {
        const userData = JSON.parse(localStorage.getItem('userInfo'));
        if (userData) {
            setHasToken(true);
            setBearer(userData.token);
        } else {
            setHasToken(false);
        }
    }, [setHasToken, setBearer]);
    useEffect(() => {
        const storedName = JSON.parse(localStorage.getItem('userInfo'));
        if (storedName) {
            setName(storedName.username);
        }
    }, []);

    useEffect(() => {
        checkToken();
        window.addEventListener('storage', checkToken);
        return () => {
            window.removeEventListener('storage', checkToken);
        };
    }, []);

    const { isLoading, error, data } = useQuery({
        queryKey: ['articles', page],
        queryFn: () => FetchService.fetchData(page, bearer),
        keepPreviousData: true,
    });

    const favorited = useQuery({
        queryKey: ['favorited', name, bearer],
        queryFn: () => FetchService.fetchFavorited(bearer, name),
        enabled: !!name && !!bearer,
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
                <Header
                    token={hasToken}
                    checkToken={checkToken}
                    bearer={bearer}
                />
                <div className="body">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <>
                                    <ArticleList
                                        articles={data.articles}
                                        favorited={favorited}
                                    />
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
                        {/* <Route
                            path="/articles/*"
                            element={<ArticleList articles={data.articles} />}
                        /> */}
                        <Route
                            path="/articles/:slug"
                            element={
                                <Article
                                    articles={data.articles}
                                    favorited={favorited}
                                />
                            }
                        />
                        <Route
                            path="/sign-up"
                            element={<NewAccountMemo checkToken={checkToken} />}
                        />
                        <Route
                            path="/sign-in"
                            element={<SignIn checkToken={checkToken} />}
                        />
                        <Route
                            path="/profile"
                            element={
                                <EditProfile
                                    token={hasToken}
                                    checkToken={checkToken}
                                />
                            }
                        />
                        <Route
                            path="/new-article"
                            element={<CreatePost />}
                        />
                        <Route
                            path="/articles/:slug/edit"
                            element={<CreatePost />}
                        />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default App;
