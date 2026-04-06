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
    localStorage.removeItem("employee");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetch(`${API}/api/MealType/All`)
      .then((res) => res.json())
      .then((data) => setMealTypes(data));
  }, []);

  useEffect(() => {
    if (!selectedMeal) return;

    fetch(`${API}/api/Food/ByMeal/${selectedMeal}`)
      .then((res) => res.json())
      .then((data) => setFoods(data));
  }, [selectedMeal]);

  const loadPlates = () => {
    fetch(`${API}/api/Meal/TodayTotalPlates`)
      .then((res) => res.json())
      .then((data) => setTodayPlates(data));
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
      const res = await fetch(`${API}/api/Meal/AddBulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: user.employeeId,
          mealTypeId: parseInt(selectedMeal),
          foodIds: selectedFoods,
        }),
      });

      const data = await res.json(); // ✅ FIX

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      setSelectedFoods([]);
      loadPlates(); // ✅ refresh plate
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="dashboard">
      <h2>Welcome, {user?.fullName}</h2>

      <h3>Today's Plates: {todayPlates}</h3>

      <select
        value={selectedMeal}
        onChange={(e) => {
          setSelectedMeal(e.target.value);
          setSelectedFoods([]);
        }}
      >
        <option value="">Select Meal</option>
        {mealTypes.map((m) => (
          <option key={m.mealTypeId} value={m.mealTypeId}>
            {m.mealName}
          </option>
        ))}
      </select>

      <div>
        {foods.map((f) => (
          <button
            key={f.foodId}
            onClick={() => toggleFood(f.foodId)}
            style={{
              background: selectedFoods.includes(f.foodId)
                ? "green"
                : "gray",
              margin: "5px",
            }}
          >
            {f.foodName}
          </button>
        ))}
      </div>

      <button onClick={handleAddMeal}>Add Meal</button>
    </div>
  );
}

export default Dashboard;