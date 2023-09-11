import { Button, Alert, message } from 'antd';
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hoc/useAuth';
import noPic from '../assets/images/userHasNoPicture.svg';

const NewAccount = () => {
    const { signin } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        reset,
        getValues,
        formState: { errors, isValid },
        handleSubmit,
    } = useForm({ mode: 'onChange' });

    const registerMutation = useMutation(
        async (formData) => {
            const response = await axios.post(
                'https://blog.kata.academy/api/users',
                formData
            );
            return response.data;
        },
        {
            onSuccess: (data) => {
                const token = data.user.token;
                const pic = noPic;
                localStorage.setItem('userInfo', JSON.stringify(data.user));
                message.success('Signed up successfully! Welcome!');
                signin(data.user.username, token, pic, () => {
                    navigate('/articles');
                });
            },
            onError: (error) => {
                message.error('Error, try again!');
                console.log('error:', error.message);
            },
        }
    );

    const onSubmit = (data) => {
        const requestData = {
            user: {
                username: data.username,
                email: data.email,
                password: data.password,
            },
        };
        console.log('request data:', requestData);
        registerMutation.mutate(requestData);
        reset();
    };

    if (registerMutation.isLoading) {
        console.log('Loading...');
    }

    return (
        <div className="newAccount">
            <div className="newAccount-wrapper">
                <h3 className="newAccount-title">Create new account</h3>
                <form
                    className="newAccount-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <label
                        htmlFor="username-input"
                        className="newAccount-label"
                    >
                        Username
                    </label>
                    <input
                        {...register('username', {
                            required: 'Username is required',
                            minLength: {
                                value: 3,
                                message:
                                    'Username must be at least 3 characters',
                            },
                            maxLength: {
                                value: 20,
                                message:
                                    'Username must be at most 20 characters',
                            },
                        })}
                        className="newAccount-input"
                        id="username-input"
                        type="text"
                        placeholder="Username"
                    />
                    <div className="validate-error">
                        {errors?.username && (
                            <p>{errors?.username?.message || 'Error!'}</p>
                        )}
                    </div>
                    <label
                        htmlFor="email-input"
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
                        className="newAccount-input"
                        id="email-input"
                        type="email"
                        placeholder="Email address"
                    />
                    <div className="validate-error">
                        {errors?.email && <p>{errors?.email?.message}</p>}
                    </div>
                    <label
                        htmlFor="password-input"
                        className="newAccount-label"
                    >
                        Password
                    </label>

                    <input
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message:
                                    'Password must be at least 6 characters',
                            },
                            maxLength: {
                                value: 40,
                                message:
                                    'Password must be at most 40 characters',
                            },
                        })}
                        className="newAccount-input"
                        id="password-input"
                        type="password"
                        placeholder="Password"
                    />
                    <div className="validate-error">
                        {errors?.password && <p>{errors?.password?.message}</p>}
                    </div>
                    <label
                        htmlFor="repeat-password-input"
                        className="newAccount-label"
                    >
                        Repeat password
                    </label>
                    <input
                        {...register('repeatPassword', {
                            required: 'Repeat password is required',
                            validate: (value) => {
                                if (value !== getValues('password')) {
                                    return 'Passwords must match';
                                }
                            },
                        })}
                        className="newAccount-input"
                        id="repeat-password-input"
                        type="password"
                        placeholder="Repeat password"
                    />
                    <div className="validate-error">
                        {errors?.repeatPassword && (
                            <p>{errors?.repeatPassword?.message}</p>
                        )}
                    </div>

                    <label className="terms">
                        <input
                            {...register('terms', {
                                required:
                                    'You must agree to the terms and conditions',
                            })}
                            style={{ marginRight: '5px' }}
                            className="newAccount-input"
                            id="terms-checkbox"
                            type="checkbox"
                        />
                        I agree to the processing of my personal information
                    </label>

                    <Button
                        className="newAccount-button"
                        type="primary"
                        block
                        htmlType="submit"
                        disabled={!isValid}
                    >
                        Create
                    </Button>
                </form>
                {registerMutation.isError && (
                    <Alert
                        style={{ marginTop: '10px' }}
                        //message={registerMutation.error.message}
                        description={Object.entries(
                            registerMutation.error.response.data.errors
                        ).map(([key, value]) => (
                            <p key={key}>
                                <strong>{key}: </strong>
                                {value}
                            </p>
                        ))}
                        type="error"
                        showIcon
                    />
                )}
            </div>
        </div>
    );
};

export const NewAccountMemo = React.memo(NewAccount);
