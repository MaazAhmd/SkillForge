// src/pages/AddPortfolio.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, X, Loader } from 'lucide-react';
import TagInput from '../components/TagInput';
import { addPortfolio } from '../redux/slices/portfolioSlice';

export default function AddPortfolio() {
  const dispatch = useDispatch();
  const { adding, addError, items } = useSelector((s) => s.portfolio);

  const [form, setForm] = useState({
    title: '',
    description: '',
    skills: [],
    price: '',
    files: [],
    previews: []
  });
  const [notification, setNotification] = useState(null);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((f) => URL.createObjectURL(f));
    setForm((f) => ({
      ...f,
      files: [...f.files, ...files],
      previews: [...f.previews, ...previews]
    }));
  };

  const removePreview = (idx) => {
    setForm((f) => {
      URL.revokeObjectURL(f.previews[idx]);
      return {
        ...f,
        files: f.files.filter((_, i) => i !== idx),
        previews: f.previews.filter((_, i) => i !== idx)
      };
    });
  };

  useEffect(() => {
    if (!adding && items.length && notification === null) {
      setNotification({ type: 'success', message: 'Portfolio added!' });
      setForm({ title: '', description: '', skills: [], price: '', files: [], previews: [] });
    }
    if (addError) {
      setNotification({ type: 'error', message: addError });
    }

    
  }, [adding, addError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.price || form.previews.length === 0) {
      setNotification({ type: 'error', message: 'Please fill all required fields' });
      return;
    }
    // For now, send previews as imageUrls placeholder
    dispatch(addPortfolio({
      title: form.title,
      description: form.description,
      skills: form.skills,
      price: Number(form.price),
      imageUrls: form.previews
    }));
  };

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-[#f9fafb]">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-6">Add Portfolio Item</h2>

        {notification && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
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
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (USD) *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full border rounded-lg px-3 py-2 text-sm h-32 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Skills */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Skills *</label>
          <TagInput
            tags={form.skills}
            onChange={(tags) => setForm((f) => ({ ...f, skills: tags }))}
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Images *</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {form.previews.map((src, i) => (
              <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePreview(i)}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-primary transition">
              <Upload className="w-8 h-8 text-gray-400 mb-1" />
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            disabled={adding}
            className="bg-primary text-white px-6 py-2 rounded-md flex items-center gap-2 disabled:opacity-50"
          >
            {adding ? <Loader className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{adding ? 'Saving...' : 'Add Portfolio'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
