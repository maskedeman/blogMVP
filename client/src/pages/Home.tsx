import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import api from "../api";
import NavBar from "../components/NavBar";


const Home: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/posts`);
            const data = response.data;
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8">Recent Blog Posts</h1>
                <ul className="space-y-4">
                    {posts.map((post: any, index: number) => (
                        <li key={post.id} className="bg-white p-4 rounded shadow">
                            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                            <p className="text-gray-700">{post.content}</p>
                            <div className="text-sm text-gray-500 mt-2">
                                <span>Written by {post.author} on {new Date(post.creation_date).toLocaleDateString()}</span>
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