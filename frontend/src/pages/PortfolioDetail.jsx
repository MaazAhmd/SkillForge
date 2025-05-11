import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { Loader } from 'lucide-react';

export default function PortfolioDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`/portfolio/${id}`);
        setItem(data);
      } catch (err) {
        console.error('Failed to load portfolio item:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Portfolio item not found.</p>
      </div>
    );
  }

  const { title, description, imageUrls, skills, price } = item;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 lg:p-10 bg-white rounded-xl shadow-lg mt-10">
        {/* Title Section */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">{title}</h1>
          <p className="text-lg text-gray-500">
            Price: <span className="font-semibold text-gray-700">${price}</span>
          </p>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {imageUrls.map((url, i) => (
            <div key={i} className="relative group overflow-hidden rounded-lg shadow-md">
              <img
                src={url}
                alt={`${title} ${i + 1}`}
                className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        {/* Description Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>

        {/* Skills Section */}
        {skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Skills Used</h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-sm bg-blue-100 text-blue-800 px-4 py-2 rounded-full shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}