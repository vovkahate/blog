import { Link } from 'react-router-dom';
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons';
import { formatDate, makeTags } from '../functions/functions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Popconfirm, message } from 'antd';
import pic from '../assets/images/default.jpg';

const ArticlePreview = ({ article, favorited, author }) => {
    const navigate = useNavigate();
    const confirm = (e) => {
        console.log(e);
        //message.success('Click on Yes');
        deleteMutation.mutate(article.slug);
    };
    const cancel = (e) => {
        message.error('Delete cancelled');
    };

    const queryClient = useQueryClient();

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

    const articleDelete = async (slug) => {
        const bearer = JSON.parse(localStorage.getItem('userInfo'));
        if (!bearer) {
            return;
        }
        await axios.delete(`https://blog.kata.academy/api/articles/${slug}`, {
            headers: {
                Authorization: `Bearer ${bearer.token}`,
            },
        });
        queryClient.invalidateQueries('articles');
        navigate('/');
    };

    const likeMutation = useMutation(artilceLike);
    const dislikeMutation = useMutation(artilceDisike);
    const deleteMutation = useMutation(articleDelete);

    let isLiked = false;

    if (favorited.data)
        isLiked = favorited.data.articles.some(
            (item) => item.slug === article.slug
        );
    else isLiked = false;

    const handleImageError = (event) => {
        event.target.src = pic;
    };

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
            <div className="article-right-part">
                <div className="article-profile">
                    <div className="article-author">
                        <h6 className="author">{article.author.username}</h6>
                        <p className="date">{formatDate(article.createdAt)}</p>
                    </div>
                    <div>
                        <img
                            onError={handleImageError}
                            src={article.author.image}
                            style={{
                                width: '46px',
                                height: '46px',
                                borderRadius: 50,
                                marginLeft: '12px',
                            }}
                            alt="Author pic"
                        />
                    </div>
                </div>
                {author === article.author.username && (
                    <div className="article-buttons">
                        <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this article?"
                            onConfirm={confirm}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                            placement="rightTop"
                        >
                            <a className="header-edit-article delete-post">
                                Delete
                            </a>
                        </Popconfirm>
                        <Link
                            to={`/articles/${article.slug}/edit`}
                            state={{ article }}
                            className="header-edit-article"
                        >
                            Edit
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default ArticlePreview;
