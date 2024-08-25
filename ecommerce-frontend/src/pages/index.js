"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiRequest } from '../lib/apiRequest.js';
import axios from 'axios';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isAdminOrSeller, setIsAdminOrSeller] = useState(false); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if the user is logged in
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const role = localStorage.getItem('role')
          setIsAdminOrSeller(role === 'admin' || role === 'seller');
          setIsLoggedIn(true); // Set the user as logged in
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    };

    const fetchProducts = async () => {
      try {
        const { data } = await apiRequest.get('/api/products');
        const newData = data.filter(item => {
          const matchesName = search ? item.name.toLowerCase().includes(search.toLowerCase()) : true;
          const matchesCategory = category ? item.category === category : true;
          return matchesName && matchesCategory;
        });
        setProducts(newData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchUserRole();
    fetchProducts();
  }, [search, category]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    router.push('/');
  };

  const navigateToCart = () => {
    router.push('/cart'); 
  };

  const navigateToAddProduct = () => {
    router.push('/admin/products');
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <div className="flex gap-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push('/signup')}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Signup
              </button>
              <button
                onClick={() => router.push('/login')}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
            </>
          )}
          <button
            onClick={navigateToCart}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
          >
            View Cart
          </button>
          {isAdminOrSeller && (
            <button
              onClick={navigateToAddProduct}
              className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Add More Product
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="clothes">Clothes</option>
          <option value="shoes">Shoes</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? products.map((product) => (
          <div key={product.id} className="bg-white border border-gray-300 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
            <p className="text-gray-600">{product.category}</p>
            <p className="text-gray-800 text-lg font-medium">${product.price}</p>
            {product.discount > 0 && (
              <p className="text-red-500 mt-1">Discount: {product.discount}%</p>
            )}
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-green-600 transition-colors"
              onClick={() => addToCart(product.id)}
            >
              Add to Cart
            </button>
          </div>
        )) : (
          <p className="text-gray-500">No products found</p>
        )}
      </div>
    </div>
  );

  async function addToCart(productId) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }
    console.log(token);
    const res = await axios('https://ecommerce-platform-nine.vercel.app/api/cart', 
      {
        post,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body:productId
      }
    );
      console.log(res);
    if (res.status===(201||200)) {
      alert('Product added to cart');
    } else {
      alert('Failed to add product to cart');
    }
  }
}
