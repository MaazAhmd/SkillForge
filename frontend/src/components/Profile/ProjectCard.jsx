// src/components/ProjectCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const {
    _id,
    title,
    description,
    imageUrls = [],
    skills = [],
    price
  } = project;
  const firstImage = imageUrls[0];

  return (
    <div className="overflow-hidden bg-white rounded-2xl shadow">
      {firstImage && (
        <img
          src={firstImage}
          alt={title}
          className="w-full h-56 object-cover"
        />
      )}
      <div className="p-4">
        <p className="text-sm text-[#A0AEC0] mb-1">Price: ${price}</p>
        <h3 className="font-semibold mb-2">{title}</h3>
        <p className="text-sm text-[#A0AEC0] mb-4 line-clamp-3">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill, i) => (
            <span
              key={i}
              className="text-xs bg-gray-100 px-2 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
        <Link
          to={`/portfolios/${_id}`}
          className="inline-block text-sm border py-2 px-6 rounded-2xl text-primary hover:bg-gray-50 transition"
        >
          VIEW ALL
        </Link>
      </div>
    </div>
  );
}
