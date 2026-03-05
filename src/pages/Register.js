import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("employee");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleRegister = async () => {
    if (!fullName.trim() || !password.trim()) {
      alert("Name and Password required!");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://mealmanagement-backend.onrender.com/api/Employee/Register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: fullName.trim(),
            password: password.trim(),
          }),
        }
      );

      if (!response.ok) {
        alert("User already exists!");
        return;
      }

      alert("Registered Successfully 🎉");
      navigate("/login");
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
          handleRegister();
        }}
      >
        <h2>Create Account</h2>

        <input
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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