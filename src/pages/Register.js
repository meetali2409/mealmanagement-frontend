import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("employee");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleRegister = async () => {
  if (!fullName.trim() || !password.trim() || !email.trim()) {
    alert("Name, Email and Password required!");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      "https://mealmanagement-backend.onrender.com/api/Employee/Register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          password: password.trim(),
          email: email.trim(),
        }),
      }
    );

    const text = await response.text();

    if (response.ok) {
      alert(text || "Registered Successfully 🎉");
      navigate("/login");
    } else {
      alert(text || "Registration failed");
    }
  } catch (error) {
    console.error(error);
    alert("Backend waking up... please try again in a few seconds.");
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
          onChange={(e) => setEmail(e.target.value)}
        />
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
