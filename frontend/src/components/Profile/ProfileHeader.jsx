import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Pencil, Home, Folder } from "lucide-react";

export function ProfileHeader({ activeTab, setActiveTab }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  if (!user) return null;

  return (
    <div
      className="h-40 md:h-48 relative mx-4 md:m-10 rounded-xl mb-16 lg:mb-28 md:mb-20 bg-cover bg-center"
      style={{
        backgroundImage: `url('${user.coverPhoto || "/images/profile.png"}')`,
      }}
    >
      <div className="absolute top-4 left-4 text-white">
        <button onClick={() => navigate(-1)} className="underline">
          Back
        </button>
      </div>

      <div className="absolute lg:-bottom-[30%] -bottom-[40%] md-bottom-[25%] left-1/2 -translate-x-1/2 w-[90%] md:w-[95%] lg:w-[97%] bg-white/60 backdrop-blur-sm rounded-3xl h-35 md:h-[70%] pt-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          {/* Avatar + name/email + edit */}
          <div className="relative flex items-center space-x-4 -mt-8">
            <img
              src={user.profilePicture || "/images/default-avatar.png"}
              alt={user.name}
              className="w-20 h-20 md:w-28 md:h-28 rounded-2xl shadow-lg object-cover"
            />
            <button
              className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow hover:bg-gray-100"
              onClick={() => navigate("/edit-profile")}
            >
              <Pencil className="w-4 h-4 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold">{user.name}</h1>
              <p className="text-sm md:text-base text-gray-600">
                {user.email}
              </p>
            </div>
          </div>

          {/* Tab buttons: only Overview & Projects */}
          <div className="flex gap-1 mt-2">
            {[
              { key: "OVERVIEW", Icon: Home, label: "Overview" },
              { key: "PROJECTS", Icon: Folder, label: "Projects" },
            ].map(({ key, Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center py-2 md:py-4 px-4 md:px-6 cursor-pointer transition ${
                  activeTab === key
                    ? "rounded-3xl shadow-sm bg-white"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline-block ml-2">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
