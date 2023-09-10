import ArticleList from './components/articleList';
import Article from './components/article';
import { useState } from 'react';
import { Pagination } from 'antd';
import { useQuery } from '@tanstack/react-query';
import FetchService from './services/fetch.service';
import { Routes, Route } from 'react-router-dom';
import Header from './components/header';
import SignIn from './components/signIn';
import EditProfile from './components/editProfile';
import CreatePost from './components/createPost';
import RequireAuth from './hoc/requireAuth';
import { NewAccountMemo } from './components/signUp';
import { useAuth } from './hoc/useAuth';

const App = () => {
    const [page, setPage] = useState(1);
    const { username: name, bearerToken: bearer } = useAuth();

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
        <Routes>
            <Route
                path="/"
                element={<Header />}
            >
                <Route
                    index
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

                <Route
                    path="articles/:slug"
                    element={
                        <Article
                            articles={data.articles}
                            favorited={favorited}
                        />
                    }
                />
                <Route
                    path="sign-up"
                    element={<NewAccountMemo />}
                />
                <Route
                    path="sign-in"
                    element={<SignIn />}
                />
                <Route
                    path="profile"
                    element={
                        <RequireAuth>
                            <EditProfile
                                token={bearer}
                                checkToken={bearer}
                            />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/new-article"
                    element={
                        <RequireAuth>
                            <CreatePost />
                        </RequireAuth>
                    }
                />
                <Route
                    path="/articles/:slug/edit"
                    element={
                        <RequireAuth>
                            <CreatePost />
                        </RequireAuth>
                    }
                />
                <Route
                    path="*"
                    element={<h1>404</h1>}
                />
            </Route>
        </Routes>
    );
};

export default App;
