import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import { useNavigate } from 'react-router-dom';
import Category from '../components/Category';
import Tag from '../components/Tag';
import { FaTrash } from 'react-icons/fa';
import {useSession} from '../components/Hooks'
import api from "../api";
import { toast } from 'react-toastify';



const Home: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const navigate = useNavigate();
    const currentUserRole = localStorage.getItem('role');;
    const currentUserId = localStorage.getItem('user_id');; 
    const isAuthenticated=localStorage.getItem('isAuthenticated');
console.log(currentUserRole, currentUserId);
    const handlePostClick = (postId: number) => {
        if (postId) {
            navigate(`/posts/${postId}`);
        } else {
            console.error('Post ID is undefined');
        }
    };

    const handleDeletePost = (postId: number) => {
        // Update the posts state to remove the deleted post
    
        api.delete(`/post/${postId}?user_id=${currentUserId}`)
    
        .then(response => {
            if (response.status === 200) {
                // Remove the deleted post from the posts state
                const updatedPosts = posts.filter(post => post.post_id !== postId);
                setPosts(updatedPosts);

                // Add a toast notification for successful deletion

                toast.success('Post deleted successfully');
            } else {
                console.error('Failed to delete post');
            }
        })
        .catch(error => {
            console.error('Error deleting post:', error);
        });
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-8">Recent Blog Posts</h1>
            <Category setPosts={setPosts} />
            <Tag setPosts={setPosts} />
            <ul className="space-y-4">
                {posts.map((post: any)  => (
        
                    <li key={post.post_id} className="bg-white p-4 rounded shadow">
                        <div onClick={() => handlePostClick(post.post_id)} style={{cursor: 'pointer'}}>
                            <h2 className="text-2xl font-bold mb-2">{post.title
                            }</h2>
        
                            <p className="text-gray-700">{post.content}</p>
                            <div className="text-sm text-gray-500 mt-2">
                                <span>Written by {post.author} on {new Date(post.creation_date).toDateString()}</span>
        
                            </div>
                        </div>
                        
                        {isAuthenticated && ((currentUserRole === 'admin') || (currentUserId == post.user_id)) && (
    <FaTrash 
        className="cursor-pointer relative left-full bottom-20 text-red-500 hover:text-red-700" 
        
        onClick={(e) => {
            
            e.stopPropagation(); // prevent the post click event from firing
            handleDeletePost(post.post_id);

        }}
    />
)}
                    
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;