import React from 'react';
import { Mail, Bell, Settings, ChevronLeft } from 'lucide-react';
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import ProfileCards from '../components/Profile/ProfileCards';


function Profile() {
  return (
    <div className="min-h-screen">
     

      <ProfileHeader />
      <ProfileCards />

      
    </div>
  );
}

export default Profile;