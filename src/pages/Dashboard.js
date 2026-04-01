import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API = "https://mealmanagement-backend-production.up.railway.app";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("employee"));

  const [mealTypes, setMealTypes] = useState([]);
  const [foods, setFoods] = useState([]);

  const [selectedMeal, setSelectedMeal] = useState("");
  const [selectedFoods, setSelectedFoods] = useState([]);

  const [todayPlates, setTodayPlates] = useState(0);
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("employee");
      window.location.href = "/login";
    }
  };
  useEffect(() => {
    fetch(`${API}/api/MealType/All`)
      .then((res) => res.json())
      .then((data) => setMealTypes(data || []));
  }, []);

  useEffect(() => {
    if (!selectedMeal) return;

    fetch(`${API}/api/Food/ByMeal/${selectedMeal}`)
      .then((res) => res.json())
      .then((data) => setFoods(data || []));
  }, [selectedMeal]);

  const loadPlates = () => {
    fetch(`${API}/api/Meal/TodayTotalPlates`)
      .then((res) => res.json())
      .then((data) => setTodayPlates(data || 0));
  };

  useEffect(() => {
    loadPlates();
  }, []);

  const toggleFood = (id) => {
    if (selectedFoods.includes(id)) {
      setSelectedFoods(selectedFoods.filter((f) => f !== id));
    } else {
      setSelectedFoods([...selectedFoods, id]);
    }
  };

  const handleAddMeal = async () => {
  if (!selectedMeal || selectedFoods.length === 0) {
    toast.warning("Select meal and food");
    return;
  }

  try {
    await fetch(`${API}/api/Meal/Add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeId: user.employeeId,
        mealTypeId: parseInt(selectedMeal),
        foodId: selectedFoods[0], 
      }),
    });

    toast.success("Meal Added 🍽");

    setSelectedFoods([]);
    loadPlates();
  } catch (err) {
    console.error(err);
    toast.error("Error adding meal");
  }
};

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <h2> Welcome, {user?.fullName}</h2>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="summary-box">
        <div className="summary-card">
          <h4>Today's Plates</h4>
          <p>{todayPlates}</p>
        </div>
      </div>
      <div className="card">
        <h3>🍽 Select Meal</h3>
        <select
          value={selectedMeal}
          onChange={(e) => {
            setSelectedMeal(e.target.value);
            setSelectedFoods([]);
          }}
        >
          <option value="">Select Meal Type</option>
          {mealTypes.map((m) => (
            <option key={m.mealTypeId} value={m.mealTypeId}>
              {m.mealName}
            </option>
          ))}
        </select>

        {selectedMeal && (
          <div className="meal-grid">
            {foods.length > 0 ? (
              foods.map((f) => (
                <div
                  key={f.foodId}
                  className={`meal-item ${selectedFoods.includes(f.foodId) ? "active" : ""
                    }`}
                  onClick={() => toggleFood(f.foodId)}
                >
                  {f.foodName}
                </div>
              ))
            ) : (
              <p>No food available</p>
            )}
          </div>
        )}

        <button className="primary" onClick={handleAddMeal}>
          Add Meal
        </button>
      </div>
    </div>
  );
}

export default Dashboard;