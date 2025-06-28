import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { actions } from "../actions";
import PostList from "../components/profile/PostList";
import ProfileHeader from "../components/profile/ProfileHeader";
import { useAuth } from "../hooks/useAuth";
import { useAxios } from "../hooks/useAxios";
import { useProfile } from "../hooks/useProfile";

export default function ProfilePage() {
  const { auth } = useAuth();
  const { id } = useParams();
  const { state, dispatch } = useProfile();
  const { api } = useAxios();

  const isME = auth?.user?._id === id;

  useEffect(() => {
    dispatch({ type: actions.profile.DATA_FETCHING });
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/api/posts/user/${id}`);
        if (response.status === 200) {
          dispatch({ type: actions.profile.DATA_FETCHED, data: response.data });
        }
      } catch (error) {
        console.error(error);
        dispatch({
          type: actions.profile.DATA_FETCH_ERROR,
          error: error.message,
        });
      }
    };
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (state?.loading) {
    return <div>Profile Data is Loading...</div>;
  }
  return (
    <div className="main-container">
      <div className="profile-container">
        <ProfileHeader
          user={state?.user}
          postLength={state?.posts?.length}
          isME={isME}
        />
        <section>
          <h3 className="font-semibold text-lg mb-4">Posts</h3>
          <PostList posts={state?.posts}/>
        </section>
      </div>
    </div>
  );
}
