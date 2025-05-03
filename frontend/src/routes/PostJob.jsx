import React, { useEffect, useState } from 'react';
import { Calendar, Upload, X, Loader } from 'lucide-react';
import TagInput from '../components/TagInput';
import { postJob, resetJobState } from '../redux/slices/jobSlice';
import { useDispatch, useSelector } from "react-redux";


function PostJob() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: [],
    budget: '',
    deadline: '',
    files: [],
    previews: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null); // use null for consistent type checking
  const { loading, error, success } = useSelector((state) => state.job);


  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...files],
        previews: [...prev.previews, ...newPreviews]
      }));
    }
  };

  const removeImage = (index) => {
    setFormData(prev => {
      const newFiles = prev.files.filter((_, i) => i !== index);
      const newPreviews = prev.previews.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev.previews[index]);
      return { ...prev, files: newFiles, previews: newPreviews };
    });
  };

  useEffect(() => {
    if (success) {
      setNotification({ type: 'success', message: 'Job successfully posted!' });
      setFormData({
        title: '',
        description: '',
        skills: [],
        budget: '',
        deadline: '',
        files: [],
        previews: [],
      });
      dispatch(resetJobState());
    }
  
    if (error) {
      setNotification({ type: 'error', message: error });
    }
  }, [success, error, dispatch]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.budget || !formData.deadline) {
      setNotification({
        type: 'error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      dispatch(postJob(formData)).then((action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          setFormData({
            title: '',
            description: '',
            skills: [],
            budget: '',
            deadline: '',
            files: [],
            previews: [],
          });
     
        }
      });

    } catch (error) {
    }
  };

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-[#f9fafb]">
      <form onSubmit={handleSubmit}>
        <div className="max-w-6xl mx-auto bg-gray-100 rounded-xl p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Form Section */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Post Project</h2>

            {notification && (
              <div className={`mb-6 p-4 rounded-lg ${
                notification.type === 'success' 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-800'
              }`}>
                {notification.message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Project Title */}
              <div>
                <label className="text-sm font-medium block mb-1">Project Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none  focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div className="md:row-span-2 md:mb-6">
                <label className="text-sm font-medium block mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  required
                  className="w-full border rounded-lg px-3 py-2 text-sm h-40 md:h-full focus:ring-2 focus:ring-blue-500 focus:outline-none  focus:border-transparent"
                />
              </div>

              {/* Skills Input */}
              <div>
                <label className="text-sm font-medium block mb-1">Skills Needed *</label>
                <TagInput 
                onChange={(tags) => setFormData(prev => ({ ...prev, skills: tags }))}
                required
              />

              </div>

              {/* Budget */}
              <div>
                <label className="text-sm font-medium block mb-1">Budget *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">USD</span>
                  </div>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({...prev, budget: e.target.value}))}
                    required
                    className="w-full border rounded-lg px-3 py-2 text-sm pl-16 focus:ring-2 focus:ring-blue-500 focus:outline-none  focus:border-transparent"
                    placeholder="Estimated budget"
                    min="0"
                  />
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="text-sm font-medium block mb-1">Deadline *</label>
                <div className="relative">
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({...prev, deadline: e.target.value}))}
                    required 
                    className="w-full border rounded-lg px-3 py-2 text-sm pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* File Upload Section */}
              <div className="col-span-full">
                <label className="text-sm font-medium block mb-2">Additional Files</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.previews.map((preview, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <label
                    htmlFor="file-upload"
                    className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer flex flex-col items-center justify-center"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 text-center px-2">Add Files</span>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleImageChange}
                      multiple
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:brightness-90 text-white px-6 py-2 rounded-md text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                    <>
                    <Upload className="w-4 h-4" />
                  Post Project
                  </>

                )}
              </button>
            </div>
          </div>

          {/* Right Tips */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Quick Tips for Posting a Project</h3>
            <ul className="text-sm text-gray-700 space-y-3 list-decimal list-inside">
                <li>
                <strong>Project Title</strong>
                <ul className="list-disc list-inside ml-4 text-gray-600">
                    <li>Keep it short, specific, and clearly describe the type of work.</li>
                </ul>
                </li>
                <li>
                <strong>Project Description</strong>
                <ul className="list-disc list-inside ml-4 text-gray-600">
                    <li>Explain what needs to be done, outcomes, and technical needs.</li>
                    <li>Include examples, tools, key deliverables.</li>
                </ul>
                </li>
                <li>
                <strong>Category & Tags</strong>
                <ul className="list-disc list-inside ml-4 text-gray-600">
                    <li>Choose relevant tags like React, API Integration.</li>
                    <li>Don’t use vague or broad tags.</li>
                </ul>
                </li>
                <li>
                <strong>Budget</strong>
                <ul className="list-disc list-inside ml-4 text-gray-600">
                    <li>Set a realistic budget, you can negotiate later.</li>
                </ul>
                </li>
                <li>
                <strong>Deadline</strong>
                <ul className="list-disc list-inside ml-4 text-gray-600">
                    <li>Mention if it's flexible or strict.</li>
                </ul>
                </li>
                <li>
                <strong>Additional Files (Optional)</strong>
                <ul className="list-disc list-inside ml-4 text-gray-600">
                    <li>Include mockups, docs, or examples.</li>
                    <li>Only upload relevant and clean files.</li>
                </ul>
                </li>
            </ul>
            </div>
        </div>
      </form>
    </div>
  );
}

export default PostJob;