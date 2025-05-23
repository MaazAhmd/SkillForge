import React from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';

export default function ProjectCard({ project }) {
  const {
    _id,
    title,
    description,
    imageUrls = [],
    skills = [],
    price,
  } = project;
  const firstImage = imageUrls[0];

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl transition-shadow duration-300">
      {/* Top-right icons */}
      <div className="absolute bottom-7 right-12 flex gap-2 z-10">
        <Link to={`/portfolios/edit/${_id}`} className="text-gray-600 hover:text-green-600">
          <Pencil size={18} />
        </Link>
        <Link to={`/portfolios/delete/${_id}`} className="text-gray-600 hover:text-red-600">
          <Trash2 size={18} />
        </Link>
      </div>

      {firstImage && (
        <img
          src={firstImage}
          alt={title}
          className="w-full h-56 object-cover rounded-t-2xl"
        />
      )}


      <div className="p-6">
        <p className="text-sm text-gray-500 mb-1">
          Price: <span className="font-semibold text-gray-700">${price}</span>
        </p>
        <h3 className="font-semibold text-lg text-gray-800 mb-3">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full shadow-sm"
            >
              {skill}
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          <Link
            to={`/portfolios/${_id}`}
            className="inline-block text-sm bg-primary text-white py-2 px-6 rounded-full shadow-md hover:bg-blue-700 transition"
          >
            View All
          </Link>
        </div>
      </div>
    </div>
  );
}
