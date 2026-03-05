import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://mealmanagement-backend.onrender.com";

function Dashboard() {
  const navigate = useNavigate();
  const employee = JSON.parse(localStorage.getItem("employee") || "null");

  const [mealTypes, setMealTypes] = useState([]);
  const [totalPlates, setTotalPlates] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loadingMeals, setLoadingMeals] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const fetchWithRetry = useCallback(async (url, options = {}, retries = 2) => {
    try {
      const res = await fetch(url, options);

      if (!res.ok) {
        throw new Error("Server error");
      }

      return res;
    } catch (error) {
      if (retries === 0) throw error;

      console.log("Retrying request...");
      await new Promise((r) => setTimeout(r, 20000));

      return fetchWithRetry(url, options, retries - 1);
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoadingMeals(true);

      const mealRes = await fetchWithRetry(`${API}/api/MealType/All`);
      const mealData = await mealRes.json();
      setMealTypes(mealData || []);

      const platesRes = await fetchWithRetry(
        `${API}/api/Meal/TodayTotalPlates`
      );
      const platesData = await platesRes.json();
      setTotalPlates(platesData);

      const amountRes = await fetchWithRetry(
        `${API}/api/Meal/TodayTotalAmount`
      );
      const amountData = await amountRes.json();
      setTotalAmount(amountData);

      setLoadingMeals(false);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, [fetchWithRetry]);

  useEffect(() => {
    if (!employee) {
      navigate("/login");
      return;
    }

    loadData();
  }, [navigate, employee, loadData]);

  const addMeal = async () => {
    if (!selectedMeal || !employee?.employeeId) {
      alert("Select Meal First");
      return;
    }

    try {
      const response = await fetch(`${API}/api/Meal/Add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: Number(employee.employeeId),
          mealTypeId: Number(selectedMeal),
        }),
      });

      const text = await response.text();

      if (!response.ok) {
        alert(text);
        return;
      }

      alert(text);

      setSelectedMeal(null);
      loadData();
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  const openHistory = () => {
    const pass = prompt("Enter Admin Password");

    if (pass === "admin123") {
      navigate("/history");
    } else {
      alert("Wrong Password");
    }
  };

  const logout = () => {
    localStorage.removeItem("employee");
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Welcome {employee?.fullName}</h2>

      <div className="top-bar">
        <button className="secondary" onClick={openHistory}>
          View Records
        </button>
      </div>

      <h3>Add Meal</h3>

      <select
        value={selectedMeal ?? ""}
        onChange={(e) => setSelectedMeal(Number(e.target.value))}
      >
        <option value="">Select Meal</option>

        {mealTypes.map((m) => (
          <option key={m.id || m.mealTypeId} value={m.id || m.mealTypeId}>
            {m.mealName} - ₹{m.fixedPrice}
          </option>
        ))}
      </select>

      <button onClick={addMeal} disabled={!selectedMeal}>
        Add Meal
      </button>

      {loadingMeals ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="summary-box">
            <div className="summary-card">
              <h4>Total Plates</h4>
              <p>{totalPlates}</p>
            </div>

            <div className="summary-card">
              <h4>Total Amount</h4>
              <p>₹{totalAmount}</p>
            </div>
          </div>
        </>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;