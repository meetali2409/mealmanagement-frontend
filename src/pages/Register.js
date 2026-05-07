import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const API = "https://meetali-api-001.azurewebsites.net";

function Register() {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("employee"));

    if (user) {
      if (user.role === "Admin") {
        navigate("/admindashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const handleRegister = async () => {
    if (!fullName.trim() || !password.trim() || !email.trim()) {
      toast.warning("Name, Email and Password required!");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API}/api/Auth/Register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          fullName: fullName.trim(),
          password: password.trim(),
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Registered Successfully 🎉");

        navigate("/login");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);

      toast.error("Server error. Please try again.");
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
        <h2 className="login-title">Create Account</h2>

        <input
          type="email"
          className="login-input"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          className="login-input"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />

          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="register-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;