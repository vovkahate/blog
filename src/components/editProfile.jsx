import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Button, Alert } from 'antd';
import { useEffect } from 'react';

const EditProfile = ({ token, checkToken }) => {
    const bearer = JSON.parse(localStorage.getItem('userInfo'));

    const {
        register,
        reset,
        formState: { errors, isValid },
        handleSubmit,
        setValue,
    } = useForm({ mode: 'onChange' });

    const editMutation = useMutation(
        async (formData) => {
            const response = await axios.put(
                'https://blog.kata.academy/api/user',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${bearer.token}`,
                    },
                }
            );
            return response.data;
        },
        {
            onSuccess: (data) => {
                const token = data.user.token;
                localStorage.setItem('userInfo', JSON.stringify(data.user));
                console.log(
                    'update: token записан в глобальное состояние',
                    token
                );
                checkToken();
            },
            onError: (error) => {
                console.log('error:', error.message);
            },
        }
    );

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { username, email, password, image } = JSON.parse(userInfo);
            setValue('username', username);
            setValue('email', email);
            setValue('password', password);
            setValue('avatar', image);
        }
    }, [setValue]);
    const onSubmit = (data) => {
        const requestData = {
            user: {
                email: data.email,
                username: data.username,
                password: data.password,
                image: data.avatar,
            },
        };
        console.log('login request data:', requestData);
        editMutation.mutate(requestData);
    };

    return (
        <div className="newAccount">
            <div className="newAccount-wrapper">
                <h3 className="newAccount-title">Edit Profile</h3>
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
                        htmlFor="password-input"
                        className="newAccount-label"
                    >
                        New password
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
                        htmlFor="avatar"
                        className="newAccount-label"
                    >
                        Avatar image (url)
                    </label>
                    <input
                        {...register('avatar', {
                            pattern: {
                                value: /^(ftp|http|https):\/\/[^ "]+$/,
                                message: 'Invalid URL format',
                            },
                        })}
                        className="newAccount-input"
                        id="avatar"
                        type="text"
                        placeholder="Avatar image path"
                    />
                    <div className="validate-error">
                        {errors?.avatar && <p>{errors?.avatar?.message}</p>}
                    </div>

                    <Button
                        className="newAccount-button"
                        type="primary"
                        block
                        htmlType="submit"
                        disabled={!isValid}
                    >
                        Save
                    </Button>
                </form>
                {editMutation.isError && (
                    <Alert
                        style={{ marginTop: '10px' }}
                        message={editMutation.error.message}
                        description={
                            editMutation.error.response.data.errors.message
                        }
                        type="error"
                        showIcon
                    />
                )}
                {editMutation.isSuccess && (
                    <Alert
                        style={{ marginTop: '10px' }}
                        message="Done!"
                        description="Data successfully updated"
                        type="success"
                        showIcon
                    />
                )}
            </div>
        </div>
    );
};

export default EditProfile;
