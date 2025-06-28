import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function PostHeader({ post }) {
  const { auth } = useAuth();
  const isMe = auth?.user?._id === post?.user?._id;
  return (
    <div className="flex items-center p-3">
      <div className="w-8 h-8 rounded-full overflow-hidden">
        <Link to={`/profile/${post?.user?._id}`}>
          <img
            src={
              isMe && auth?.user?.avatar
                ? `${import.meta.env.VITE_SERVER_BASE_URL}/${
                    auth?.user?.avatar
                  }`
                : post.user?.avatar
                ? `${import.meta.env.VITE_SERVER_BASE_URL}/${post.user?.avatar}`
                : "/default-avatar.png"
            }
            className="w-full h-full object-cover"
            alt="user avatar"
          />
        </Link>
      </div>
      <div className="ml-2">
        <Link to={`/profile/${post?.user?._id}`}>
          <p className="font-semibold text-sm">
            {isMe ? auth?.user?.name : post.user?.name}
          </p>
        </Link>
        <span className="text-gray-500 text-xs">
          • {new Date(post.createdAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
