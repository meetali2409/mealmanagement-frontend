import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://mealmanagement-backend.onrender.com"

function Dashboard() {
  const navigate = useNavigate();
  const employee = JSON.parse(localStorage.getItem("employee"));

  const [mealTypes, setMealTypes] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState("");
  const [totalPlates, setTotalPlates] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

useEffect(() => {
  if (!employee) {
    navigate("/login");
    return;
  }

  loadData();
}, [navigate, employee]);

const loadData = async () => {
  try {
    const mealRes = await fetch(`${API}/api/MealType/All`);
    const mealData = await mealRes.json();
    console.log("Meal Types:", mealData);   
    setMealTypes(mealData || []);

    const platesRes = await fetch(`${API}/api/Meal/TodayTotalPlates`);
    const platesData = await platesRes.json();
    setTotalPlates(platesData);

    const amountRes = await fetch(`${API}/api/Meal/TodayTotalAmount`);
    const amountData = await amountRes.json();
    setTotalAmount(amountData);
  } catch (error) {
    console.error("Error loading data:", error);
  }
};
  const addMeal = async () => {
    if (!selectedMeal) {
      alert("Select Meal First");
      return;
    }

    try {
      const checkRes = await fetch(
        `${API}/api/Meal/CheckTodayMeal/${employee.employeeId}/${selectedMeal}`
      );

      const exists = await checkRes.json();

      if (exists) {
        alert("Meal already added today");
        return;
      }

      const response = await fetch(`${API}/api/Meal/Add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: employee.employeeId,
          mealTypeId: Number(selectedMeal),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(errorText);
        return;
      }

      alert("Meal Added Successfully");
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

      <select value={selectedMeal} onChange={(e) => setSelectedMeal(Number(e.target.value))}>
        <option value="">Select Meal</option>
        {mealTypes.map((m) => (
          <option key={m.mealTypeId} value={m.mealTypeId}>
            {m.mealName} - ₹{m.fixedPrice}
          </option>
        ))}
      </select>

      <button onClick={addMeal}>Add Meal</button>

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

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;