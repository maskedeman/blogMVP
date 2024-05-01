import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../auth/Context';
import { useNavigate, useParams } from 'react-router-dom';

interface Post {
    id: string|undefined;
    title: string;
    content: string;
    author: string;
    creation_date: string;
    user_id: number|undefined;
    category: { category_id: number; category: string|null};
    tags: Tag[];
}   
type Tag = {
    tag_id: number;
    tag: string;
    
};
type Category = {
    category_id: number;
    category: string;
};

const UpdatePost: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tag, setTag] = useState('');
    const [showForm, setShowForm] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<string | null>(null);
    const [suggestedTags, setSuggestedTags] = useState<Tag[]>([]);
        const [searchTerm, setSearchTerm] = useState('');
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [post, setPost] = useState<Post | null>(null);
    const { postId } = useParams<{ postId: string }>();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const { user } = useContext(AuthContext); 



    const navigate=useNavigate();

    useEffect(() => {
        const fetchTags = async () => {
            const response = await api.get<Tag[]>('/tags/');
            setAllTags(response.data);
           
            setSuggestedTags(response.data.map(tagObj => tagObj));
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
    useEffect(() => {
        const fetchPost = async () => {
            const response = await api.get<Post>(`/posts/${postId}`);
            console.log('API response:', response);
            setPost(response.data);
            console.log('Post:', post);
        };
    
        fetchPost();
    }, [postId]);
    useEffect(() => {
        if (post && categories.length > 0 && allTags.length > 0) {
            setTitle(post.title);
            setContent(post.content);
            setCategory(post.category.category_id.toString()); 
            setSelectedTags(post.tags.map(tag => tag.tag));
        }
    }, [post, categories, allTags]);

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value);
    setSearchTerm(e.target.value);
   
};
const handleSelectTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
        setSelectedTags([...selectedTags, tag]);
    }
};
    const handleDeleteTag = (tagToRemove: string) => {
        setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
    };
    const handleUpdatePost = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const tagIds = selectedTags.map(tagName => {
            const tag = allTags.find(t => t.tag === tagName);
            return tag ? tag.tag_id.toString() : '';
        });
        const postData: Post = {
            id: postId, 
            title: title,
            author: "user?.username",
            creation_date: new Date().toISOString(),
            content: content,
            user_id:user?.user_id, 
            category: {
                category_id: category ? Number(category) : 0, 
                category: category, 
            },
            tags: selectedTags.map((tag) => {
                const tagObj = suggestedTags.find((suggestedTag) => suggestedTag.tag === tag);
                return { tag_id: tagObj ? Number(tagObj.tag_id) : 0, tag: tag };
            }), 
        };
        try {
            await updatePost(postData);
        } catch (error: any) {
            console.error('Error:', error);
            const errorMessage = error.response?.data?.detail || 'An error occurred while creating post';
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000
            });
         

        }
    };
    const updatePost = async (post: Post) => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            toast.error('Access token not found');
        }
    
        // Prepare the payload according to the required structure
        const payload = {
            title: post.title,
            author: post.author,
            creation_date: post.creation_date,
            content: post.content,
            category_id: String(post.category.category_id), 
            tag_ids: post.tags.map(tagObj => String(tagObj.tag_id)), 

        };
    
        try {
            const response = await api.put(`/post/${postId}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
    
            if (response.status === 200) {
                toast.success('Post update successful', {
                    position: "top-right",
                    autoClose: 5000
                });
                navigate(`/posts/${postId}`);
            } else {
                toast.error('Post update failed', {
                    position: "top-right",
                    autoClose: 5000
                });
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred', {
                position: "top-right",
                autoClose: 5000
            });
        }
    };
    if (!showForm) {
        return null;
    }
    return (

        <div className="fixed z-10 inset-0 overflow-y-auto" onClick={() => setShowForm(false)}>
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed transition-opacity" onClick={(e) => e.stopPropagation()}>
                <div className="absolute bg-gray-500 opacity-75"></div>
            </div>
    
            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden  transform transition-all sm:my-8 sm:align-middle w-1/2 h-1/2" onClick={(e) => e.stopPropagation()}>
                <div className="bg-white px-1 pt-5 pb-4 sm:p-6 sm:pb-4">
                      
                        <h2 className="text-2xl font-bold mb-3  mt-4 text-center">Update Post</h2>
                        <form onSubmit={handleUpdatePost}>
    <div className="mb-7 mt-7">
        <label className="block text-gray-700">Title:</label>
        <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full"
            required
        />
    </div>
    
    <div className="mb-7 mt-7">
        <label className="block text-gray-700">Content:</label>
        <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full h-40"
            required
        />
    </div>
    <div className="mb-7 mt-7">
        <label className="block text-gray-700">Category:</label>
        <select
            value={category || ''}
            onChange={(e) => setCategory((e.target.value))}
            className="mt-1 px-4 py-2 border border-gray-300 rounded-md w-full"
            required
        >
            <option value="">Select a category</option>
            {categories && categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                    {category.category}
                </option>
            ))}
        </select>
    </div>
    <div className="mb-7 mt-7">
        <label className="block text-gray-700">Tags:</label>
        {selectedTags.map((tag, index) => (
    <span
        key={index}
        className="inline-block bg-pastel-blue rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
    >
        {tag}
        <button className="font-bold ml-1 text-red-600" onClick={() => handleDeleteTag(tag)}>x</button>
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
            .filter((suggestedTag: Tag) => suggestedTag.tag.includes(searchTerm))
            .filter((suggestedTag: Tag) => !selectedTags.includes(suggestedTag.tag)) // Filter out already added tags
            .map((suggestedTag: Tag) => (
                <div
                    key={suggestedTag.tag_id}
                    onClick={() => {
                        setSelectedTags(prevTags => [...prevTags, suggestedTag.tag]);
                        setSearchTerm('');
                        setTag(''); 
                    }}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                    {suggestedTag.tag}
                </div>
            
            ))}
    </div>
)}
    </div>
    <button 
        type="submit" 
        className="w-full mb-7 mt-7 py-2 px-4 border-black text-green-700 bg-green-200 rounded cursor-pointer hover:text-yellow-300 border-2 hover:bg-custom-blue active:bg-custom-blue"
    >
        Update Post
    </button>
</form>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default UpdatePost