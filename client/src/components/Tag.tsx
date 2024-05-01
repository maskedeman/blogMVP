import React, { useEffect, useState } from 'react';
import api from "../api";
import { toast, ToastContainer } from 'react-toastify';
import {useSession} from '../components/Hooks'
import { FaEdit, FaTrash } from 'react-icons/fa'; 

interface Tag {
    tag_id: number;
    tag: string;
}

interface Post {
    id: number;
    title: string;
    tag: string;
}

interface TagProps {
    setPosts: (posts: Post[]) => void;
}

const Tag: React.FC<TagProps> = ({ setPosts }) => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedTag, setSelectedTag] = useState<string>('');
    const [showTags, setShowTags] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [newTag, setNewTag] = useState<string>('');
    const currentUserRole = localStorage.getItem('role');
 
    const [editingTag, setEditingTag] = useState<Tag | null>(null);

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        try {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                toast.error('Access token not found');
            }
    
            let response;
            if (editingTag) {
                response = await api.put(`/tag/${editingTag.tag_id}`, { tag: newTag }, { headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }});
            } else {
                response = await api.post('/tag/', { tag: newTag }, { headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }});
            }
    
            if (response.status === 200) {
                toast.success('Submitted successfully');
                if (editingTag) {
                    setTags(tags.map(tag => tag.tag_id === editingTag.tag_id ? { tag_id: editingTag.tag_id, tag: newTag } : tag));
                } else {
                    setTags([...tags, { tag_id: response.data.id, tag: newTag }]);
                }
                setNewTag('');
                setShowForm(false);
                setEditingTag(null);
            } else {
                toast.error('Error adding or editing tag');
                console.error('Error adding or editing tag:', response);
            }
        } catch (error) {
            toast.error('Error adding or editing tag');
            console.error('Error adding or editing tag:', error);
        }
    };
    
    const handleDeleteTag = async (tag: Tag) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the tag "${tag.tag}"?`);
        if (!confirmDelete) {
            return;
        }
    
        try {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                toast.error('Access token not found');
            }
    
            const response = await api.delete(`/tag/${tag.tag_id}`, { headers: {
                'Authorization': `Bearer ${accessToken}`,
            }});
    
            if (response.status === 200) {
                toast.success('Tag deleted successfully');
                setTags(tags.filter(t => t.tag_id !== tag.tag_id));
                setShowForm(false);
            } else {
                toast.error('Error deleting tag');
                console.error('Error deleting tag:', response);
            }
        } catch (error) {
            toast.error('Error deleting tag');
            console.error('Error deleting tag:', error);
        }
    };
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await api.get('/tags');
                const data = response.data;
                setTags(data);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    useEffect(() => {
        const fetchPostsByTag = async () => {
            try {
                let response;
                if (selectedTag) {
                    response = await api.get(`/posts?tag=${selectedTag}`);
                    if (response.data.length === 0) {
                        toast(`No blogs with tag: ${selectedTag}`);
                        response = await api.get('/posts');
                    }
                } else {
                    response = await api.get('/posts');
                }
                const data = response.data;
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts by tag:', error);
            }
        };

        fetchPostsByTag();
    }, [selectedTag, setPosts]);

    const handleTagChange = (tag: string) => {
        setSelectedTag(tag);
    };

    const toggleTags = () => {
        setShowTags(!showTags);
    };

    return (
        <div className="flex space-x-4 items-center">
            <div
                onClick={toggleTags}
                className="inline-block m-2 p-2 font-extrabold rounded-full bg-gray-500 text-white cursor-pointer"
            >
                Tags
            </div>
            <div className="categories-list max-h-64 min-w-screen-sm overflow-y-hidden" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent'
        }}>
            {showTags && tags.map((tag) => (
                <div className="group inline-flex items-center">
                    <button
                        key={tag.tag_id}
                        onClick={() => handleTagChange(tag.tag)}
                        className={`m-1 p-1 rounded-full transform transition-all duration-500 w-36 font-bold text-sm translate-y-1 hover:opacity-100 hover:translate-y-0 ${selectedTag === tag.tag ? 'bg-blue-200 text-blue-800 opacity-100' : 'bg-blue-200 text-blue-800 opacity-50'}`}
                    >
                        {tag.tag}
                    </button>
                    {currentUserRole === 'admin' && (
                        <FaEdit onClick={() => { setEditingTag(tag); setShowForm(true); }} className="ml-2 cursor-pointer text-blue-200  hover:text-blue-800" />
                    )}
                </div>
            ))}
                        </div>

            {currentUserRole === 'admin' && (
                <>
                    <button className=' font-extrabold text-2xl text-emerald-700 hover:text-pink-800'onClick={() => setShowForm(true)}>+</button>
                    {showForm && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="bg-blue-100 p-5 rounded-lg shadow-2xl max-w-md w-full space-y-1 relative">
                                <button 
                                    onClick={() => { setShowForm(false); setEditingTag(null); }} 
                                    className="absolute right-2 top-2 text-red-500 hover:text-red-700 w-6 h-4 flex items-center justify-center"
                                >
                                    x
                                </button>
                                <h2 className="mt-2 text-center text-3xl font-extrabold text-blue-800 mb-5">{editingTag ? 'Edit Tag' : 'Add Tag'}</h2>
                                <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
                                    <div className="rounded-md mt-2 shadow-sm -space-y-px">
                                        <div>
                                            <input
                                                type="text"
                                                id="tag"
                                                value={newTag}
                                                onChange={(e) => setNewTag(e.target.value)}
                                                className="appearance-none  rounded-none relative block w-full px-3 py-2 border border-blue-700  placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                placeholder="Tag"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <button 
                                            type="submit" 
                                            className="w-full py-2 px-4 border-black text-green-700 bg-green-200 rounded cursor-pointer hover:text-yellow-300 border-2 hover:bg-custom-blue active:bg-custom-blue overflow-hidden"
                                        >
                                            Add Tag
                                        </button>
                                    </div>
                                    { editingTag && (
                                        <FaTrash 
                                            onClick={() => handleDeleteTag(editingTag)} 
                                            className="cursor-pointer text-red-500 hover:text-red-700"
                                        />
                                    )}
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Tag;