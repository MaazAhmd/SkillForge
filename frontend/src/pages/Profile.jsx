import React, { useState } from "react";
import { ProfileHeader } from "../components/Profile/ProfileHeader";
import ProfileCards from "../components/Profile/ProfileCards";

function Profile() {
  const [activeTab, setActiveTab] = useState("OVERVIEW");

  return (
    <div className="min-h-screen">
      <ProfileHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <ProfileCards activeTab={activeTab} />
    </div>
  );
}

export default Profile;
