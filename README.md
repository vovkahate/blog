Интерцептирование маршрутов посмотри для проверки авторизации

Стоит обратить внимание, что на странице регистрации и редактирования профиля при отправке запроса могут вернуться ошибки связанные с уникальностью и валидность юзернейма и почты. Их само собой нужно обрабатывать. Банально почта может уже использоваться в системе, а юзернейм быть занятым кем-то.

Я уже чисто от себя накинул фишку на проверку валидности картинку. Я вставил тег img, спрятал его и накинул на него методы <img onLoad={} onError={} /> и обрабатывал, если ссылка ведет на несуществующую картнку

import { Link } from 'react-router-dom';
import userNoPic from '../assets/images/userHasNoPicture.svg';
import { useNavigate } from 'react-router-dom';

const Header = () => {
const navigateTo = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigateTo('/');
    };

    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;

    // Остальной код

    return (
        <header>
            {/* Остальной JSX код */}
            {isLoggedIn ? (
                <>
                    {/* Отображение компонентов для авторизованного пользователя */}
                    <Link onClick={handleLogout} className="header-title-buttons logout">
                        Log Out
                    </Link>
                </>
            ) : (
                <>
                    {/* Отображение компонентов для неавторизованного пользователя */}
                    <Link to="/sign-in" className="header-title-buttons">
                        Sign In
                    </Link>
                    <Link to="/sign-up" className="header-title-buttons signin">
                        Sign Up
                    </Link>
                </>
            )}
        </header>
    );

};

export default Header;

import { useQuery } from '@tanstack/react-query';

const ArticlePreview = ({ article }) => {
const queryClient = useQueryClient();

    // Добавляем запрос на получение данных с подпиской на обновления
    const { data } = useQuery('articleLikes', () =>
        axios.get(`https://blog.kata.academy/api/articles/${article.slug}/likes`)
    );

    const articleLikes = data?.likes || 0; // Получаем количество лайков из данных

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
    const likeMutation = useMutation(artilceLike);

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
                    <HeartOutlined
                        style={{
                            marginLeft: '10px',
                            marginRight: '5px',
                            color: 'rgba(0, 0, 0, 0.75)',
                        }}
                        onClick={() => likeMutation.mutate(article.slug)}
                    />
                    {articleLikes} {/* Отображаем количество лайков */}
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
