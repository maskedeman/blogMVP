import React, { useEffect, useState } from 'react';
import api from "../api";
import { toast, ToastContainer } from 'react-toastify';
import {useSession} from '../components/Hooks'
import { FaEdit, FaTrash } from 'react-icons/fa'; 


interface Category {
    category_id: number;
    category: string;
}

interface Post {
    id: number;
    title: string;
    category: string;
}
interface CategoryProps {
    setPosts: (posts: Post[]) => void;
}
const Category: React.FC<CategoryProps> = ({ setPosts }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [newCategory, setNewCategory] = useState<string>('');
    const currentUserRole = localStorage.getItem('role');
   
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        try {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                toast.error('Access token not found');
            }
    
            let response;
            if (editingCategory) {
                response = await api.put(`/category/${editingCategory.category_id}`, { category: newCategory }, { headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }});
            } else {
                response = await api.post('/category/', { category: newCategory }, { headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }});
            }
    
            if (response.status === 200||201) {
                toast.success('Submitted successfully');
                if (editingCategory) {
                    setCategories(categories.map(category => category.category_id === editingCategory.category_id ? { category_id: editingCategory.category_id, category: newCategory } : category));
                } else {
                    setCategories([...categories, { category_id: response.data.id, category: newCategory }]);
                }
                setNewCategory('');
                setShowForm(false);
                setEditingCategory(null);
            } else {
                toast.error('Error adding or editing category');
                console.error('Error adding or editing category:', response);
            }
        } catch (error) {
            toast.error('Error adding or editing category');
            console.error('Error adding or editing category:', error);
        }
    };
    
    const handleDeleteCategory = async (category: Category) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the category "${category.category}"?`);
        if (!confirmDelete) {
            return;
        }
    
        try {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                toast.error('Access token not found');
            }
    
            const response = await api.delete(`/category/${category.category_id}`, { headers: {
                'Authorization': `Bearer ${accessToken}`,
            }});
    
            if (response.status === 200) {
                toast.success('Category deleted successfully');
                setCategories(categories.filter(c => c.category_id !== category.category_id));
                setShowForm(false);

            } else {
                toast.error('Error deleting category');
                console.error('Error deleting category:', response);
            }
        } catch (error) {
            toast.error('Error deleting category');
            console.error('Error deleting category:', error);
        }
    };
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories'); // Replace with your API endpoint
                const data = response.data;
                
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
                let response;
                if (selectedCategory) {
                    response = await api.get(`/posts?category=${selectedCategory}`);
                    if (response.data.length === 0) {
                        toast(`No blogs in category: ${selectedCategory}`);
                        response = await api.get('/posts');
                    }
                } else {
                    response = await api.get('/posts');
                }
                const data = response.data;
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts by category:', error);
            }
        };

        fetchPostsByCategory();
    }, [selectedCategory, setPosts]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    const toggleCategories = () => {
        setShowCategories(!showCategories);
    };
   
    return (
        <div className="flex space-x-4 items-center ">
            <div
                onClick={toggleCategories}
                className="inline-block  m-2 p-2 font-extrabold rounded-full bg-gray-500 text-white cursor-pointer"
            >
                Categories
            </div>
            <div className="categories-list max-h-64 min-w-screen-sm overflow-y-hidden" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent'
        }}>

            {showCategories && categories.map((category) => (
    <div className="group inline-flex items-center">
        <button
            key={category.category_id}
            onClick={() => handleCategoryChange(category.category)}
            className={`m-1 p-1 rounded-full transform transition-all duration-500 w-36 font-bold text-sm translate-y-1 hover:opacity-100 hover:translate-y-0 ${selectedCategory === category.category ? 'bg-pink-200 text-pink-800 opacity-100' : 'bg-pink-500 text-pink-300 opacity-50'}`}
        >
            {category.category}
        </button>
        
        {currentUserRole === 'admin' && (
            <FaEdit onClick={() => { setEditingCategory(category); setShowForm(true); }} className="ml-2 cursor-pointer text-pink-200  hover:text-pink-800" />
        )}
    </div>
))}
    </div>

           {currentUserRole === 'admin' && (
    <>
        <button className=' font-extrabold text-2xl text-emerald-700 hover:text-pink-800'onClick={() => setShowForm(true)}>+</button>
        {showForm && (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-pink-300 p-5 rounded-lg shadow-2xl max-w-md w-full space-y-1 relative">
            <button 
                onClick={() => { setShowForm(false); setEditingCategory(null); }} 
                className="absolute right-2 top-2 text-red-500 hover:text-red-700 w-6 h-4 flex items-center justify-center"
            >
                x
            </button>
            <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 mb-5">{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
            <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
                 <div className="rounded-md mt-2 shadow-sm -space-y-px">
                     <div>
                         <input
                             type="text"
                             id="category"
                             value={newCategory}
                             onChange={(e) => setNewCategory(e.target.value)}
                             className="appearance-none  rounded-none relative block w-full px-3 py-2 border border-pink-700  placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                             placeholder="Category"
                             required
                         />
                     </div>
                 </div>
                 <div>
                     <button 
                         type="submit" 
                         className="w-full py-2 px-4 border-black text-green-700 bg-green-200 rounded cursor-pointer hover:text-yellow-300 border-2 hover:bg-custom-blue active:bg-custom-blue overflow-hidden"
                     >
                         Add Category
                     </button>
                 </div>
                { editingCategory && (
                    <FaTrash 
                        onClick={() => handleDeleteCategory(editingCategory)} 
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

export default Category;