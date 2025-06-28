import { useState } from "react";
import { actions } from "../../actions";
import { useAuth } from "../../hooks/useAuth";
import { useAxios } from "../../hooks/useAxios";
import { useProfile } from "../../hooks/useProfile";

export default function EditOthersInfo() {
  const { api } = useAxios();
  const { state, dispatch } = useProfile();
  const { auth, setAuth } = useAuth();
  const [name, setName] = useState(state?.user?.name || auth?.user?.name);
  const [bio, setBio] = useState(state?.user?.bio || "");
  const [website, setWebsite] = useState(state?.user?.website || "");
  const [gender, setGender] = useState(state?.user?.gender || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateProfileInfo = async () => {
    try {
      const form = { name, bio, website, gender };
      const res = await api.patch("/api/users/me", form);
      dispatch({ type: actions.profile.USER_DATA_EDITED, data: res.data });
      setTimeout(() => {
        setAuth({
          ...auth,
          user: res.data,
        });
      }, 2000);
      setMessage("Profile info updated!");
      setError("");
    } catch (err) {
      console.error(err);
      setMessage("");
      setError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
    }
  };

  const handleSubmit = async () => {
    await updateProfileInfo();
  };

  return (
    <div className="space-y-6">
      <InputField
        label="Name"
        value={name}
        onChange={setName}
        placeholder="Enter your name"
      />
      <div className="bg-white rounded-lg p-6">
        <label className="block mb-2 font-medium">Website</label>
        <input
          type="text"
          className="form-input mb-2 w-full"
          value={website}
          placeholder="https://yourwebsite.com"
          onChange={(e) => setWebsite(e.target.value)}
        />
        <p className="text-gray-500 text-xs">
          Editing your links is only available on mobile. Visit the PhotoBooth
          app to change websites in your bio.
        </p>
      </div>
      <div className="bg-white rounded-lg p-6">
        <label className="block mb-2 font-medium">Bio</label>
        <textarea
          className="form-input resize-none h-24 w-full"
          value={bio}
          placeholder="Add bio under 150 words"
          onChange={(e) => setBio(e.target.value)}
        ></textarea>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{bio.length} / 150 words</span>
        </div>
      </div>
      <div className="bg-white rounded-lg p-6">
        <label className="block mb-2 font-medium">Gender</label>
        <div className="relative">
          <select
            className="form-input pr-8 w-full appearance-none"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Prefer not to say</option>
            <option>Custom</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {message && (
        <p className="text-green-500 text-sm text-center">{message}</p>
      )}
      <div className="flex justify-end">
        <button
          className="bg-blue-100 text-blue-500 px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-200 transition cursor-pointer"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder }) {
  return (
    <div className="bg-white rounded-lg p-6">
      <label className="block mb-2 font-medium">{label}</label>
      <input
        type="text"
        className="form-input w-full"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
