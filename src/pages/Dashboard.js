import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API = "https://meetali-api-001.azurewebsites.net";

function Dashboard({ setLoading }) {
  const user = JSON.parse(localStorage.getItem("employee"));

  const [mealTypes, setMealTypes] = useState([]);
  const [foods, setFoods] = useState([]);

  const [selectedMeal, setSelectedMeal] = useState("");
  const [selectedFoods, setSelectedFoods] = useState([]);

  const [todayPlates, setTodayPlates] = useState(0);
  const navigate = useNavigate();

  const handleMyHistory = () => {
    navigate("/myhistory");
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("employee");
      window.location.href = "/login";
    }
  };


  useEffect(() => {
    const loadMealTypes = async () => {
      try {
        setLoading(true); 

        const res = await fetch(`${API}/api/MealType/All`);
        const data = await res.json();

        setMealTypes(data || []);
      } finally {
        setLoading(false); 
      }
    };

    loadMealTypes();
  }, []);

  useEffect(() => {
    if (!selectedMeal) return;

    const loadFoods = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/api/Food/ByMeal/${selectedMeal}`);
        const data = await res.json();

        setFoods(data || []);
      } finally {
        setLoading(false); 
      }
    };

    loadFoods();
  }, [selectedMeal]);

  const loadPlates = async () => {
    try {
      setLoading(true); 

      const res = await fetch(`${API}/api/Meal/TodayTotalPlates`);
      const data = await res.json();

      setTodayPlates(data || 0);
    } finally {
      setLoading(false); 
    }
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
      setLoading(true); 

      const res = await fetch(`${API}/api/Meal/AddBulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: user.employeeId,
          mealTypeId: Number(selectedMeal),
          foodIds: selectedFoods,
        }),
      });

      const text = await res.text();
      console.log("SERVER RESPONSE:", text);

      if (!res.ok) {
        toast.error(text);
        return;
      }

      toast.success("Meal Added 🍽");
      setSelectedFoods([]);
      loadPlates();

    } catch (err) {
      console.error(err);
      toast.error("Server crash");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <h2>Welcome, {user?.fullName}</h2>

        <div className="header-buttons">
          <button onClick={handleMyHistory}>
            View History
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
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
                  className={`meal-item ${selectedFoods.includes(f.foodId) ? "active" : ""}`}
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