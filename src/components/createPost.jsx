import { Button } from 'antd';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {
        register,
        reset,
        formState: { errors, isValid },
        handleSubmit,
        control,
    } = useForm({ mode: 'onChange' });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });

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
            },
            onError: (error) => {
                console.log('error:', error.message);
            },
        }
    );

    const onSubmit = (data) => {
        const requestData = {
            article: {
                title: data.title,
                description: data.short,
                body: data.text,
                tags: data.items,
            },
        };
        console.log('request data:', requestData);
        createPostMutation.mutate(requestData);
        queryClient.invalidateQueries('articles');
        navigate('/articles');

        //reset();
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
                                            value: 3,
                                            message:
                                                'Tag must be at least 3 characters',
                                        },
                                    })}
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
                                className="tag-buttons add"
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
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
