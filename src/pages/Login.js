import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("employee");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!fullName.trim() || !password.trim()) {
      alert("Enter Name and Password!");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://mealmanagement-backend.onrender.com/api/Employee/Login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: fullName.trim(),
            password: password.trim(),
          }),
        },
      );

      if (!response.ok) {
        alert("Invalid Credentials");
        return;
      }

      const data = await response.json();

      localStorage.setItem("employee", JSON.stringify(data));
      navigate("/dashboard");
    } catch (error) {
      alert("Server Error. Try Again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <h2>Employee Login</h2>

        <input
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

        <button type="submit" className="primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-link">
          Don’t have an account? <Link to="/">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
