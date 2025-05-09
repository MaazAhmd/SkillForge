import React from 'react';
import { Timer, FileText, XCircle } from 'lucide-react';

function JobCard({ job, activeTab }) {
  const isApplied = activeTab === 'applied';

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-2">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
      </div>

      <p className="text-gray-600 mb-4 text-sm">{job.description}</p>

      <div className="flex items-center space-x-2 mb-4">
        <img
          src={job.clientId?.user?.profilePicture}
          alt={job.clientId?.user?.name}
          className="w-6 h-6 rounded-full"
        />
        <span className="text-sm text-gray-600">{job.clientId?.user?.name}</span>
      </div>

      <div className="flex items-center mt-3 justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3">
          <span className="bg-primary text-white px-3 py-1 rounded-full font-semibold text-sm">
            ${job.price}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <Timer className="h-4 w-4 mr-1" />
            {job.duration}
          </div>
        </div>

        {isApplied ? (
          <div className="flex gap-2">
            <button className="flex items-center gap-1 bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90 transition">
              <FileText className="w-4 h-4" />
              View Proposal
            </button>
            <button className="flex items-center gap-1 border border-red-500 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-50 transition">
              <XCircle className="w-4 h-4" />
              Withdraw
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {/* xs: 1 tag */}
            {job.tags?.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
              >
                {tag}
              </span>
            ))}
            {job.tags?.length > 1 && (
              <span className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-500 sm:hidden">
                +{job.tags?.length - 1}
              </span>
            )}

            {/* sm: 2 tags */}
            <div className="hidden sm:flex gap-2">
              {job.tags?.slice(1, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                >
                  {tag}
                </span>
              ))}
              {job.tags?.length > 2 && (
                <span className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-500 md:hidden">
                  +{job.tags?.length - 2}
                </span>
              )}
            </div>

            {/* md: 3 tags */}
            <div className="hidden md:flex gap-2">
              {job.tags?.slice(2, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                >
                  {tag}
                </span>
              ))}
              {job.tags?.length > 3 && (
                <span className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-500">
                  +{job.tags?.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobCard;
