import ChangePassword from "../components/profile/ChangePassword";
import EditOthersInfo from "../components/profile/EditOthersInfo";
import PrivacyNote from "../components/profile/PrivacyNote";
import UpdateProfilePicture from "../components/profile/UpdateProfilePicture";


export default function EditProfilePage() {
  return (
    <div className="edit-container">
      <h1 className="text-2xl font-bold mb-8">Edit profile</h1>
      <UpdateProfilePicture />
      <EditOthersInfo />
      <ChangePassword />
      <PrivacyNote />
    </div>
  );
}
