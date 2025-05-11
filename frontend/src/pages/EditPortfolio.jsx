import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Upload, X, Loader } from 'lucide-react';
import TagInput from '../components/TagInput';

export default function EditPortfolio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    skills: [],        // array for TagInput
    price: '',
    existingImages: [],// URLs
    newFiles: [],      // File[]
    newPreviews: []    // blob URLs
  });

  // notifications
  const [notification, setNotification] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(true);

  // fetch existing portfolio
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/portfolio/${id}`);
        setForm({
          title: data.title,
          description: data.description,
          price: data.price,
          skills: data.skills,
          existingImages: data.imageUrls || [],
          newFiles: [],
          newPreviews: []
        });
      } catch (err) {
        setNotification({ type: 'error', message: 'Failed to load portfolio.' });
      } finally {
        setLoadingFetch(false);
      }
    })();
  }, [id]);

  // handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSkillsChange = (tags) => {
    setForm(f => ({ ...f, skills: tags }));
  };

  const handleNewFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map(f => URL.createObjectURL(f));
    setForm(f => ({
      ...f,
      newFiles: [...f.newFiles, ...files],
      newPreviews: [...f.newPreviews, ...previews]
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeExisting = (idx) => {
    setForm(f => ({
      ...f,
      existingImages: f.existingImages.filter((_, i) => i !== idx)
    }));
  };

  const removeNew = (idx) => {
    setForm(f => {
      URL.revokeObjectURL(f.newPreviews[idx]);
      return {
        ...f,
        newFiles: f.newFiles.filter((_, i) => i !== idx),
        newPreviews: f.newPreviews.filter((_, i) => i !== idx)
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price ) {
      setNotification({ type: 'error', message: 'Please fill all required fields.' });
      return;
    }

    setLoadingSubmit(true);
    setNotification(null);

    try {
      let uploadedUrls = [];
      if (form.newFiles.length) {
        const fd = new FormData();
        form.newFiles.forEach(f => fd.append('images', f));
        const { data } = await axios.post(
          `/portfolio/${id}/upload-images`,
          fd,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        uploadedUrls = data.imageUrls;
      }

      await axios.put(`/portfolio/${id}`, {
        title: form.title,
        description: form.description,
        price: form.price,
        skills: form.skills,
        imageUrls: [...form.existingImages, ...uploadedUrls]
      });

      setNotification({ type: 'success', message: 'Portfolio updated!' });
      setForm(f => ({
        ...f,
        newFiles: [],
        newPreviews: []
      }));
      setTimeout(() => navigate(`/portfolios/${id}`), 1000);

    } catch (err) {
      setNotification({ type: 'error', message: 'Update failed. Please try again.' });
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingFetch) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-[#f9fafb]">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow"
      >
        <h2 className="text-2xl font-semibold mb-6">Edit Portfolio Work</h2>

        {notification && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              notification.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Title & Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (USD) *</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
          />
        </div>

        {/* Skills */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Skills *</label>
          <TagInput tags={form.skills} onChange={handleSkillsChange} />
        </div>

        {/* Existing Images */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Existing Images</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {form.existingImages.map((url, i) => (
              <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExisting(i)}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upload New Images */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Upload New Images</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {form.newPreviews.map((src, i) => (
              <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNew(i)}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary transition">
              <Upload className="w-8 h-8 text-gray-400 mb-1" />
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleNewFiles}
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            disabled={loadingSubmit}
            className="bg-primary cursor-pointer text-white px-6 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
          >
            {loadingSubmit
              ? <Loader className="w-4 h-4 animate-spin" />
              : <Upload className="w-4 h-4" />}
            <span>{loadingSubmit ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
