import { useEffect } from 'react';
import { Button, Alert, message } from 'antd';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';

const CreatePost = () => {
    const location = useLocation();
    const article = location.state;

    //console.log('article:', article);

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {
        register,
        reset,
        setValue,
        formState: { errors, isValid },
        handleSubmit,
        control,
    } = useForm({ mode: 'onChange' });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });

    useEffect(() => {
        const userInfo = location.state;
        if (userInfo) {
            const { title, description, body, tagList } = userInfo.article;
            setValue('title', title);
            setValue('short', description);
            setValue('text', body);
            tagList.forEach((item) => {
                append({ name: item });
            });
        }
    }, [setValue, append]);

    const createPostMutation = useMutation(
        async (formData) => {
            const bearer = JSON.parse(localStorage.getItem('userInfo'));
            const response = await axios.post(
                'https://blog.kata.academy/api/articles',
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
                console.log('create post', data);
                message.success('Post created successfully!');
                return queryClient.invalidateQueries('articles').then(() => {
                    navigate('/');
                });
            },
            onError: (error) => {
                message.error('Error, try again!', error.message);
            },
        }
    );

    const editPostMutation = useMutation(
        async (formData) => {
            const bearer = JSON.parse(localStorage.getItem('userInfo'));
            //console.log('data', formData);
            //console.log('article', article.article.slug);
            const id = article.article.slug;

            const response = await axios.put(
                `https://blog.kata.academy/api/articles/${id}`,
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
                console.log('edit post', data);
                message.success('Post edited successfully!');
                return queryClient.invalidateQueries('articles').then(() => {
                    navigate(`/`);
                });
            },
            onError: (error) => {
                message.error('Error, try again!', error.message);
            },
        }
    );

    const onSubmit = (data) => {
        const tags = data.items.map((item) => item.name);
        const requestData = {
            article: {
                title: data.title,
                description: data.short,
                body: data.text,
                tagList: tags,
            },
        };
        console.log('test:', requestData);
        console.log('article:', article);
        if (article) {
            editPostMutation.mutate(requestData);
        } else {
            createPostMutation.mutate(requestData);
        }
    };

    return (
        <div className="newPost">
            <div className="newAccount-wrapper">
                <h3 className="newAccount-title">Create new article</h3>
                <form
                    className="newAccount-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <label
                        htmlFor="title-input"
                        className="newAccount-label"
                    >
                        Title
                    </label>
                    <input
                        {...register('title', {
                            required: 'Title is required',
                            minLength: {
                                value: 3,
                                message: 'Title must be at least 3 characters',
                            },
                        })}
                        className="newAccount-input"
                        id="title-input"
                        type="text"
                        placeholder="Title"
                    />
                    <div className="validate-error">
                        {errors?.title && (
                            <p>{errors?.title?.message || 'Error!'}</p>
                        )}
                    </div>
                    <label
                        htmlFor="short-input"
                        className="newAccount-label"
                    >
                        Short description
                    </label>
                    <input
                        {...register('short', {
                            required: 'Description is required',
                            minLength: {
                                value: 3,
                                message:
                                    'Description must be at least 3 characters',
                            },
                        })}
                        className="newAccount-input"
                        id="short-input"
                        type="text"
                        placeholder="Description"
                    />
                    <div className="validate-error">
                        {errors?.short && <p>{errors?.short?.message}</p>}
                    </div>
                    <label
                        htmlFor="text-input"
                        className="newAccount-label"
                    >
                        Text
                    </label>

                    <textarea
                        {...register('text', {
                            required: 'Text is required',
                            minLength: {
                                value: 6,
                                message: 'Text must be at least 6 characters',
                            },
                        })}
                        className="newAccount-input"
                        id="text-input"
                        type="text"
                        placeholder="text"
                        rows={4}
                        cols={40}
                    />
                    <div className="validate-error">
                        {errors?.text && <p>{errors?.text?.message}</p>}
                    </div>
                    <div>
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="dynamic-inputs"
                            >
                                <input
                                    {...register(`items.${index}.name`, {
                                        required: 'Tag is required',
                                        minLength: {
                                            value: 2,
                                            message:
                                                'Tag must be at least 3 characters',
                                        },
                                    })}
                                    name={`items.${index}.name`}
                                    type="text"
                                    placeholder="Tag"
                                    defaultValue={field.name}
                                    className="newAccount-input "
                                />
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="tag-buttons delete"
                                >
                                    Delete
                                </button>

                                {fields.length > 0 &&
                                    index === fields.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={() => append({ name: '' })}
                                            className="tag-buttons add"
                                        >
                                            Add Tag
                                        </button>
                                    )}
                            </div>
                        ))}
                        {fields.length === 0 && (
                            <button
                                type="button"
                                onClick={() => append({ name: '' })}
                                className="tag-buttons add1"
                            >
                                Add Tag
                            </button>
                        )}
                    </div>

                    <Button
                        className="newAccount-button"
                        type="primary"
                        block
                        htmlType="submit"
                        disabled={!isValid}
                        style={{ marginTop: '8px' }}
                    >
                        Create
                    </Button>

                    {createPostMutation.isError && (
                        <Alert
                            style={{ marginTop: '10px' }}
                            message={createPostMutation.error.message}
                            type="error"
                            showIcon
                        />
                    )}
                    {editPostMutation.isError && (
                        <Alert
                            style={{ marginTop: '10px' }}
                            message={editPostMutation.error.message}
                            type="error"
                            showIcon
                        />
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
