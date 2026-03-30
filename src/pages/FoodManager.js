import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API = "https://mealmanagement-backend-production.up.railway.app";

function FoodManager() {
  const [foods, setFoods] = useState([]);
  const [mealTypes, setMealTypes] = useState([]);

  const [foodName, setFoodName] = useState("");
  const [mealTypeId, setMealTypeId] = useState("");

  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    try {
      const foodRes = await fetch(`${API}/api/Food/All`);
      const foodData = await foodRes.json();

      const mealRes = await fetch(`${API}/api/MealType/All`);
      const mealData = await mealRes.json();

      setFoods(foodData.data || []);
      setMealTypes(mealData || []);
    } catch {
      toast.error("Error loading data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveFood = async () => {
    if (!foodName || !mealTypeId) {
      toast.warning("Fill all fields");
      return;
    }

    const body = {
      foodName,
      mealTypeId: parseInt(mealTypeId)
    };

    try {
      if (editId) {
        await fetch(`${API}/api/Food/Update/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        toast.success("Food Updated");
      } else {
        await fetch(`${API}/api/Food/Add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        toast.success("Food Added");
      }

      setFoodName("");
      setMealTypeId("");
      setEditId(null);
      loadData();

    } catch {
      toast.error("Error saving");
    }
  };

  const deleteFood = async (id) => {
    await fetch(`${API}/api/Food/Delete/${id}`, {
      method: "DELETE",
    });
    toast.success("Deleted");
    loadData();
  };

  // EDIT
  const editFood = (f) => {
    setFoodName(f.foodName);
    setMealTypeId(f.mealTypeId);
    setEditId(f.foodId);
  };

  return (
    <div className="container">
      <h2>🍽 Food Manager</h2>

      <div className="card">
        <input
          placeholder="Food Name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
        />

        <select
          value={mealTypeId}
          onChange={(e) => setMealTypeId(e.target.value)}
        >
          <option value="">Select Meal Type</option>
          {mealTypes.map((m) => (
            <option key={m.mealTypeId} value={m.mealTypeId}>
              {m.mealName}
            </option>
          ))}
        </select>

        <button className="primary" onClick={saveFood}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <div className="card">
        <h3>Food List</h3>

        <table>
          <thead>
            <tr>
              <th>Food</th>
              <th>Meal Type</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {foods.map((f) => (
              <tr key={f.foodId}>
                <td>{f.foodName}</td>
                <td>{f.mealType?.mealName || "-"}</td>
                <td>
                  <button onClick={() => editFood(f)}>Edit</button>
                  <button onClick={() => deleteFood(f.foodId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default FoodManager;