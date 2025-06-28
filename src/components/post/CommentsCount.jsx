import { useNavigate } from "react-router-dom";

export default function CommentsCount({ post }) {
  const navigate = useNavigate();
  return (
    <div className="px-3 mt-1 ">
      {post?.comments?.length > 0 && (
        <button
          onClick={() => navigate(`/post-details/${post._id}`)}
          className="text-gray-500 text-sm cursor-pointer"
        >
          View all {post?.comments.length} comments...
        </button>
      )}
    </div>
  );
}
