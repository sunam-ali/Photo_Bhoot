import { Link } from "react-router-dom";
import LogoTwo from "../assets/logo-2.svg";
import RegistrationForm from "../components/auth/RegistrationForm";

export default function RegistrationPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-8 sm:px-6 lg:px-8">
      <div className="signup-container">
        <div className="flex justify-center mb-4">
          <img src={LogoTwo} alt="PhotoBooth" className="h-[51px]" />
        </div>
        <div className="bg-white p-6 border border-gray-300 mb-3">
          <h2 className="text-center font-semibold text-gray-500 text-lg mb-4">
            Sign up to see photos and videos from your friends.
          </h2>
          <RegistrationForm />
        </div>
        <div className="bg-white p-6 border border-gray-300 text-center mb-4 rounded-md">
          <p className="text-sm">
            Have an account?{" "}
            <Link to="/login" className="text-blue-500 font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
