export default function PostImage({post}) {
  return (
    <div className="relative">
      <img
        src={`${import.meta.env.VITE_SERVER_BASE_URL}/${post.image}`}
        alt="Post"
        className="w-full object-cover max-h-[1000px]"
      />
    </div>
  );
}
