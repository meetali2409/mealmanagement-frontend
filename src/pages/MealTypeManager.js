import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const API = "https://meetali-api-001.azurewebsites.net";

function AdminDashboard() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [meals, setMeals] = useState([]);

  const [empName, setEmpName] = useState("");
  const [mealName, setMealName] = useState("");
  const [price, setPrice] = useState("");

  const [editEmpId, setEditEmpId] = useState(null);
  const [editMealId, setEditMealId] = useState(null);

  const [todayPlates, setTodayPlates] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const emp = await fetch(`${API}/api/Employee/All`).then((r) => r.json());
      const meal = await fetch(`${API}/api/MealType/All`).then((r) =>
        r.json()
      );

      setEmployees(Array.isArray(emp) ? emp : emp.data || []);
      setMeals(Array.isArray(meal) ? meal : meal.data || []);
    } catch {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const plates = await fetch(`${API}/api/Meal/TodayTotalPlates`).then((r) =>
        r.json()
      );
      const amount = await fetch(`${API}/api/Meal/TodayTotalAmount`).then((r) =>
        r.json()
      );

      setTodayPlates(plates || 0);
      setTotalAmount(amount || 0);
    } catch { }
  };

  useEffect(() => {
    loadData();
    loadStats();
  }, []);

  const saveEmployee = async () => {
    if (!empName) return;

    try {
      setLoading(true);

      const url = editEmpId
        ? `${API}/api/Employee/Update/${editEmpId}`
        : `${API}/api/Employee/Add`;

      const method = editEmpId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: empName }),
      });

      if (res.ok) {
        toast.success(editEmpId ? "Employee Updated" : "Employee Added");
        setEmpName("");
        setEditEmpId(null);
        loadData();
      } else {
        toast.error("Operation failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/api/Employee/Delete/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Employee Deleted");
        loadData();
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const editEmployee = (emp) => {
    setEmpName(emp.fullName);
    setEditEmpId(emp.employeeId);
  };

  const saveMeal = async () => {
    if (!mealName || !price) return;

    try {
      setLoading(true);

      const url = editMealId
        ? `${API}/api/MealType/Update/${editMealId}`
        : `${API}/api/MealType/Add`;

      const method = editMealId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealName, fixedPrice: price }),
      });

      if (res.ok) {
        toast.success(editMealId ? "Meal Updated" : "Meal Added");
        setMealName("");
        setPrice("");
        setEditMealId(null);
        loadData();
      } else {
        toast.error("Operation failed");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const deleteMeal = async (id) => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/api/MealType/Delete/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(data.message || "Deleted successfully");
        loadData();
      } else {
        const msg = await res.text();
        toast.error(msg || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const editMeal = (meal) => {
    setMealName(meal.mealName);
    setPrice(meal.fixedPrice);
    setEditMealId(meal.mealTypeId);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredEmployees = employees.filter((e) =>
    e.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">

      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}

      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>

        <div>
          <button onClick={() => navigate("/history")}>📊 View History</button>
          <button className="primary" onClick={() => navigate("/food")}>
            Manage Food
          </button>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="summary-box">
        <div className="summary-card">
          <h4>Employees</h4>
          <p>{employees.length}</p>
        </div>

        <div className="summary-card">
          <h4>Meals</h4>
          <p>{meals.length}</p>
        </div>

        <div className="summary-card">
          <h4>Today's Plates</h4>
          <p>{todayPlates}</p>
        </div>

        <div className="summary-card">
          <h4>Revenue</h4>
          <p>₹{totalAmount}</p>
        </div>
      </div>

      <div className="card">
        <h3>🍽 Meal Types</h3>

        <input
          placeholder="Meal Name"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button disabled={loading} className="primary" onClick={saveMeal}>
          {editMealId ? "Update" : "Add"}
        </button>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Meal</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {meals.map((m) => (
                <tr key={m.mealTypeId}>
                  <td>{m.mealName}</td>
                  <td>₹{m.fixedPrice}</td>
                  <td>
                    <button disabled={loading} onClick={() => editMeal(m)}>
                      Edit
                    </button>
                    <button
                      disabled={loading}
                      onClick={() => deleteMeal(m.mealTypeId)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;