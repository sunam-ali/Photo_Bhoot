import axios from "axios"; 
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function RegistrationForm() {
  const { setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const apiData = {
        name: data.fullName,
        email: data.email,
        password: data.password,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/signup`,
        apiData
      );

      if (response.status === 201 || response.status === 200) {
        const { accessToken, refreshToken, user } = response.data;
        if (accessToken) {
          setAuth({ user, authToken: accessToken, refreshToken });
          setRegistered(true);
        }
      }
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message || "Registration failed. Try again.";
      setError("root.serverError", {
        type: "manual",
        message: errorMsg,
      });
    }
  };

  useEffect(() => {
    if (registered) {
      const timer = setTimeout(() => {
        navigate("/edit-profile");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [registered, navigate]);

  if (registered) {
    return (
      <div className="max-w-sm mx-auto text-center p-6">
        <h2 className="text-xl font-bold text-green-600 mb-4">🎉 Welcome!</h2>
        <p className="text-gray-700">
          Account created successfully. Redirecting to edit profile...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto">
      <div className="mb-2">
        <label htmlFor="email" className="sr-only">
          Email or Mobile
        </label>
        <div className="relative">
          <input
            id="email"
            type="text"
            className="form-input w-full"
            placeholder="Email"
            aria-label="Email"
            autoComplete="email"
            {...register("email", {
              required: "Email required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-2">
        <label htmlFor="fullName" className="sr-only">
          Full Name
        </label>
        <div className="relative">
          <input
            id="fullName"
            type="text"
            className="form-input w-full"
            placeholder="Full Name"
            aria-label="Full Name"
            autoComplete="fullName"
            {...register("fullName", { required: "Full name is required" })}
          />
        </div>
        {errors.fullName && (
          <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div className="mb-2">
        <label htmlFor="username" className="sr-only">
          Username (optional)
        </label>
        <div className="relative">
          <input
            id="username"
            type="text"
            className="form-input w-full"
            placeholder="Username (optional)"
            aria-label="Username"
            autoComplete="username"
            {...register("username", {
              minLength: {
                value: 4,
                message: "Username must be at least 4 characters",
              },
            })}
          />
        </div>
        {errors.username && (
          <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="form-input w-full"
            placeholder="Password"
            aria-label="Password"
            autoComplete="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 text-xs"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      {errors?.root?.serverError?.message && (
        <p className="text-red-500 text-xs mb-3">
          {errors.root.serverError.message}
        </p>
      )}

      <div className="mb-2">
        <button type="submit" className="signup-button w-full cursor-pointer">
          Sign up
        </button>
      </div>

      <div className="or-separator">OR</div>

      <div className="mb-4">
        <button
          type="button"
          className="signup-button w-full bg-red-500 hover:bg-red-600 text-white cursor-pointer"
        >
          Sign up with Google
        </button>
      </div>
    </form>
  );
}
