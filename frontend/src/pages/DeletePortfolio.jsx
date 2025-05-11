import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Loader, X } from 'lucide-react';

export default function DeletePortfolio() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setNotification(null);

    try {
      await axios.delete(`/portfolio/${id}`);
      setNotification({ type: 'success', message: 'Portfolio deleted successfully!' });

      setTimeout(() => navigate('/profile'), 1000);
    } catch (err) {
      console.error('Failed to delete portfolio:', err.response || err.message);
      setNotification({ type: 'error', message: 'Failed to delete portfolio. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {notification && (
          <div
            className={`mb-4 p-4 rounded-lg flex justify-between items-center
              ${notification.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'}`}
          >
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Delete Portfolio</h1>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete this portfolio? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading
                ? <Loader className="w-5 h-5 animate-spin" />
                : 'Delete'}
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
    </div>
  );
}
