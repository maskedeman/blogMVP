import React, { useEffect, useState } from 'react';

interface Category {
    id: number;
    name: string;
}

interface Post {
    id: number;
    title: string;
    category: string;
}

const Category: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories'); // Replace with your API endpoint
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPostsByCategory = async () => {
            try {
                const response = await fetch(`/api/posts?category=${selectedCategory}`); // Replace with your API endpoint
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts by category:', error);
            }
        };

        fetchPostsByCategory();
    }, [selectedCategory]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    return (
        <div>
            <div>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.name)}
                        style={{
                            display: 'inline-block',
                            margin: '0.5rem',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            backgroundColor: selectedCategory === category.name ? '#eaeaea' : '#ffffff',
                        }}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
            <div>
                {posts.map((post) => (
                    <div
                        key={post.id}
                        style={{
                            display: 'inline-block',
                            margin: '0.5rem',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            backgroundColor: '#eaeaea',
                        }}
                    >
                        {post.title}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;