import React, { useState } from 'react';

function EditProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("description", description);
    formData.append("location", location);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    try {
      const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
      const response = await fetch("http://localhost:5000/api/users/update-profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // Send the form data
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || "Profile updated successfully.");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred. Please try again.");
    }
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