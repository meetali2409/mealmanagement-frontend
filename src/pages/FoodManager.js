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

      console.log("Meal API:", mealData);

      setFoods(Array.isArray(foodData) ? foodData : foodData.data || []);

      setMealTypes(Array.isArray(mealData) ? mealData : mealData.data || []);
    } catch (err) {
      console.error(err);
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
      mealTypeId: parseInt(mealTypeId),
    };

    try {
      const url = editId
        ? `${API}/api/Food/Update/${editId}`
        : `${API}/api/Food/Add`;

      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        toast.error("Operation failed");
        return;
      }

      toast.success(editId ? "Food Updated" : "Food Added");

      setFoodName("");
      setMealTypeId("");
      setEditId(null);

      loadData();
    } catch {
      toast.error("Error saving");
    }
  };

  const deleteFood = async (id) => {
    if (!window.confirm("Delete this food?")) return;

    try {
      const res = await fetch(`${API}/api/Food/Delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Delete failed");
        return;
      }

      toast.success("Deleted");
      loadData();
    } catch {
      toast.error("Error deleting");
    }
  };

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

          {mealTypes.length > 0 ? (
            mealTypes.map((m) => (
              <option key={m.mealTypeId} value={m.mealTypeId}>
                {m.mealName}
              </option>
            ))
          ) : (
            <option disabled>No Meal Types Found</option>
          )}
        </select>

        <button className="primary" onClick={saveFood}>
          {editId ? "Update Food" : "Add Food"}
        </button>
      </div>

      <div className="card">
        <h3>Food List</h3>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Food</th>
                <th>Meal Type</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {foods.length > 0 ? (
                foods.map((f) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan="3">No Food Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FoodManager;
