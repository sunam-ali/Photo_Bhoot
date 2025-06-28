import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { actions } from "../actions";
import { useAuth } from "../hooks/useAuth";
import { useAxios } from "../hooks/useAxios";
import { usePost } from "../hooks/usePost";
import { formatTimeAgo } from "../utils/formattedTime";

export default function PostDetailsPage() {
  const { auth } = useAuth();
  const { dispatch } = usePost();
  const inputRef = useRef();

  const { id } = useParams();
  const { api } = useAxios();
  const [comment, setComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [postDetails, setPostDetails] = useState({});
  const [morePosts, setMorePosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showLikesModal, setShowLikesModal] = useState(false);

  const alreadyLiked = postDetails?.likes?.find?.(
    (user) => user._id === auth?.user?._id
  );

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const res = await api.get(`/api/posts/${id}`);
        setPostDetails(res.data);
      } catch (err) {
        setError("Failed to load post details", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPostDetails();
  }, [api, id]);

  useEffect(() => {
    const fetchMorePosts = async () => {
      if (postDetails?.user?._id) {
        try {
          const res = await api.get(
            `/api/posts/user/${postDetails?.user?._id}`
          );
          const otherPosts = res.data.posts.filter(
            (p) => p._id !== postDetails._id
          );
          setMorePosts(otherPosts);
        } catch (err) {
          console.error("Error loading more posts", err);
        }
      }
    };
    fetchMorePosts();
  }, [postDetails, api]);

  const handleLike = async () => {
    try {
      await api.post(`/api/posts/${postDetails._id}/like`);
      const updatedLikedState = alreadyLiked
        ? postDetails.likes.filter((user) => user._id !== auth.user._id)
        : [...postDetails.likes, auth.user];

      setPostDetails((prev) => ({
        ...prev,
        likes: updatedLikedState,
      }));
      dispatch({
        type: actions.post.POST_LIKED,
        data: {
          postId: postDetails._id,
          updatedLikes: updatedLikedState,
        },
      });
    } catch (err) {
      console.error("Error liking post:", err.message);
    }
  };

  const handleShare = async () => {
    try {
      const postLink = `${window.location.origin}/post-details/${postDetails._id}`;
      await navigator.clipboard.writeText(postLink);
      alert("Post link copied to clipboard!");
    } catch (err) {
      alert("Failed to copy link", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    try {
      const res = await api.post(`/api/posts/${postDetails._id}/comment`, {
        text: comment,
      });
      const newComment = res.data.comment;
      setPostDetails((prev) => ({
        ...prev,
        comments: [...prev.comments, newComment],
      }));
      dispatch({
        type: actions.post.POST_COMMENTED,
        data: {
          postId: postDetails._id,
          newComment,
        },
      });
      setComment("");
    } catch (err) {
      console.error("Error adding comment:", err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/api/posts/comment/${commentId}`);
      setPostDetails((prev) => ({
        ...prev,
        comments: prev.comments.filter((comment) => comment._id !== commentId),
      }));
      dispatch({
        type: actions.post.POST_COMMENT_DELETED,
        data: {
          postId: postDetails._id,
          commentId,
        },
      });
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editingCommentText.trim()) return;
    try {
      const res = await api.patch(`/api/posts/comment/${commentId}`, {
        text: editingCommentText,
      });
      setPostDetails((prev) => ({
        ...prev,
        comments: prev.comments.map((comment) =>
          comment._id === commentId ? res.data.comment : comment
        ),
      }));
      dispatch({
        type: actions.post.POST_COMMENT_EDITED,
        data: {
          postId: postDetails._id,
          updatedComment: res.data.comment,
        },
      });

      setEditingCommentId(null);
      setEditingCommentText("");
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  if (loading)
    return <p className="text-center p-6">Loading Post Details...</p>;
  if (error) return <p className="text-center text-red-500 p-6">{error}</p>;
  if (!postDetails) return null;

  return (
    <div className="max-w-6xl w-full py-10 ml-[var(--sidebar-width)] px-4">
      <div className="bg-white border rounded-sm overflow-hidden mb-8 mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-black flex items-center">
            <img
              src={
                postDetails?.image
                  ? `${import.meta.env.VITE_SERVER_BASE_URL}/${
                      postDetails?.image
                    }`
                  : "/default-avatar.png"
              }
              alt="Post image"
              className="w-full post-image"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="flex items-center justify-between p-3 border-b">
              <Link to={`/profile/${postDetails?.user._id}`}>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <div className="w-full h-full rounded-full overflow-hidden bg-white">
                      <img
                        src={
                          postDetails?.user?.avatar
                            ? `${import.meta.env.VITE_SERVER_BASE_URL}/${
                                postDetails?.user?.avatar
                              }`
                            : "/default-avatar.png"
                        }
                        alt="User avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>
                  <div className="ml-2">
                    <div className="flex items-center">
                      <span className="font-semibold text-sm">
                        {postDetails.user.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-[10px] text-gray-600">
                        {new Date(postDetails.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="p-3">
              <p className="text-sm ">{postDetails.caption}</p>
            </div>

            <div className="comments-section flex-grow p-3 border-b">
              <h3 className="font-bold pb-4">
                Comments ({postDetails.comments.length})
              </h3>

              {postDetails.comments.length > 0 ? (
                postDetails.comments.map((comment) => (
                  <div className="flex mb-4" key={comment._id}>
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r  mr-2 ">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white p-[1px] mr-2">
                        <Link to={`/profile/${comment?.user?._id}`}>
                          <img
                            src={
                              comment?.user.avatar
                                ? `${import.meta.env.VITE_SERVER_BASE_URL}/${
                                    comment?.user.avatar
                                  }`
                                : "/default-avatar.png"
                            }
                            alt={comment?.user?.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </Link>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-semibold text-sm">
                          <Link to={`/profile/${comment?.user?._id}`}>
                            {comment.user.name}
                          </Link>
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      {editingCommentId === comment._id ? (
                        <>
                          <input
                            type="text"
                            value={editingCommentText}
                            onChange={(e) =>
                              setEditingCommentText(e.target.value)
                            }
                            className="text-sm w-full border p-1 rounded"
                          />
                          <button
                            className="text-blue-500 text-xs mr-2"
                            onClick={() => handleEditComment(comment._id)}
                          >
                            Save
                          </button>
                          <button
                            className="text-gray-500 text-xs"
                            onClick={() => setEditingCommentId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <p className="text-sm">{comment.text}</p>
                      )}
                    </div>
                    {auth?.user?._id === comment.user?._id &&
                      editingCommentId !== comment._id && (
                        <div className="ml-2 space-x-2 text-xs text-blue-600 cursor-pointer">
                          <button
                            onClick={() => {
                              setEditingCommentId(comment._id);
                              setEditingCommentText(comment.text);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-500 cursor-pointer"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No comments yet.</p>
              )}
            </div>

            <div className="p-3 border-b">
              <div className="flex justify-between mb-2">
                <div className="flex space-x-4">
                  <button onClick={handleLike}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 ${
                        alreadyLiked
                          ? "fill-red-500 stroke-red-500"
                          : "stroke-zinc-600"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                  <button onClick={() => inputRef.current.focus()}>
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </button>
                  <button onClick={handleShare}>
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
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div
                  className="h-6 flex -space-x-2  cursor-pointer "
                  onClick={() => setShowLikesModal(true)}
                >
                  {postDetails?.likes.slice(0, 3).map((user) => (
                    <img
                      key={user?._id}
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
                      className="w-6 h-6 rounded-full"
                    />
                  ))}
                </div>
                <p className="text-sm font-semibold">
                  {postDetails.likes.length} likes
                </p>
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
                    {postDetails.likes.length === 0 ? (
                      <p className="text-sm text-zinc-500">No likes yet.</p>
                    ) : (
                      <ul className="space-y-2">
                        {postDetails.likes.map((user) => (
                          <Link
                            to={`/profile/${user?._id}`}
                            key={user._id}
                            className="flex items-center space-x-2"
                          >
                            <img
                              src={
                                user?._id === auth?.user?._id &&
                                auth?.user?.avatar
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

              <div className="mb-2">
                <p className="text-xs text-gray-500">
                  Posted {formatTimeAgo(postDetails.createdAt)} ago
                </p>
              </div>
            </div>

            <div className="p-3 flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 mr-2">
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
              <div className="flex-1 flex items-center justify-between">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Add a comment..."
                  className="text-sm w-full outline-none focus:border-1 focus:border-gray-300 focus:py-1 focus:px-2 rounded-sm"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  onClick={handleCommentSubmit}
                  className="ml-2 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 stroke-zinc-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z" />
                    <path d="M6 12h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 mx-auto max-w-5xl">
        <h2 className="text-sm text-gray-500 font-normal mb-4">
          More posts from{" "}
          <span className="font-semibold text-black">
            {postDetails.user.name}
          </span>
        </h2>

        {morePosts.length > 0 ? (
          <div className="grid grid-cols-3 gap-1">
            {morePosts.map((morePost) => (
              <Link
                to={`/post-details/${morePost?._id}`}
                key={morePost?._id}
                className="relative"
              >
                <img
                  src={`${import.meta.env.VITE_SERVER_BASE_URL}/${
                    morePost.image
                  }`}
                  alt="Grid image"
                  className="w-full grid-image"
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center">No More Posts </div>
        )}
      </div>
    </div>
  );
}
