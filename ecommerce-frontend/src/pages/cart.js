"use client";
import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/apiRequest.js';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem('token');
      const res = await apiRequest.get(`/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.map(item => ({
        ...item,
        quantity: item.quantity || 1, // Default quantity to 1 if undefined
      }));
      setCartItems(data);
    };
    fetchCartItems();
  }, []);

  const handleRemove = async (itemId) => {
    const token = localStorage.getItem('token');
    const res = await apiRequest.delete(`/api/cart/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 200 || res.status === 201) {
      setCartItems(cartItems.filter((item) => item.id !== itemId));
      // alert('Removed item from cart');
    } else {
      alert('Failed to remove item from cart');
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    const token = localStorage.getItem('token');

    if (isNaN(quantity) || quantity < 1) {
      return;
    }  
    try {
      const res = await apiRequest.put(
        `/api/cart/${itemId}`,
        { quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200 || res.status === 201) {
        setCartItems(cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ));
      } else {
        alert('Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('An error occurred while updating the quantity');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Your Cart</h1>
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
              <p className="text-gray-600">{item.category}</p>
              <p className="text-gray-800 text-lg font-medium">${item.price}</p>
              <div className="mt-4">
                <label htmlFor={`quantity-${item.id}`} className="block text-gray-700">Quantity:</label>
                <input
                  type="number"
                  id={`quantity-${item.id}`}
                  name="quantity"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md text-black p-2 w-20"
                />
              </div>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-red-600 transition-colors"
                onClick={() => handleRemove(item.id)}
              >
                Remove from Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Your cart is empty.</p>
      )}
    </div>
  );
}
