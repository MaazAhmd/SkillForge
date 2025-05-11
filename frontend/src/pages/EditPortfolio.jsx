import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

export default function EditPortfolio() {
  const { id } = useParams(); // Get the portfolio ID from the URL
  const navigate = useNavigate(); // For navigation after successful edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    skills: '',
    images: [], // Array to store existing image URLs
  });
  const [newImages, setNewImages] = useState([]); // Array to store new image files
  const [newImagePreviews, setNewImagePreviews] = useState([]); // Array to store previews of new images
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the existing portfolio data
    const fetchPortfolio = async () => {
      try {
        const { data } = await axios.get(`/portfolio/${id}`);
        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          skills: data.skills.join(', '), // Convert skills array to a comma-separated string
          images: data.imageUrls || [], // Store existing image URLs
        });
      } catch (err) {
        console.error('Failed to fetch portfolio:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files); // Store the selected image files

    // Generate previews for the selected images
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(previews);
  };

  const handleRemoveImage = (index) => {
    // Remove the image at the specified index from existing images
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveNewImage = (index) => {
    // Remove the image at the specified index from new images
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      skills: formData.skills.split(',').map((skill) => skill.trim()), // Convert skills back to an array
    };

    try {
      // Upload new images if any
      let uploadedImageUrls = [];
      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((image) => formData.append('images', image));

        const { data } = await axios.post(`/portfolio/${id}/upload-images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedImageUrls = data.imageUrls; // Get the uploaded image URLs from the response
      }

      // Update the portfolio with new data and image URLs
      await axios.put(`/portfolio/${id}`, {
        ...updatedData,
        imageUrls: [...formData.images, ...uploadedImageUrls], // Combine existing and new image URLs
      });

      alert('Portfolio updated successfully!');
      navigate(`/portfolios/${id}`); // Redirect to the portfolio details page
    } catch (err) {
      console.error('Failed to update portfolio:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-primary mb-6">Edit Portfolio</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              rows="4"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Skills (comma-separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Existing Images</label>
            <div className="flex flex-wrap gap-2">
              {formData.images.map((url, i) => (
                <div key={i} className="relative">
                  <img
                    src={url}
                    alt={`Portfolio Image ${i + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Upload New Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {newImagePreviews.map((preview, i) => (
                <div key={i} className="relative">
                  <img
                    src={preview}
                    alt={`New Image ${i + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(i)}
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}