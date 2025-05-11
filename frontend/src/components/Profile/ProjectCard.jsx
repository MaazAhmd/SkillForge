import React from 'react';
import { Link } from 'react-router-dom';

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
    <div className="overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      {firstImage && (
        <img
          src={firstImage}
          alt={title}
          className="w-full h-56 object-cover rounded-t-2xl"
        />
      )}
      <div className="p-6">
        <p className="text-sm text-gray-500 mb-1">Price: <span className="font-semibold text-gray-700">${price}</span></p>
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
          <Link
            to={`/portfolios/edit/${_id}`}
            className="inline-block text-sm bg-green-500 text-white py-2 px-6 rounded-full shadow-md hover:bg-green-600 transition"
          >
            Edit
          </Link>
          <Link
            to={`/portfolios/delete/${_id}`}
            className="inline-block text-sm bg-red-500 text-white py-2 px-6 rounded-full shadow-md hover:bg-red-600 transition"
          >
            Delete
          </Link>
        </div>
      </div>
    </div>
  );
}