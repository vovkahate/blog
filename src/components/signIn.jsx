import { Button, Alert, message } from 'antd';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hoc/useAuth';
import { useNavigate } from 'react-router-dom';

import noPic from '../assets/images/userHasNoPicture.svg';

const SignIn = () => {
    const { signin } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        reset,
        formState: { errors, isValid },
        handleSubmit,
    } = useForm({ mode: 'onChange' });

    const signUpMutation = useMutation(
        async (formData) => {
            const response = await axios.post(
                'https://blog.kata.academy/api/users/login ',
                formData
            );
            return response.data;
        },
        {
            onSuccess: (data) => {
                const token = data.user.token;
                const pic = data.user.image ? data.user.image : noPic;
                localStorage.setItem('userInfo', JSON.stringify(data.user));
                signin(data.user.username, token, pic, () => {
                    message.success('Logged in successfully! Welcome!');
                    navigate('/articles');
                });
            },
            onError: (error) => {
                console.log('error:', error.message);
                message.error('Error, incorrect email or password');
                reset();
            },
        }
    );

    const onSubmit = (data) => {
        const requestData = {
            user: {
                email: data.email,
                password: data.password,
            },
        };
        console.log('login request data:', requestData);
        signUpMutation.mutate(requestData);
        // reset();
    };

    return (
        <div className="newAccount">
            <div className="newAccount-wrapper">
                <h3 className="newAccount-title">Sign In</h3>
                <form
                    className="newAccount-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <label
                        htmlFor="signin-email-input"
                        className="newAccount-label"
                    >
                        Email address
                    </label>
                    <input
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address',
                            },
                        })}
                        autoComplete="new-mail"
                        className="newAccount-input"
                        id="signin-email-input"
                        type="email"
                        placeholder="Email address"
                    />
                    <div className="validate-error">
                        {errors?.email && <p>{errors?.email?.message}</p>}
                    </div>
                    <label
                        htmlFor="signin-password-input"
                        className="newAccount-label"
                    >
                        Password
                    </label>
                    <input
                        {...register('password', {
                            required: 'Password is required',
                        })}
                        className="newAccount-input"
                        id="signin-password-input"
                        type="password"
                        placeholder="Password"
                    />
                    <div className="validate-error">
                        {errors?.password && <p>{errors?.password?.message}</p>}
                    </div>

                    <Button
                        className="newAccount-button"
                        type="primary"
                        block
                        htmlType="submit"
                        disabled={!isValid}
                    >
                        Login
                    </Button>
                </form>
                {signUpMutation.isError && (
                    <Alert
                        style={{ marginTop: '10px' }}
                        message={signUpMutation.error.message}
                        description={
                            signUpMutation.error.response.data.errors.message
                        }
                        type="error"
                        showIcon
                    />
                )}
            </div>
        </div>
    );
};

export default SignIn;
