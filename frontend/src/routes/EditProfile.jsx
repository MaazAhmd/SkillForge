import React, { useState } from 'react';

function EditProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle update logic here (API call or local state update)
    console.log({ name, email, phone, description, location, profilePic });
    alert("Profile updated successfully.");
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Picture */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePic(e.target.files[0])}
            className="block w-full"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
