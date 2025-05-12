import { useState, useEffect } from "react";
import axios from "../api/axios";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Loader2,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: { about: "", location: "", phone: "" },
  });
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("/users/me")
      .then(({ data }) => {
        const user = data.data;
        setForm({
          name: user.name,
          email: user.email,
          bio: user.bio,
        });
        if (user.profilePicture) {
          setPreview(user.profilePicture);
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("bio.")) {
      const key = name.split(".")[1];
      setForm((f) => ({ ...f, bio: { ...f.bio, [key]: value } }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("bio", JSON.stringify(form.bio));
      if (file) fd.append("profilePicture", file);

      const { data } = await axios.put("/users/update-profile", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(updateUserProfile(data.data));
      navigate("/profile");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-12 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Edit2 className="mr-2" /> Edit Profile
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile picture */}
        <div>
          <label className="block text-sm font-medium mb-1">Avatar</label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-full h-full text-gray-300 p-4" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="border rounded-md px-4 py-2 max-w-64"
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Name <User className="inline-block w-4 h-4 ml-1" />
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email <Mail className="inline-block w-4 h-4 ml-1" />
          </label>
          <input
            name="email"
            value={form.email}
            readOnly
            className="w-full border bg-gray-50 rounded px-3 py-2 cursor-not-allowed"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Phone <Phone className="inline-block w-4 h-4 ml-1" />
          </label>
          <input
            name="bio.phone"
            value={form.bio.phone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Location <MapPin className="inline-block w-4 h-4 ml-1" />
          </label>
          <input
            name="bio.location"
            value={form.bio.location}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* About */}
        <div>
          <label className="block text-sm font-medium mb-1">About</label>
          <textarea
            name="bio.about"
            value={form.bio.about}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-blue-600 text-white flex items-center justify-center"
        >
          {loading && <Loader2 className="animate-spin mr-2 w-5 h-5" />}
          Save Changes
        </button>
      </form>
    </div>
  );
}
