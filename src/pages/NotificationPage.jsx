import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAxios } from "../hooks/useAxios";
import { usePost } from "../hooks/usePost";

export default function NotificationPage() {
  const { api } = useAxios();
  const { state } = usePost();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="p-4">Loading notifications...</div>;

  return (
    <div className="notifications-container">
      <header className="sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-semibold">Notifications</h1>
        </div>
      </header>

      <div className="notifications-list">
        {notifications.length === 0 && (
          <p className="p-4 text-gray-500 text-sm">No notifications yet.</p>
        )}

        {notifications.map((notification) => {
          const { _id, fromUser, type, postId, createdAt } = notification;
          const fullPost = state?.posts.find((post) => post._id === postId);
  
          const timeAgo = moment(createdAt).fromNow();
          const avatarSrc = fromUser?.avatar
            ? `${import.meta.env.VITE_SERVER_BASE_URL}/${fromUser?.avatar}`
            : "/default-avatar.png";

          const message =
            type === "like"
              ? "liked your post."
              : type === "comment"
              ? "commented on your post."
              : "interacted with your post.";

          return (
            <div
              key={_id}
              className={`notification-item flex items-center p-4 border-b border-gray-100 `}
            >
              <Link to={`/profile/${fromUser?._id}`} className="mr-3">
                <div className="w-11 h-11 rounded-full overflow-hidden">
                  <img
                    src={avatarSrc}
                    alt={`${fromUser?.name}'s avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>

              <div className="flex-1 mr-3">
                <p className="text-sm">
                  <Link
                    to={`/profile/${fromUser?._id}`}
                    className="font-semibold hover:underline"
                  >
                    {fromUser?.name}
                  </Link>{" "}
                  {message}
                </p>
                <p className="text-xs text-gray-500 mt-1">{timeAgo}</p>
              </div>

              <Link to={`/post-details/${postId}`}>
                <div className="w-11 h-11 rounded overflow-hidden border border-gray-200">
                  <img
                    src={`${import.meta.env.VITE_SERVER_BASE_URL}/${
                      fullPost?.image
                    }`}
                    alt="Post thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
