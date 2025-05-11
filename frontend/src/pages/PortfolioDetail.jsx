import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { Loader, X } from 'lucide-react';

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
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!item) {
    return <p className="text-center py-10">Portfolio item not found.</p>;
  }

  const { title, description, imageUrls, skills, price } = item;

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-sm text-[#A0AEC0] mb-6">Price: ${price}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {imageUrls.map((url, i) => (
          <div key={i} className="relative group">
            <img
              src={url}
              alt={`${title} ${i + 1}`}
              className="w-full h-60 object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700">{description}</p>
      </div>

      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Skills Used</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="text-sm bg-gray-100 px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
