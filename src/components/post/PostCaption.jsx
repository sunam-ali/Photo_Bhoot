import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function PostCaption({ post }) {
  const { auth } = useAuth();
  const isME = auth?.user?._id === post?.user?._id;
  const [showFullCaption, setShowFullCaption] = useState(false);
  const isCaptionLong = post.caption?.length > 100;
  const displayedCaption = showFullCaption
    ? post.caption
    : post.caption.slice(0, 100);

  return (
    <div className="px-3 mt-2 text-sm">
      <p>
        <span className="font-semibold">
          {isME ? auth?.user?.name : post.user?.name}
        </span>{" "}
        <span>{displayedCaption}</span>
        {isCaptionLong && (
          <button
            onClick={() => setShowFullCaption((prev) => !prev)}
            className="ml-2 text-blue-500 font-medium"
          >
            {showFullCaption ? "Show Less" : "Show More"}
          </button>
        )}
      </p>
    </div>
  );
}
