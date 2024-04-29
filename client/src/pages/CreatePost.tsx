import React, { useState, useEffect } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WithContext as ReactTags } from 'react-tag-input';


type Post = {
    title: string;
    content: string;
    category: string;
    tag: string;
};
type Tag = {
    tag_id: number;
    tag: string;
    
};
type Category = {
    category_id: number;
    category: string;
};

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tag, setTag] = useState('');
    const [showForm, setShowForm] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<number | null>(null);
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    
    

    useEffect(() => {
        const fetchTags = async () => {
            const response = await api.get<Tag[]>('/tags/');
            setSuggestedTags(response.data.map(tagObj => tagObj.tag));
        };
    
        fetchTags();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await api.get('/categories/');
            setCategories(response.data);

        };

        fetchCategories();
    }, []);
    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTag(e.target.value);
        setSearchTerm(e.target.value);
    };
    const handleDeleteTag = (tagToRemove: string) => {
        setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
    };
    const handleCreatePost = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const postData: Post = {
            title: title,
            content: content,
            category: category ? category.toString() : '',
            tag: selectedTags.join(','),
        };
        // Submit the form to /createPost API
        try {
            // Call the createPost function here
            await createPost(postData);
        } catch (error: any) {
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
            setSelectedTags([]); // Clear the selected tags

        }
    };
    const createPost = async (post: Post) => {
        const accessToken = localStorage.getItem('accessToken');
        const response = await api.post('/posts', post, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    
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

                <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-3xl h-auto sm:h-3/4" onClick={(e) => e.stopPropagation()}>
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
                                    className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full h-40"
                                />
                            </div>
                            <div className="mb-4">
                <label className="block text-gray-700">Category:</label>
                <select
                    value={category || ''}
                    onChange={(e) => setCategory(Number(e.target.value))}
                    className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full"
                >
                    <option value="">Select a category</option>
                    {categories && categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>
                            {category.category}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
    <label className="block text-gray-700">Tags:</label>
    {selectedTags.map((tag, index) => (
        <span
            key={index}
            className="inline-block bg-pastel-blue rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
        >
            {tag}
            <button className="font-bold ml-1 text-red-600 "onClick={() => handleDeleteTag(tag)}>x</button>
        </span>
    ))}
    <input
        type="text"
        value={tag}
        onChange={handleTagChange}
        className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full"
    />
    {searchTerm && (
    <div className="border border-gray-300 rounded-md mt-2">
        {suggestedTags
            .filter((suggestedTag) => suggestedTag.includes(searchTerm))
            .filter((suggestedTag) => !selectedTags.includes(suggestedTag)) // Filter out already added tags
            .map((suggestedTag) => (
                <div
                    key={suggestedTag}
                    onClick={() => {
                        setSelectedTags(prevTags => [...prevTags, suggestedTag]);
                        setSearchTerm('');
                        setTag(''); // Clear the input field
                    }}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                    {suggestedTag}
                </div>
            ))}
    </div>
)}
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