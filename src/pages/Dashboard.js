import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

    fetch("https://your-render-url.onrender.com/api/MealType/All")
      .then((res) => res.json())
      .then((data) => setMealTypes(data));

    fetch("https://your-render-url.onrender.com/api/Meal/TodayTotalPlates")
      .then((res) => res.json())
      .then((data) => setTotalPlates(data))
      .catch(() => setTotalPlates(0));

    fetch("https://your-render-url.onrender.com/api/Meal/TodayTotalAmount")
      .then((res) => res.json())
      .then((data) => setTotalAmount(data))
      .catch(() => setTotalAmount(0));
  }, [navigate, employee]);
  const addMeal = async () => {
    if (!selectedMeal) {
      alert("Select Meal First");
      return;
    }

    try {
      const checkRes = await fetch(
        `https://your-render-url.onrender.com/api/Meal/CheckTodayMeal/${employee.employeeId}/${selectedMeal}`,
      );

      const exists = await checkRes.json();

      if (exists) {
        alert("Meal already added today");
        return;
      }

      const response = await fetch("https://your-render-url.onrender.com/api/Meal/Add", {
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
      const platesRes = await fetch(
        "https://your-render-url.onrender.com/api/Meal/TodayTotalPlates",
      );
      setTotalPlates(await platesRes.json());

      const amountRes = await fetch(
        "https://your-render-url.onrender.com/api/Meal/TodayTotalAmount",
      );
      setTotalAmount(await amountRes.json());
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

      <select onChange={(e) => setSelectedMeal(Number(e.target.value))}>
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
