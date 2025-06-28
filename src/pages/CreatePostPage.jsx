import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { actions } from "../actions";
import { useAuth } from "../hooks/useAuth";
import { useAxios } from "../hooks/useAxios";
import { usePost } from "../hooks/usePost";

export default function CreatePostPage() {
  const { api } = useAxios();
  const { auth } = useAuth();
  const { dispatch } = usePost();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!image || !caption.trim()) {
      setError("Both image and caption are required.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    try {
      setLoading(true);
      const res = await api.post("/api/posts", formData);
      if (res.status === 201 || res.status === 200) {
        const fullPost = await api.get(`/api/posts/${res.data._id}`);
        dispatch({ type: actions.post.DATA_CREATED, data: fullPost.data });
        setImage(null);
        setCaption("");
        setPreview("");
        navigate("/");
      }
    } catch (err) {
      setError("Failed to create post. Try again.", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="h-14 border-b flex items-center justify-between px-4">
        <button onClick={() => navigate(-1)} className="p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
        <h1 className="text-base font-semibold">Create new post</h1>
        <button
          onClick={handleSubmit}
          className="text-blue-500 font-semibold disabled:opacity-50 cursor-pointer"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </header>

      <div className="upload-container flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center relative">
          {preview ? (
            <img
              src={preview}
              alt="Upload preview"
              className="image-preview max-h-[450px]"
            />
          ) : (
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className="text-center p-8 text-gray-500">
                Click to select an image
              </div>
            </label>
          )}

          {preview && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <button className="bg-black bg-opacity-75 text-white text-sm py-1 px-3 rounded-md">
                Click photo to tag people
              </button>
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 bg-white flex flex-col">
          <div className="flex items-center p-4 border-b">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300">
              <img
                src={
                  auth?.user?.avatar
                    ? `${import.meta.env.VITE_SERVER_BASE_URL}/${
                        auth?.user?.avatar
                      }`
                    : "/default-avatar.png"
                }
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="ml-3 font-semibold text-sm">
              {auth?.user?.name}
            </span>
          </div>

          <div className="p-4 border-b flex-grow">
            <div className="mb-2">
              <p className="font-medium text-base mb-2">Caption Section</p>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full caption-input border-0 outline-none text-sm"
                placeholder="Write a caption..."
              ></textarea>
            </div>

            <div className="flex justify-between items-center">
              <button className="text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <span className="text-gray-400 text-xs">
                {caption.length}/2200
              </span>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <div className="flex flex-col">
            <button className="flex items-center justify-between p-4 border-b">
              <span className="text-base text-gray-600">Add location</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            <button className="flex items-center justify-between p-4 border-b">
              <span className="text-base text-gray-600">Add collaborators</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </button>

            <button className="flex items-center justify-between p-4 border-b">
              <span className="text-base text-gray-600">Accessibility</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <button className="flex items-center justify-between p-4">
              <span className="text-base text-gray-600">Advanced settings</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
