import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const API = "https://mealmanagement-backend-production.up.railway.app";

function Register() {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User"); 
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

      const response = await fetch(`${API}/api/Employee/Register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          password: password.trim(),
          email: email.trim(),
          role: role, 
        }),
      });

      const text = await response.text();

      if (response.ok) {
        toast.success(text || "Registered Successfully 🎉");
        navigate("/login");
      } else {
        toast.error(text || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <h2>Create Account</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="User">Employee</option>
          <option value="Admin">Admin</option>
        </select>

        <button type="submit" className="primary" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;