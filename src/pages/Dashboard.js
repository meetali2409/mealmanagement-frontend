import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API = "https://mealmanagement-backend-production.up.railway.app";

function Dashboard() {
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [totalPlates, setTotalPlates] = useState(0);
  const [totalHistoryPlates, setTotalHistoryPlates] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const user = JSON.parse(localStorage.getItem("employee"));

  // ================= LOAD =================
  useEffect(() => {
    fetchMeals();
    fetchTodayPlates();
    fetchUserStats();
  }, []);

  const fetchMeals = async () => {
    try {
      const res = await fetch(`${API}/api/MealType/All`);
      const data = await res.json();
      setMeals(Array.isArray(data) ? data : data.data || []);
    } catch {
      toast.error("Error loading meals");
    }
  };

  const fetchTodayPlates = async () => {
    try {
      const res = await fetch(`${API}/api/Meal/TodayTotalPlates`);
      const data = await res.json();
      setTotalPlates(data || 0);
    } catch {}
  };

  const fetchUserStats = async () => {
    try {
      const res = await fetch(
        `${API}/api/Meal/UserSummary/${user.employeeId}`
      );
      const data = await res.json();

      setTotalHistoryPlates(data.totalPlates || 0);
      setTotalAmount(data.totalAmount || 0);
    } catch {
      console.log("Stats error");
    }
  };

  // ================= MULTI SELECT =================
  const toggleMeal = (id) => {
    setSelectedMeals((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    );
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (selectedMeals.length === 0) {
      toast.warning("Select at least one meal");
      return;
    }

    try {
      for (let mealId of selectedMeals) {
        await fetch(`${API}/api/Meal/Add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId: user.employeeId,
            mealTypeId: mealId,
          }),
        });
      }

      toast.success("Meal Added!");

      setSelectedMeals([]);
      fetchTodayPlates();
      fetchUserStats();

    } catch {
      toast.error("Error adding meal");
    }
  };

  return (
    <div className="dashboard">

      <h2>👋 Welcome, {user?.fullName}</h2>

      {/* ===== SUMMARY ===== */}
      <div className="summary-box">
        <div className="summary-card">
          <h4>Today's Plates</h4>
          <p>{totalPlates}</p>
        </div>

        <div className="summary-card">
          <h4>Total Plates</h4>
          <p>{totalHistoryPlates}</p>
        </div>

        <div className="summary-card">
          <h4>Total Amount</h4>
          <p>₹{totalAmount}</p>
        </div>
      </div>

      {/* ===== MEAL SELECT ===== */}
      <div className="card">
        <h3>🍽 Select Meal</h3>

        <div className="meal-grid">
          {meals.map((m) => (
            <div
              key={m.mealTypeId}
              className={`meal-item ${
                selectedMeals.includes(m.mealTypeId) ? "active" : ""
              }`}
              onClick={() => toggleMeal(m.mealTypeId)}
            >
              <h4>{m.mealName}</h4>
            </div>
          ))}
        </div>

        <button className="primary" onClick={handleSubmit}>
          Add Meal
        </button>
      </div>
    </div>
  );
}

export default Dashboard;