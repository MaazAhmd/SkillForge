import { useEffect, useState } from "react";
import axios from '../../api/axios';
import ProjectCard from "./ProjectCard";

export default function ProfileCards() {

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get('/portfolio');
        setProjects(data);
        console.log(data);
      } catch (err) {
        console.error('Failed to load portfolios:', err);
      }
    };
    load();
  }, []);

  
  return (
      <main className=" mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Platform Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Platform Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email me when someone follows me</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email me when someone answers on my post</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>    
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email me when someone mentions me</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Conversations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Conversations</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-start space-x-3 w-full">
                  <div className="flex items-center space-x-3 justify-start w-full">
                    <img
                      src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg"
                      alt="User"
                      className="w-14 h-14 rounded-2xl"
                    />
                    <div>
                      <h3 className="font-medium">Esther Jackson</h3>
                      <p className="text-sm text-gray-500">Hi! I need more information...</p>
                    </div>
                  </div>
                  <button className="text-sm text-[#4FD1C5]">REPLY</button>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                onClick={() => navigate(`/chat/${i}`)} // Navigate to the full chat
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full transition"
              >
                See Full Chat
              </button>
            </div>
          </div>
        </div>
      </div>

        <div className="mt-8 p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {projects.map((proj) => (
              <ProjectCard key={proj._id} project={proj} />
            ))}
          </div>
        </div>
      </main>
    );
  }
