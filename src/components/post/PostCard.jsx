import { useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import AddComment from "./AddComment";
import CommentsCount from "./CommentsCount";
import PostActions from "./PostActions";
import PostCaption from "./PostCaption";
import PostHeader from "./PostHeader";
import PostImage from "./PostImage";
import PostLikes from "./PostLikes";

export default function PostCard({ post, onPostAction }) {
  const { auth } = useAuth();
  const isLoggedIn = !!auth?.authToken;
  const inputRef = useRef();
  const alreadyLiked = post?.likes.find((user) => user._id === auth?.user?._id);

  return (
    <article className="border-b pb-4 mb-4 max-w-[560px] mx-auto border rounded-md">
      <PostHeader post={post} auth={auth} />
      <PostImage post={post} />
      <PostActions
        post={post}
        inputRef={inputRef}
        onPostAction={onPostAction}
        isLoggedIn={isLoggedIn}
        alreadyLiked={alreadyLiked}
      />
      <PostLikes
        isLoggedIn={isLoggedIn}
        onPostAction={onPostAction}
        post={post}
      />
      <PostCaption post={post} />
      <CommentsCount post={post} />
      <AddComment
        inputRef={inputRef}
        onPostAction={onPostAction}
        isLoggedIn={isLoggedIn}
        post={post}
      />
    </article>
  );
}
