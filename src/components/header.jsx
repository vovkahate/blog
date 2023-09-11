import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hoc/useAuth';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const Header = () => {
    const navigate = useNavigate();

    const { signout } = useAuth();

    const handleLogout = () => {
        signout(() => {
            message.success('Logged out successfully! Good bye!');
            navigate('/articles');
        });
    };

    const { username: name, pic: userImageSrc, bearerToken: token } = useAuth();

    return (
        <>
            <header>
                <h6 className="header-title">
                    <Link
                        to="/articles"
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
                            <h6 className="header-logged-name">{name}</h6>
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
            <div className="wrapper">
                <div className="body">
                    <Outlet />
                </div>
            </div>
        </>
    );
};

export default Header;
