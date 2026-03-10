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
    fetch("https://mealmanagement-backend-production.up.railway.app/api/Meal/TodayTotalPlates")
      .catch(() => {});
  }, [navigate]);

  const fetchWithRetry = async (url, options, retries = 3) => {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (err) {
      if (retries > 0) {
        await new Promise((r) => setTimeout(r, 5000));
        return fetchWithRetry(url, options, retries - 1);
      }
      throw err;
    }
  };

const handleRegister = async () => {
  if (!fullName.trim() || !password.trim() || !email.trim()) {
    alert("Name, Email and Password required!");
    return;
  }

  try {
    setLoading(true);

    await fetch(
      "https://mealmanagement-backend-production.up.railway.app/api/Meal/TodayTotalPlates"
    ).catch(() => {});

    const response = await fetch(
      "https://mealmanagement-backend-production.up.railway.app/api/Employee/Register",
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
    alert("Server starting... please wait 30 seconds and try again.");
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