import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

export default function DeletePortfolio() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const handleDelete = async () => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    if (!token) {
      alert('You are not authorized to perform this action.');
      return;
    }
  
    if (window.confirm('Are you sure you want to delete this portfolio?')) {
      try {
        console.log('Deleting portfolio with ID:', id);
        const response = await axios.delete(`/portfolio/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        });
        console.log('Delete response:', response.data);
        alert('Portfolio deleted successfully!');
        navigate('/portfolios'); // Redirect to the portfolio list
      } catch (err) {
        console.error('Failed to delete portfolio:', err.response || err.message);
        alert('Failed to delete portfolio. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Delete Portfolio</h1>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete this portfolio? This action cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
          >
            Delete
          </button>
          <button
            onClick={() => navigate(`/portfolios/${id}`)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}