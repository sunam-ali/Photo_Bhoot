import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { actions } from "../actions";
import PostCard from "../components/post/PostCard";
import { useAuth } from "../hooks/useAuth";
import { useAxios } from "../hooks/useAxios";
import { usePost } from "../hooks/usePost";

export default function HomePage() {
  const { auth } = useAuth();
  const { state, dispatch } = usePost();
  const { api } = useAxios();
  const loaderRef = useRef(null);

  const [showPopup, setShowPopup] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const isLoggedIn = !!auth?.authToken;

  const pageRef = useRef(1);

  const fetchPosts = useCallback(async () => {
    if (!hasMore) return;

    if (!isLoggedIn && state.posts.length >= 3) {
      setHasMore(false);
      setShowPopup(true);
      return;
    }

    dispatch({ type: actions.post.DATA_FETCHING });

    try {
      const limit = isLoggedIn ? 10 : 3;
      const response = await api.get(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/posts/?page=${
          pageRef.current
        }&limit=${limit}`
      );

      if (response.status === 200) {
        const newPosts = response.data;
        if (newPosts.length === 0) {
          setHasMore(false);
        }

        const merged = [...state.posts, ...newPosts].filter(
          (post, index, self) =>
            index === self.findIndex((p) => p._id === post._id)
        );

        dispatch({
          type: actions.post.DATA_FETCHED,
          data: merged,
        });

        pageRef.current += 1;
      }
    } catch (err) {
      console.error(err);
      dispatch({ type: actions.post.DATA_FETCH_ERROR, data: err.message });
    }
  }, [hasMore, api, dispatch, state.posts, isLoggedIn]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts();
        }
      },
      {
        threshold: 1.0,
      }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [fetchPosts]);

  if (state.loading && pageRef.current === 1) {
    return <div className="text-center mt-4">Loading posts...</div>;
  }

  if (state.error) {
    return (
      <div className="text-red-400 text-center">
        Error fetching posts: {state.error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full py-10 relative">
      <div>
        {state.posts.map((post) => (
          <PostCard post={post} key={post._id} onPostAction={setShowPopup} />
        ))}
        {hasMore ? (
          <div
            ref={loaderRef}
            className="flex items-center justify-center py-6 text-gray-500 text-sm animate-pulse"
          >
            <svg
              className="animate-spin h-5 w-5 mr-2 text-[#C13584]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Loading More posts...
          </div>
        ) : (
          <div className="text-gray-400 text-center">No More Posts</div>
        )}
      </div>
      {showPopup && !isLoggedIn && (
        <div className="fixed inset-0 bg-black bg-opacity-400 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              Create an account or log in
            </h2>
            <p className="text-gray-600">
              To see more content and interact, please login or register.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/login"
                className="bg-[#C13584] text-white px-4 py-2 rounded hover:bg-pink-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
