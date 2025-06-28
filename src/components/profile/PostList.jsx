import { Link } from "react-router-dom";

export default function PostList({ posts }) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {posts?.length > 0 ? (
        posts?.map((post) => (
          <Link key={post?._id} to={`/post-details/${post?._id}`}>
            <div className="relative">
              <img
                src={`${import.meta.env.VITE_SERVER_BASE_URL}/${post?.image}`}
                alt="Post"
                className="w-full grid-image"
              />
            </div>
          </Link>
        ))
      ) : (
        <div>No Post</div>
      )}
    </div>
  );
}
