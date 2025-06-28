import { actions } from "../actions"

const initialState = {
  posts: [],
  loading: false,
  error: null
}

const postReducer = (state, action) => {
  switch (action.type) {
    case actions.post.DATA_FETCHING: {
      return {
        ...state,
        loading: true
      }
    }
    case actions.post.DATA_FETCHED: {
      return {
        ...state,
        posts: action.data,
        loading: false,
      }
    }
    case actions.post.DATA_FETCH_ERROR: {
      return {
        ...state,
        error: action.error,
        loading: false,
      }
    }
    case actions.post.POST_LIKED: {
      const { postId, updatedLikes } = action.data;
      return {
        ...state,
        posts: state.posts.map((p) =>
          p._id === postId ? { ...p, likes: updatedLikes } : p
        ),
      };
    }
    case actions.post.POST_COMMENTED: {
      const { postId, newComment } = action.data
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        ),
      }
    }
    case actions.post.POST_COMMENT_EDITED: {
      const { postId, updatedComment } = action.data;
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
              ...post,
              comments: post.comments.map((comment) =>
                comment._id === updatedComment._id ? updatedComment : comment
              ),
            }
            : post
        ),
      };
    }

    case actions.post.POST_COMMENT_DELETED: {
      const { postId, commentId } = action.data;
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === postId
            ? {
              ...post,
              comments: post.comments.filter((comment) => comment._id !== commentId),
            }
            : post
        ),
      };
    }

    case actions.post.DATA_CREATED: {
      return {
        ...state,
        posts: [...state.posts, action.data],
        loading: false,
      }
    }
    default: {
      return state;
    }
  }
}

export { initialState, postReducer }

