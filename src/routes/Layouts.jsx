import { Outlet } from "react-router-dom";
import FloatingNavbar from "../components/navbars/FloatingNavbar";

export default function Layouts() {
  return (
    <>
      <FloatingNavbar />
      <Outlet />
    </>
  );
}
