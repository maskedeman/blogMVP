import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import api from "../api";
import { Link, useNavigate } from 'react-router-dom'; // Import the Link and useNavigate from react-router-dom

const Home: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate(); // Create a navigate function using useNavigate()

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/posts/`);
            const data = response.data;
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchPosts, 5000); // Fetch posts every 5 seconds
        return () => clearInterval(interval); // Clean up the interval on component unmount
    }, []);

    const handlePostClick = (postId: number) => {
        if (postId) {
            navigate(`/posts/${postId}`); // Navigate to the post detail page using navigate()
        } else {
            console.error('Post ID is undefined');
        }
    };

    return (
        <>
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8">Recent Blog Posts</h1>
                <ul className="space-y-4">
                {posts.map((post: any) => (
    <li key={post.post_id} className="bg-white p-4 rounded shadow">
        <div onClick={() => handlePostClick(post.post_id)} style={{cursor: 'pointer'}}> {/* Use a div instead of Link */}
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-700">{post.content}</p>
            <div className="text-sm text-gray-500 mt-2">
                <span>Written by {post.author} on {new Date(post.creation_date).toDateString()}</span>
            </div>
        </div>
    </li>
))}
                </ul>
                {isLoading && <p>Loading...</p>}
            </div>
        </>
    );
};

export default Home;