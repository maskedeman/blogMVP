import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from "../api";
import { AuthContext } from '../auth/Context'; // replace with the actual path to your AuthContext


interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    creation_date: string;
    user_id: number;
    category: { category_id: number; category: string };
    tags: { tag_id: number; tag: string }[];
    comments: any[];
}   

const Detail: React.FC = () => {
    const [post, setPost] = useState<Post | null>(null);
    const [comment, setComment] = useState('');
    const { postId } = useParams<{ postId: string }>();
    const { user } = useContext(AuthContext); // get the user from the context

   

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/posts/${postId}`, {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                const data = response.data;
                setPost(data);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };

        fetchPost();
    }, [postId]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    
        if (!post) {
            console.error('Post is not loaded yet');
            return;
        }
       
   

    // if (isNaN(user_id) || !post_id) {
    //     console.error('Invalid user_id or post_id');
    //     return;
    // }
        const response = await fetch('http://localhost:8000/comment/', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTQyOTA3NDMsImlhdCI6MTcxNDI4ODk0Mywic2NvcGUiOiJhY2Nlc3NfdG9rZW4iLCJzdWIiOiJhZG1pbiJ9.4tF2ueGfx_cfGE8M-3CUlANj9OBdACt3kl2h453A2ko',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                comment: comment,
                user_id: user, // replace with actual user id
                post_id:postId // replace with actual post id
            })
        });
    
        const data = await response.json();
        console.log(data);
    }

    if (!post) {
        return <div>Create a Post</div>;
    }
    return (
       
        console.log(post),
        <div className="p-6 bg-white rounded  mx-auto w-full lg:w-1/2">
            <h2 className="text-2xl font-bold mb-2 text-left">{post.title}</h2>
            <p className="text-md font-bold  text-pink-500 mb-4">{post.category.category}</p>
            <p className="text-gray-700 mb-4">{post.content}</p>
            <p className="text-sm text-gray-500 mt-2 font-bold text-center">Curated by <span style={{ fontWeight: 'bold', color: 'black' }}>{post.author}</span> on <span style={{ fontWeight: 'bold', color: 'black' }}>{new Date(post.creation_date).toDateString()}</span></p><br/>
            <div className="flex flex-wrap">
                {post.tags.map((tag, index) => (
                    <span key={index} className="m-1 mb-3 text-sm py-0.5 px-2 rounded bg-blue-200 text-blue-800">{tag.tag}</span>
                ))}
            </div>
            <p className="mt-1 text-sm font-bold  text-gray-500 mb-4">Comments: {post.comments.length}</p>
            <ul className="list-disc list-inside">
                {post.comments.map((comment, index) => (
                    <li key={index} className="mb-3 text-sm text-gray-500">
                        <p>User ID: {comment.user_id}</p>
                        <p>{comment.comment}</p>
                    </li>
                ))}
            </ul>
            <div className="mt-4 overflow-auto">
            <form onSubmit={handleSubmit}>
    <label htmlFor="newComment" className="block mb-1 text-sm font-medium text-gray-700">Add a comment:</label>
    <textarea id="newComment" name="newComment" rows={3} className="shadow-md focus:ring-green-700 focus:border-green-700 mt-1 block w-full sm:text-sm border-gray-300 border-1 rounded-md" placeholder="   Your comment..." value={comment} onChange={e => setComment(e.target.value)}></textarea>
    <button type="submit" className="mt-2 py-1 px-4 border-2  border-black text-green-700 bg-green-200 rounded cursor-pointer hover:text-yellow-300  hover:bg-custom-blue active:bg-custom-blue float-right">
        Submit
    </button>
</form>
            </div>
            
        </div>
    );
};

export default Detail;