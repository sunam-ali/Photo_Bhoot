import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function PostLikes({ onPostAction, isLoggedIn, post }) {
  const { auth } = useAuth();
  const likes = post?.likes;
  const [showLikesModal, setShowLikesModal] = useState(false);
  return (
    <>
      <div className="px-3">
        <div className="flex items-center">
          <div
            className="h-6 flex -space-x-2  cursor-pointer"
            onClick={() => {
              if (!isLoggedIn) {
                onPostAction(true);
                return;
              }
              setShowLikesModal(true);
            }}
          >
            {likes.slice(0, 3).map((user) => (
              <img
                key={user?._id}
                src={
                  user?._id === auth?.user?._id && auth?.user?.avatar
                    ? `${import.meta.env.VITE_SERVER_BASE_URL}/${
                        auth?.user?.avatar
                      }`
                    : user?.avatar
                    ? `${import.meta.env.VITE_SERVER_BASE_URL}/${user?.avatar}`
                    : "/default-avatar.png"
                }
                alt={user.name}
                className="w-6 h-6 rounded-full"
              />
            ))}
          </div>
          <p className="text-sm ml-2">
            <span className="font-semibold">{likes.length} likes</span>
          </p>
        </div>
      </div>
      {showLikesModal && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setShowLikesModal(false)}
        >
          <div
            className="bg-white  rounded-xl p-6 w-80 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-zinc-800 ">
                Liked by ❤️
              </h2>
              <button
                onClick={() => setShowLikesModal(false)}
                className="text-xl text-zinc-600 cursor-pointer "
              >
                &times;
              </button>
            </div>
            {post.likes.length === 0 ? (
              <p className="text-sm text-zinc-500">No likes yet.</p>
            ) : (
              <ul className="space-y-2">
                {post.likes.map((user) => (
                  <Link
                    to={`/profile/${user?._id}`}
                    key={user._id}
                    className="flex items-center space-x-2"
                  >
                    <img
                      src={
                        user?._id === auth?.user?._id && auth?.user?.avatar
                          ? `${import.meta.env.VITE_SERVER_BASE_URL}/${
                              auth?.user?.avatar
                            }`
                          : user?.avatar
                          ? `${import.meta.env.VITE_SERVER_BASE_URL}/${
                              user?.avatar
                            }`
                          : "/default-avatar.png"
                      }
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-zinc-800">
                      {user?._id === auth?.user?._id
                        ? auth?.user?.name
                        : user.name}
                    </span>
                  </Link>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
