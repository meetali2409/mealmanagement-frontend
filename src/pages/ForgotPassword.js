import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API =
  "https://meetali-api-001.azurewebsites.net";

function ForgotPassword() {

  const [email, setEmail]
    = useState("");

  const [otp, setOtp]
    = useState("");

  const [newPassword, setNewPassword]
    = useState("");

  const [loading, setLoading]
    = useState(false);

  const navigate = useNavigate();

  // SEND OTP
  const sendOtp = async () => {

    if (!email.trim()) {

      toast.error("Enter Email");

      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `${API}/api/Auth/SendResetOtp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(email)
        }
      );

      const data = await response.json();

      if (response.ok) {

        toast.success(data.message);

      } else {

        toast.error(data.message);
      }

    } catch {

      toast.error("Failed to send OTP");

    } finally {

      setLoading(false);
    }
  };

  // RESET PASSWORD
  const resetPassword = async () => {

    if (
      !email.trim() ||
      !otp.trim() ||
      !newPassword.trim()
    ) {

      toast.error(
        "All fields are required"
      );

      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `${API}/api/Auth/ResetPassword`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email,
            otp,
            newPassword
          })
        }
      );

      const data = await response.json();

      if (response.ok) {

        toast.success(data.message);

        navigate("/login");

      } else {

        toast.error(data.message);
      }

    } catch {

      toast.error("Reset failed");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="login-container">

      <div className="login-card">

        <h2 className="login-title">
          Forgot Password
        </h2>

        {/* EMAIL */}

        <input
          type="email"

          className="login-input"

          placeholder="Enter Email"

          value={email}

          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        {/* SEND OTP BUTTON */}

        <button
          className="login-btn"

          onClick={sendOtp}

          disabled={loading}
        >
          Send OTP
        </button>

        {/* OTP */}

        <input
          type="text"

          className="login-input"

          placeholder="Enter OTP"

          value={otp}

          onChange={(e) =>
            setOtp(e.target.value)
          }
        />

        {/* NEW PASSWORD */}

        <input
          type="password"

          className="login-input"

          placeholder="Enter New Password"

          value={newPassword}

          onChange={(e) =>
            setNewPassword(e.target.value)
          }
        />

        {/* RESET BUTTON */}

        <button
          className="login-btn"

          onClick={resetPassword}

          disabled={loading}
        >

          {
            loading
              ? "Please wait..."
              : "Reset Password"
          }

        </button>

      </div>

    </div>
  );
}

export default ForgotPassword;