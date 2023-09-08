import { Link } from 'react-router-dom';
import userNoPic from '../assets/images/userHasNoPicture.svg';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const Header = ({ token, checkToken, bearer }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        console.log('Token has changed:', bearer);
    }, [bearer]);

    const handleLogout = () => {
        localStorage.clear();
        setTimeout(() => {
            location.reload();
        }, 500);
        window.location.href = '/';
    };

    const userData = JSON.parse(localStorage.getItem('userInfo'));
    const userName = userData ? userData.username : '';
    const userImageSrc = userData
        ? userData.image
            ? userData.image
            : userNoPic
        : userNoPic;

    return (
        <header>
            <h6 className="header-title">
                <Link
                    to="/"
                    style={{ textDecoration: 'none', color: 'black' }}
                >
                    Realworld Blog
                </Link>
            </h6>
            {!token ? (
                <>
                    <Link
                        to="/sign-in"
                        className="header-title-buttons"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/sign-up"
                        className="header-title-buttons signin"
                    >
                        Sign Up
                    </Link>
                </>
            ) : (
                <div className="header-have-token">
                    <Link
                        to="/new-article"
                        className="header-create-article"
                    >
                        Create article
                    </Link>
                    <Link
                        to="/profile"
                        style={{ textDecoration: 'none' }}
                    >
                        <h6 className="header-logged-name">{userName}</h6>
                    </Link>
                    <Link to="/profile">
                        <img
                            src={userImageSrc}
                            alt="user"
                            className="header-user-image"
                        />
                    </Link>

                    <div
                        onClick={handleLogout}
                        className="header-title-buttons logout"
                    >
                        Log Out
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
