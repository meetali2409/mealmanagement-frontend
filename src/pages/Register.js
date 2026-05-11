import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const API = "https://meetali-api-001.azurewebsites.net";

function Register() {

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword]
    = useState(false);

  const navigate = useNavigate();

  useEffect(() => {

    const user = JSON.parse(
      localStorage.getItem("employee")
    );

    if (user) {

      if (user.role === "Admin") {
        navigate("/admindashboard");
      }
      else {
        navigate("/dashboard");
      }
    }

  }, [navigate]);

  const sendOtp = async () => {

    if (!email.trim()) {

      toast.error("Enter Email First");

      return;
    }

    try {

      const response = await fetch(
        `${API}/api/Auth/SendOtp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(email),
        }
      );

      const data = await response.json();

      if (response.ok) {

        toast.success(data.message);

      } else {

        toast.error(data.message);
      }

    } catch (error) {

      toast.error("Failed to send OTP");
    }
  };

  const handleRegister = async () => {

    if (
      !fullName.trim() ||
      !password.trim() ||
      !email.trim() ||
      !otp.trim()
    ) {

      toast.warning(
        "Name, Email, Password and OTP required!"
      );

      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        `${API}/api/Auth/Register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fullName: fullName.trim(),
            password: password.trim(),
            email: email.trim(),
            role: role,
            otp: otp
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        toast.success(
          data.message ||
          "Registered Successfully 🎉"
        );

        navigate("/login");

      } else {

        toast.error(
          data.message || "Registration failed"
        );
      }

    } catch (error) {

      console.error(error);

      toast.error(
        "Server error. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="login-container">

      <form
        className="login-card"

        onSubmit={(e) => {

          e.preventDefault();

          handleRegister();
        }}
      >

        <h2 className="login-title">
          Create Account
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

        {/* OTP */}

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px"
          }}
        >

          <input
            type="text"

            className="login-input"

            placeholder="Enter OTP"

            value={otp}

            onChange={(e) =>
              setOtp(e.target.value)
            }
          />

          <button
            type="button"

            className="login-btn"

            onClick={sendOtp}
          >
            Send OTP
          </button>

        </div>

        {/* FULL NAME */}

        <input
          type="text"

          className="login-input"

          placeholder="Full Name"

          value={fullName}

          onChange={(e) =>
            setFullName(e.target.value)
          }
        />



        <select
          className="login-input"

          value={role}

          onChange={(e) =>
            setRole(e.target.value)
          }
        >

          <option value="User">
            User
          </option>


        </select>


        <div className="password-wrapper">

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }

            placeholder="Password"

            value={password}

            onChange={(e) =>
              setPassword(e.target.value)
            }

            className="login-input"
          />

          <span
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword ? "🙈" : "👁"}
          </span>

        </div>

        {/* BUTTON */}

        <button
          type="submit"

          className="login-btn"

          disabled={loading}
        >

          {
            loading
              ? "Registering..."
              : "Register"
          }

        </button>

        <p className="register-text">

          Already have an account?

          {" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </form>

    </div>
  );
}

export default Register;