import { Outlet } from "react-router-dom";
import FloatingNavbar from "../components/Navbars/FloatingNavbar";

export default function Layouts() {
  return (
    <>
      <FloatingNavbar />
      <Outlet />
    </>
  );
}
