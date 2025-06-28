import { useState } from "react";
import { actions } from "../../actions";
import { useAuth } from "../../hooks/useAuth";
import { useAxios } from "../../hooks/useAxios";
import { useProfile } from "../../hooks/useProfile";

export default function UpdateProfilePicture() {
  const { dispatch } = useProfile();
  const { auth, setAuth } = useAuth();
  const { api } = useAxios();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return;
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      const res = await api.patch("/api/users/me/avatar", formData);
      dispatch({
        type: actions.profile.IMAGE_UPDATED,
        data: res.data.user.avatar,
      });
      setTimeout(() => {
        setAuth({
          ...auth,
          user: res.data.user,
        });
      }, 2000);
      setMessage("Profile picture updated!");
      setAvatarFile(null);
    } catch (err) {
      console.error(err);
      setError("Failed to upload avatar.");
      setAvatarFile(null);
      setAvatarPreview(null);
    } finally {
      setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
    }
  };

  const handleSubmit = async () => {
    await uploadAvatar();
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="flex items-center">
        <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
          <img
            src={
              avatarPreview
                ? avatarPreview
                : auth?.user?.avatar
                ? `${import.meta.env.VITE_SERVER_BASE_URL}/${
                    auth?.user?.avatar
                  }`
                : "/default-avatar.png"
            }
            alt="Saad Hasan"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-semibold text-base">{auth?.user?.name}</h2>
          <p className="text-gray-500">{auth?.user?.email}</p>
        </div>
        {!avatarFile ? (
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="ml-auto text-sm"
          />
        ) : (
          <button
            onClick={handleSubmit}
            className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition cursor-pointer"
          >
            Confirm
          </button>
        )}
      </div>
      <p
        className={`text-center ${message && "text-green-700"} ${
          error && "text-red-700"
        }`}
      >
        {message && message}
        {error && error}
      </p>
    </div>
  );
}
