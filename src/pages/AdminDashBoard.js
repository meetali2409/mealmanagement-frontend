import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [plates, setPlates] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("employee"));

    if (!user) {
      navigate("/login");
    }

  }, [navigate]);

  useEffect(() => {
    fetch("https://mealmanagement-backend-production.up.railway.app/api/Meal/TodayTotalPlates")
      .then(res => res.json())
      .then(data => setPlates(data));

    fetch("https://mealmanagement-backend-production.up.railway.app/api/Meal/TodayTotalAmount")
      .then(res => res.json())
      .then(data => setRevenue(data));
  }, []);

  return (
    <div style={{ padding: "20px", color: "white", background: "#0d1117", height: "100vh" }}>
      
      <h1>🔥 ADMIN DASHBOARD</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        
        <div style={card}>
          <h3>Total Plates</h3>
          <p>{plates}</p>
        </div>

        <div style={card}>
          <h3>Total Revenue</h3>
          <p>₹{revenue}</p>
        </div>

      </div>

      <button
        style={{ marginTop: "30px" }}
        onClick={() => {
          localStorage.removeItem("employee");
          navigate("/login");
        }}
      >
        Logout
      </button>

    </div>
  );
}

const card = {
  background: "#161b22",
  padding: "20px",
  borderRadius: "10px",
  width: "200px"
};

export default AdminDashboard;