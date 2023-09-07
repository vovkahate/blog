import { Link } from 'react-router-dom';
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons';
import { formatDate, makeTags } from '../functions/functions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const ArticlePreview = ({ article, favorited }) => {
    const queryClient = useQueryClient();

    const isLiked = favorited.data
        ? favorited.data.articles.some((item) => item.slug === article.slug)
        : false;

    const artilceLike = async (slug) => {
        const bearer = JSON.parse(localStorage.getItem('userInfo'));
        if (!bearer) {
            return;
        }

        await axios.post(
            `https://blog.kata.academy/api/articles/${slug}/favorite`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${bearer.token}`,
                },
            }
        );

        queryClient.invalidateQueries('articles');
    };

    const artilceDisike = async (slug) => {
        const bearer = JSON.parse(localStorage.getItem('userInfo'));
        if (!bearer) {
            return;
        }

        await axios.delete(
            `https://blog.kata.academy/api/articles/${slug}/favorite`,

            {
                headers: {
                    Authorization: `Bearer ${bearer.token}`,
                },
            }
        );

        queryClient.invalidateQueries('articles');
    };

    const likeMutation = useMutation(artilceLike);
    const dislikeMutation = useMutation(artilceDisike);

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

                    {isLiked ? (
                        <HeartTwoTone
                            style={{
                                marginLeft: '10px',
                                marginRight: '5px',
                            }}
                            twoToneColor="#eb2f96"
                            onClick={() => dislikeMutation.mutate(article.slug)}
                        />
                    ) : (
                        <HeartOutlined
                            style={{
                                marginLeft: '10px',
                                marginRight: '5px',
                                color: 'rgba(0, 0, 0, 0.75)',
                            }}
                            onClick={() => likeMutation.mutate(article.slug)}
                        />
                    )}

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
                        alt="Author pic"
                    />
                </div>
            </div>
        </>
    );
};

export default ArticlePreview;
