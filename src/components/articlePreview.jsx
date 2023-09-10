import { Link } from 'react-router-dom';
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons';
import { formatDate, makeTags } from '../functions/functions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Popconfirm, message } from 'antd';
import pic from '../assets/images/default.jpg';
import { useAuth } from '../hoc/useAuth';

const ArticlePreview = ({ article, favorited, author }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { bearerToken: token } = useAuth();

    const confirm = () => {
        deleteMutation.mutate(article.slug);
    };
    const cancel = () => {
        message.error('Delete cancelled');
    };

    const masterMutation = async (slug, type) => {
        if (!token) {
            //navigate('/sign-in');
            message.error('You must be logged in to perform this action');
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                url: `https://blog.kata.academy/api/articles/${slug}`,
            };

            switch (type) {
                case 'like':
                    config.url += '/favorite';
                    await axios.post(config.url, null, config);
                    break;
                case 'dislike':
                    config.url += '/favorite';
                    await axios.delete(config.url, config);
                    break;
                case 'delete':
                    await axios.delete(config.url, config);
                    queryClient.invalidateQueries('articles');
                    navigate('/');
                    return;
                default:
                    throw new Error(`Invalid type: ${type}`);
            }
            queryClient.invalidateQueries('articles');
        } catch (error) {
            console.log('error: ', error);
        }
    };

    const likeMutation = useMutation((slug) => masterMutation(slug, 'like'));
    const dislikeMutation = useMutation((slug) =>
        masterMutation(slug, 'dislike')
    );
    const deleteMutation = useMutation((slug) =>
        masterMutation(slug, 'delete')
    );

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
                            onClick={() =>
                                dislikeMutation.mutate(article.slug, 'dislike')
                            }
                        />
                    ) : (
                        <HeartOutlined
                            style={{
                                marginLeft: '10px',
                                marginRight: '5px',
                                color: 'rgba(0, 0, 0, 0.75)',
                            }}
                            onClick={() =>
                                likeMutation.mutate(article.slug, 'like')
                            }
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
