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

          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
            <p className="text-[#A0AEC0] mb-6">
              Hi, I'm Alec Thompson, Decisions: If you can't decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality).
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Full Name:</label>
                <p className="text-[#A0AEC0]">Alec M. Thompson</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Mobile:</label>
                <p className="text-[#A0AEC0]">(44) 123 1234 123</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email:</label>
                <p className="text-[#A0AEC0]">alecthompson@mail.com</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Location:</label>
                <p className="text-[#A0AEC0]">United States</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Social:</label>
                <div className="flex space-x-2 mt-1">
                  <button className="w-8 h-8 bg-primary rounded-full"></button>
                  <button className="w-8 h-8 bg-blue-400 rounded-full"></button>
                  <button className="w-8 h-8 bg-pink-500 rounded-full"></button>
                </div>
              </div>
            </div>
          </div>

          {/* Conversations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Conversations</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start space-x-3 w-full">
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
                  <button className="text-sm  text-[#4FD1C5]">REPLY</button>
                </div>
              ))}
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