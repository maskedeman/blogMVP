import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../components/Hooks';
import api from "../api";
import { toast } from 'react-toastify';
import { FaTrash, FaEdit } from 'react-icons/fa';

const MyPosts: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const navigate = useNavigate();
    const currentUserRole = localStorage.getItem('role');;
    const currentUserId = localStorage.getItem('user_id');; 
    const isAuthenticated=localStorage.getItem('isAuthenticated');

  

    useEffect(() => {
        api.get(`/posts?user_id=${currentUserId}`)
            .then(response => {
                if (response.status === 200) {
                    setPosts(response.data);
                } else {
                    console.error('Failed to fetch posts');
                }
            })
            .catch(error => console.error('Error:', error));
    }, [currentUserId]);

    const handlePostClick = (postId: number) => {
        if (postId) {
            navigate(`/posts/${postId}`);
        } else {
            console.error('Post ID is undefined');
        }
    };
    const handleEditPost = (postId: number) => {
        if (postId) {
            navigate(`/update-post/${postId}`);
        } else {
            console.error('Post ID is undefined');
        }
    };
    const handleDeletePost = (postId: number) => {
        api.delete(`/post/${postId}?user_id=${currentUserId}`)
            .then(response => {
                if (response.status === 200) {
                    const updatedPosts = posts.filter(post => post.post_id !== postId);
                    setPosts(updatedPosts);
                    toast.success('Post deleted successfully');
                } else {
                    console.error('Failed to delete post');
                }
            })
            .catch(error => console.error('Error deleting post:', error));
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-8">My Blog Posts</h1>
            {posts.length > 0 ? (
            <ul className="space-y-4">
                {posts.map((post: any) => (
                   <li key={post.post_id} className="bg-white p-4 rounded shadow">
                   <div className="flex justify-between">
                       <div onClick={() => handlePostClick(post.post_id)} style={{cursor: 'pointer'}}>
                           <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                           <p className="text-gray-700">{post.content}</p>
                           <div className="text-sm text-gray-500 mt-2">
                               <span>Written by {post.author} on {new Date(post.creation_date).toDateString()}</span>
                           </div>
                       </div>
                       {isAuthenticated && (currentUserRole === 'admin' || post.user_id == currentUserId) && (
                           <div className="flex items-start space-x-2">
                               <FaEdit 
                                   className="cursor-pointer text-black-500 hover:text-blue-700" 
                                   onClick={(e) => {
                                       e.stopPropagation();
                                       handleEditPost(post.post_id);
                                   }}
                               />
                               <FaTrash 
                                   className="cursor-pointer text-red-500 hover:text-red-700" 
                                   onClick={(e) => {
                                       e.stopPropagation();
                                       handleDeletePost(post.post_id);
                                   }}
                               />
                           </div>
                       )}
                   </div>
               </li>
                ))}
            </ul>
            ) : (
                <main className="grid min-h-full  place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="mt-6 text-base leading-7 text-gray-600">No blogs to show.<br/><span onClick={() => navigate('/create')} className='mt-4  text-md font-bold tracking-tight text-gray-900 sm:text-3xl hover:cursor-pointer '> Curate now</span></p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
          </div>
        </div>
      </main>
           
            )}
        </div>
    );
};

export default MyPosts;