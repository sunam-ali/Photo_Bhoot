import { useNavigate } from "react-router-dom";
import LogoutIcon from "../../assets/logout.svg";
import { useAuth } from "../../hooks/useAuth";

export default function Logout() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({});
    navigate("/login");
  };
  return (
    <button title="logout" className="cursor-pointer" onClick={handleLogout}>
      <img src={LogoutIcon} alt="logout" />
    </button>
  );
}
