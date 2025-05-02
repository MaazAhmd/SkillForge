import { Timer } from 'lucide-react';
import React from 'react';

function OngoingProjectCard({ project }) {
  return (
    <div className="rounded-lg p-3 mb-3">
      <h3 className="text-sm font-medium mb-2">{project.title}</h3>
      <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
          <span className="bg-primary text-white px-3 py-1 rounded-full font-semibold">$ {project.price}</span>
          <div className="flex justify-center items-center gap-1">
          <Timer className='h-5 w-5'/>
          <div className="text-gray-500 mt-1">{project.timeLeft}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <img
            src={project.author.avatar}
            alt={project.author.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-gray-600">{project.author.name}</span>
        </div>
      </div>
    </div>
  );
}

export default OngoingProjectCard;
