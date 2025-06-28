import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/login`,
        data
      );

      if (response.status === 200) {
        const { accessToken, refreshToken, user } = response.data;
        setAuth({ authToken: accessToken, refreshToken, user });
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setError("root.random", {
        type: "manual",
        message: `User with Email ${data.email} is not Found!`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto">
      <div className="mb-3">
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <div className="relative">
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            id="email"
            className="form-input w-full"
            placeholder="Phone number, username, or email"
            aria-label="Phone number, username, or email"
            autoComplete="Phone number, username, or email"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <div className="relative">
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            type={showPassword ? "text" : "password"}
            id="password"
            className="form-input w-full"
            placeholder="Password"
            aria-label="Password"
            autoComplete="Password"
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

      {errors?.root?.random?.message && (
        <p className="text-red-500 text-xs mb-3">
          {errors.root.random.message}
        </p>
      )}

      <div className="mb-4">
        <button type="submit" className="login-button w-full cursor-pointer">
          Log in
        </button>
      </div>

      <div className="or-separator">OR</div>

      <div className="mb-4">
        <button
          type="button"
          className="login-button w-full bg-red-500 hover:bg-red-600 text-white cursor-pointer"
        >
          Log in with Google
        </button>
      </div>
    </form>
  );
}
