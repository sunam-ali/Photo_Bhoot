import { useState } from "react";
import { useAxios } from "../../hooks/useAxios";

export default function ChangePassword() {
  const { api } = useAxios();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState({ type: "", message: "" });

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (password.length >= 12) score++;

    if (score <= 2) return 1;
    if (score === 3) return 2;
    if (score === 4 || score === 5) return 3;
    return 4;
  };

  const strengthLevel = getPasswordStrength(newPassword);
  const getStrengthColor = (level, index) => {
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
    ];
    return index < level ? colors[level - 1] : "bg-gray-200";
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return setMessage({ type: "error", message: "All fields are required." });
    }

    if (newPassword !== confirmPassword) {
      return setMessage({
        type: "error",
        message: "New password and confirmation do not match.",
      });
    }

    if(currentPassword === newPassword){
      return setMessage({
        type: "error",
        message: "New password and current password is same",
      });
    }

    try {
      await api.patch("/api/users/me/password", {
        currentPassword,
        newPassword,
      });

      setMessage({
        type: "success",
        message: "Password updated successfully.",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        message: err?.response?.data?.message || "Failed to update password.",
      });
    } finally {
      setTimeout(() => {
        setMessage({ type: "", message: "" });
      }, 3000);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <h2 className="font-medium text-lg mb-4">Change Password</h2>

      {/* Current Password */}
      <PasswordField
        label="Current Password"
        value={currentPassword}
        onChange={setCurrentPassword}
        show={showCurrent}
        toggleShow={() => setShowCurrent((prev) => !prev)}
      />

      {/* New Password */}
      <PasswordField
        label="New Password"
        value={newPassword}
        onChange={setNewPassword}
        show={showNew}
        toggleShow={() => setShowNew((prev) => !prev)}
      />

      {newPassword.length > 0 && (
        <div className="flex w-full h-1 mb-1">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-1/4 h-full ${getStrengthColor(
                strengthLevel,
                index
              )}`}
            ></div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 mb-3">
        For a strong password, use at least 8 characters with a mix of letters,
        numbers, and symbols.
      </p>

      {/* Confirm Password */}
      <PasswordField
        label="Confirm New Password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        show={showConfirm}
        toggleShow={() => setShowConfirm((prev) => !prev)}
      />

      {/* Message */}
      {message.message && (
        <p
          className={`text-sm mb-3 ${
            message.type === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {message.message}
        </p>
      )}

      {/* Submit Button */}
      <button
        onClick={changePassword}
        className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition cursor-pointer"
      >
        Change Password
      </button>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          After changing your password, you'll be logged out of all devices
          except the ones you're using now.
        </p>
      </div>
    </div>
  );
}

// Reusable password field component
function PasswordField({ label, value, onChange, show, toggleShow }) {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          className="form-input pr-10 w-full"
          placeholder={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 text-sm"
          onClick={toggleShow}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
