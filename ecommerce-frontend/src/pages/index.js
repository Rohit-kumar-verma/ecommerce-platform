"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isAdminOrSeller, setIsAdminOrSeller] = useState(false); // State to track if user is admin or seller
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const role = localStorage.getItem('role')
          setIsAdminOrSeller(role === 'admin' || role === 'seller');
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    };

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products', {
          params: {
            name: search || undefined,
            category: category || undefined,
          },
        });
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchUserRole();
    fetchProducts();
  }, [search, category]);

  const navigateToSignup = () => {
    router.push('/signup');
  };

  const navigateToLogin = () => {
    router.push('/login');
  };

  const navigateToAddProduct = () => {
    router.push('/admin/products'); // Assuming you have an /add-product page
  };

  const navigateToCart = () => {
    router.push('/cart'); // Assuming you have a /cart page
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <div className="flex gap-4">
          <button
            onClick={navigateToSignup}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Signup
          </button>
          <button
            onClick={navigateToLogin}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
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
          {/* Add more categories as needed */}
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

    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });

    if (res.ok) {
      alert('Product added to cart');
    } else {
      alert('Failed to add product to cart');
    }
  }
}
