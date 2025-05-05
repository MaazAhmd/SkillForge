import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search } from 'lucide-react';

import {
  fetchJobs,
  setCategory,
  setSearchQuery,
} from '../redux/slices/jobSlice';

import CategoryTabs from '../components/Jobs/CategoryTabs';
import JobCard from '../components/Jobs/JobCard';
import OngoingProjectCard from '../components/Jobs/OngoingProjectCard';
import MessageCard from '../components/Jobs/MessageCard';
const ongoingProjects = [
  {
    title: 'Creating a database using Postgres and development of a game development system...',
    price: 5.50,
    timeLeft: '2 hours',
    author: {
      name: 'Maaz Ahmad',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2'
    }
  }
];

const messages = [
  {
    author: 'Lord Magneto',
    message: 'It was nice talking to you my nigga. You are not...',
    time: '14-April',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2'
  }
];


function Jobs() {
  const dispatch = useDispatch();
  const {
    filteredJobs,
    activeCategory,
    searchQuery,
    loading,
    error,
  } = useSelector((state) => state.job);
  console.log('Jobs:', filteredJobs, activeCategory, searchQuery, loading, error);

  const categories = ['All Categories', 'Software Development', 'Graphic Design', 'UI / UX Design', '3D Modelling', 'Website Design'];

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  
  return (
    <div className="min-h-screen lg:py-5 lg:px-8 md:py-3 md:px-5">
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onSelect={(cat) => dispatch(setCategory(cat))}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for Jobs..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full pl-10 pr-4 py-2 bg-darkgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <h2 className="text-lg font-semibold mb-4">Jobs you might like</h2>
            <div className="space-y-4 bg-darkgrey p-4 rounded-xl">
              {loading && <p>Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {!loading && filteredJobs.length === 0 && (
                <p className="text-gray-400">No jobs found.</p>
              )}
              {filteredJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={{
                    title: job.title,
                    description: job.description,
                    price: job.budget,
                    duration: job.deadline,
                    tags: job.skills,
                    author: {
                      name: job.author?.name || 'Unknown',
                      avatar: job.author?.avatar || 'https://via.placeholder.com/32',
                    },
                  }}
                />
              ))}
            </div>

          </div>
                     {/* Sidebar */}
          <div className="space-y-6">
            {/* Ongoing Projects */}
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Ongoing Projects</h2>
                <button className="text-sm text-gray-500">Sort</button>
              </div>
              {ongoingProjects.map((project, index) => (
                <OngoingProjectCard key={index} project={project} />
              ))}
            </div>

            {/* Recent Messages */}
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Recent Messages</h2>
              {messages.map((message, index) => (
                <MessageCard key={index} message={message} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Jobs;
