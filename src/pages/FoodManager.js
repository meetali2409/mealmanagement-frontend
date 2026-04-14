import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API = "https://meetali-api-001.azurewebsites.net";

function FoodManager({ setLoading }) {
  const [foods, setFoods] = useState([]);
  const [mealTypes, setMealTypes] = useState([]);

  const [foodName, setFoodName] = useState("");
  const [mealTypeId, setMealTypeId] = useState("");

  const [editId, setEditId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);

      let foodData = [];
      try {
        const foodRes = await fetch(`${API}/api/Food/All`);
        const f = await foodRes.json();
        foodData = Array.isArray(f) ? f : f.data || [];
      } catch (e) {
        console.error("Food error:", e);
      }

      let mealData = [];
      try {
        const mealRes = await fetch(`${API}/api/MealType/All`);
        const m = await mealRes.json();
        mealData = Array.isArray(m) ? m : m.data || [];
      } catch (e) {
        console.error("Meal error:", e);
      }

      setFoods(foodData);
      setMealTypes(mealData);

    } catch (err) {
      console.error(err);
      toast.error("Error loading data");
    } finally {
      setLoading(false);
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
      foodName: foodName.trim(),
      mealTypeId: Number(mealTypeId),
    };

    try {
      setLoading(true);

      const url = editId
        ? `${API}/api/Food/Update/${editId}`
        : `${API}/api/Food/Add`;

      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const text = await res.text();

      if (!res.ok) {
        toast.error(text || "Operation Failed");
        return;
      }

      toast.success(editId ? "Food Updated" : "Food Added");

      setFoodName(""); 
      setMealTypeId("");
      setEditId(null);

      loadData();

    } catch (err) {
      console.error(err);
      toast.error("Error saving");
    } finally {
      setLoading(false);
    }
  };

  const deleteFood = async (id) => {
    if (!window.confirm("Delete this food?")) return;

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/Food/Delete/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || "Deleted");
        loadData();
      } else {
        const msg = await res.text();
        console.error("Delete error:", msg);
        toast.error(msg || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
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
                    <td>{f.mealTypeId}</td>
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