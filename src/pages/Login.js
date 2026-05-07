import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error("Enter Email and Password!");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://meetali-api-001.azurewebsites.net/api/Auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password: password.trim(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        toast.error(
          errorData.message || "Invalid Credentials"
        );

        return;
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "employee",
        JSON.stringify({
          employeeId: data.employeeId,
          fullName: data.fullName,
          email: data.email,
          role: data.role
        })
      );

      if (data.role === "Admin") {
        navigate("/admindashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      toast.error("Server Error. Try Again.");
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
          handleLogin();
        }}
      >
        <h2 className="login-title">Login</h2>

        <div className="input-group">
          <input
            type="email"
            className="login-input"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className=" input-group password-wrapper">
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
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="register-text">
          Don’t have an account? <Link to="/">Register</Link>
        </p>
      </form>
    </div>
  );
}
export default Login;