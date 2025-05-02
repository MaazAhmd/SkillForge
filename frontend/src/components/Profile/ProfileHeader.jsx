import { ChevronLeft, Mail, Bell, Settings, Users, Folder, Home } from 'lucide-react';
import { useState } from 'react';

export function ProfileHeader() {
    const [activeTab, setActiveTab] = useState('OVERVIEW');

  return (
    <>
      <div
        className="h-40 md:h-48 relative mx-4 md:m-10 rounded-xl mb-16 lg:mb-28 md:mb-20 bg-cover bg-center"
        style={{
            backgroundImage: `url('images/profile.png')`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Back Navigation */}
          <div className="flex items-center space-x-2 text-white py-4">
            <span>Profile</span>
          </div>
        </div>

        {/* White Overlay with Profile */}
        <div className="absolute lg:-bottom-20 md:-bottom-26 left-1/2 -translate-x-1/2 w-[90%] md:w-[95%] lg:w-[97%] bg-white/60 backdrop-blur-sm rounded-3xl h-40 md:h-52 lg:h-32 pt-12 px-4 md:px-6">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
            {/* Profile Left Section */}
            <div className="flex items-center space-x-2 md:space-x-4 -mt-8  lg:-mt-10 md:mb-4">
              <img
                src="https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg"
                alt="Esthera Jackson"
                className="w-20 h-20 md:w-28 md:h-28 rounded-xl md:rounded-2xl shadow-lg"
              />
              <div>
                <h1 className="text-lg md:text-xl font-bold">Esthera Jackson</h1>
                <p className="text-sm md:text-base text-gray-600">estherad@example.com</p>
              </div>
            </div>

            {/* Right Icons - Mobile optimized */}
            <div className="flex gap-1 mt-4 md:mt-0">
              <button 
                onClick={() => setActiveTab('OVERVIEW')}
                className={`flex items-center py-2 md:py-4 px-4 md:px-4 cursor-pointer ${
                  activeTab === 'OVERVIEW' 
                    ? 'rounded-3xl shadow-sm bg-white' 
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Home className="w-4 h-4 mr-0 md:mr-2" />
                <span className="hidden md:inline-block ml-2">OVERVIEW</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('TEAMS')}
                className={`flex items-center py-2 md:py-4 px-4 md:px-10 cursor-pointer ${
                  activeTab === 'TEAMS' 
                    ? 'rounded-3xl shadow-sm bg-white' 
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Users className="w-4 h-4 mr-0 md:mr-2" />
                <span className="hidden md:inline-block ml-2">TEAMS</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('PROJECTS')}
                className={`flex items-center py-2 md:py-4 px-4 md:px-10 cursor-pointer ${
                  activeTab === 'PROJECTS' 
                    ? 'rounded-3xl shadow-sm bg-white' 
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Folder className="w-4 h-4 mr-0 md:mr-2" />
                <span className="hidden md:inline-block ml-2">PROJECTS</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}