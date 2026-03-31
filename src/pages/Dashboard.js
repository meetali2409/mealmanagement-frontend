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

  useEffect(() => {
    fetch(`${API}/api/Meal/TodayTotalPlates`)
      .then((res) => res.json())
      .then((data) => setTodayPlates(data || 0));
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
      toast.warning("Select meal and at least one food");
      return;
    }

    try {
      for (let foodId of selectedFoods) {
        await fetch(`${API}/api/Meal/Add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId: user.employeeId,
            mealTypeId: parseInt(selectedMeal),
            foodId: foodId,
          }),
        });
      }

      toast.success("Meals Added 🍽");
      setSelectedFoods([]);
    } catch (err) {
      console.error(err);
      toast.error("Error adding meal");
    }
  };

  return (
    <div className="container">
      <h2>🍽 Welcome, {user?.fullName}</h2>

      <div className="summary-card">
        <h4>Today's Plates</h4>
        <p>{todayPlates}</p>
      </div>

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
                className={`meal-card ${
                  selectedFoods.includes(f.foodId) ? "active" : ""
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
  );
}

export default Dashboard;