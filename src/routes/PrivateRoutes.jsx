import { Navigate, Outlet } from "react-router-dom";
import FloatingNavbar from "../components/Navbars/FloatingNavbar";
import { useAuth } from "../hooks/useAuth";
import ProfileProvider from "../providers/ProfileProvider";

export default function PrivateRoutes() {
  const { auth } = useAuth();
  return (
    <>
      {auth.authToken ? (
        <>
          <ProfileProvider>
            <FloatingNavbar />
            <Outlet />
          </ProfileProvider>
        </>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
}
