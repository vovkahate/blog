Интерцептирование маршрутов посмотри для проверки авторизации

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
