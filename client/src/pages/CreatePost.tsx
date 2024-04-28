import React, { useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


type Post = {
    title: string;
    content: string;
    category: string;
    tag: string;
};
const CreatePost: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState(0);
    const [tag, setTag] = useState('');
    const [showForm, setShowForm] = useState(true);

    const handleCreatePost = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Submit the form to /createPost API
        try {
            const createPost = async (post: Post) => {
                const accessToken = localStorage.getItem('accessToken');
            const response = await api.post('/createPost', post, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
             } );

            if (response.status === 200) {
                toast.success('Post creation successful', {
                    position: "top-right",
                    autoClose: 5000
                });
                setTitle(''); // Clear the title field
                setContent(''); // Clear the content field
                setCategory(0); // Reset the category field
                setTag(''); // Clear the tag field
                setShowForm(false); // Close the component
            } else {
                toast.error('Post creation failed', {
                    position: "top-right",
                    autoClose: 5000
                });
                setTitle(''); // Clear the title field
                setContent(''); // Clear the content field
                setCategory(0); // Reset the category field
                setTag(''); // Clear the tag field
            }
        }} catch (error: any) {
            console.error('Error:', error);
            const errorMessage = error.response?.data?.detail || 'An error occurred while creating post';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000
            });
            setTitle(''); // Clear the title field
            setContent(''); // Clear the content field
            setCategory(0); // Reset the category field
            setTag(''); // Clear the tag field
        }
    };

    if (!showForm) {
        return null;
    }

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto" onClick={() => setShowForm(false)}>
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-custom h-custom" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white px-1 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <button 
                            onClick={() => setShowForm(false)} 
                            className="absolute right-0 top-0 m-2 border-2 hover:border-red-400 text-black font-bold py-0 px-2 rounded"
                        >
                            X
                        </button>
                        <h2 className="text-2xl font-bold mb-3 mr-4  text-center">Create Post</h2>
                        <form onSubmit={handleCreatePost}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Title:</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Content:</label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Category:</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(Number(e.target.value))}
                                    className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full"
                                >
                                    <option value={0}>Category 1</option>
                                    <option value={1}>Category 2</option>
                                    <option value={2}>Category 3</option>
                                    {/* Add more categories as needed */}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Tag:</label>
                                <input
                                    type="text"
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                    className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full"
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="w-full py-2 px-4 border-black text-green-700 bg-green-200 rounded cursor-pointer hover:text-yellow-300 border-2 hover:bg-custom-blue active:bg-custom-blue"
                            >
                                Create Post
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost