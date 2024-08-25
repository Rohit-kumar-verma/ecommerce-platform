"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiRequest } from '../../lib/apiRequest.js';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'clothes',
    description: '',
    price: '',
    discount: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAuth = async () => {
      const token = localStorage.getItem('token');
      const role=localStorage.getItem("role")
      
      if (!token) {
        router.push('/login');  // Redirect to login if token is missing
        return;
      }

      if (role==='buyer') {
        router.push('/');  // Redirect to login if not an admin
      }
    };

    checkAdminAuth();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await apiRequest.get(`/api/products`);
    const data = res.data;
    setProducts(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = editMode ? `http://ecommerce-platform-lake.vercel.app/api/products/${editId}` : `http://ecommerce-platform-lake.vercel.app/api/products`;
    const method = editMode ? 'PUT' : 'POST';
    try {
      const res = await fetch(url,
        {
          method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      });
      console.log(res);
      if (res.ok) {
        fetchProducts();
        resetForm();
        router.push('/'); // Redirect after successful operation
      } else {
        alert('Failed to save product');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };
  

  const handleEdit = (product) => {
    setFormData(product);
    setEditId(product.id);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const res = await apiRequest.delete(`${process.env.BASE_URL}/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === (200 || 201)) {
      fetchProducts();
    } else {
      alert('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'clothes',
      description: '',
      price: '',
      discount: '',
    });
    setEditMode(false);
    setEditId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="mb-4 p-2 w-full border rounded text-black"
          required
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mb-4 p-2 w-full border rounded text-black"
        >
          <option value="clothes">Clothes</option>
          <option value="shoes">Shoes</option>
        </select>
        <textarea
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleChange}
          className="mb-4 p-2 w-full border text-black rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="mb-4 p-2 w-full border text-black rounded"
          required
        />
        <input
          type="number"
          name="discount"
          placeholder="Discount"
          value={formData.discount}
          onChange={handleChange}
          className="mb-4 p-2 w-full border text-black rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full  rounded hover:bg-blue-700 transition"
        >
          {editMode ? 'Update Product' : 'Add Product'}
        </button>
        {editMode && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-red-500 text-white p-2 w-full rounded mt-4 hover:bg-red-700 transition"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 &&
          products.map((product) => (
            <div key={product.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="text-gray-600">{product.category}</p>
              <p className="text-gray-800">${product.price}</p>
              {product.discount > 0 && (
                <p className="text-red-500">Discount: {product.discount}%</p>
              )}
              <button
                className="bg-yellow-500 text-white p-2 rounded mt-4 hover:bg-yellow-700 transition"
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded mt-4 hover:bg-red-700 transition"
                onClick={() => handleDelete(product.id)}
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
