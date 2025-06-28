import { actions } from "../../actions";
import { useAuth } from "../../hooks/useAuth";
import { useAxios } from "../../hooks/useAxios";
import { usePost } from "../../hooks/usePost";

export default function PostActions({
  post,
  onPostAction,
  isLoggedIn,
  alreadyLiked,
  inputRef,
}) {
  const { dispatch } = usePost();
  const { api } = useAxios();
  const { auth } = useAuth();

  const handleLike = async () => {
    if (!isLoggedIn) {
      onPostAction(true);
      return;
    }
    try {
      await api.post(`/api/posts/${post._id}/like`);
      const updatedLikedState = alreadyLiked
        ? post.likes.filter((user) => user._id !== auth.user._id)
        : [...post.likes, auth.user];
      dispatch({
        type: actions.post.POST_LIKED,
        data: {
          postId: post._id,
          updatedLikes: updatedLikedState,
        },
      });
    } catch (err) {
      console.error("Error liking post:", err.message);
    }
  };

  const handleShare = async () => {
    if (!isLoggedIn) {
      onPostAction(true);
      return;
    }
    try {
      const postLink = `${window.location.origin}/post-details/${post._id}`;
      await navigator.clipboard.writeText(postLink);
      alert("Post link copied to clipboard!");
    } catch (err) {
      alert("Failed to copy link", err);
    }
  };

  const handleCommentIconClick = () => {
    inputRef.current.focus();
    if (!isLoggedIn) {
      onPostAction(true);
      return;
    }
  };

  return (
    <>
      <div className="flex justify-between p-3">
        <div className="flex space-x-4">
          <button className="like-button" onClick={handleLike}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-6 w-6 ${
                alreadyLiked ? "fill-red-500 stroke-red-500" : "stroke-zinc-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
          <button onClick={handleCommentIconClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 stroke-zinc-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
        </div>
        <button onClick={handleShare}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 stroke-zinc-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
