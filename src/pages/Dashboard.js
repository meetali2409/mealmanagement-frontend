import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API = "https://mealmanagement-backend-production.up.railway.app";

function AdminDashboard() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [meals, setMeals] = useState([]);
  const [records, setRecords] = useState([]);

  const [empName, setEmpName] = useState("");
  const [mealName, setMealName] = useState("");
  const [price, setPrice] = useState("");

  const [editEmpId, setEditEmpId] = useState(null);
  const [editMealId, setEditMealId] = useState(null);

  // ================= LOAD DATA =================
  const loadData = async () => {
    try {
      const emp = await fetch(`${API}/api/Employee/All`).then(r => r.json());
      const meal = await fetch(`${API}/api/MealType/All`).then(r => r.json());
      const rec = await fetch(`${API}/api/Meal/All`).then(r => r.json());

      setEmployees(emp || []);
      setMeals(meal || []);
      setRecords(rec || []);
    } catch (err) {
      toast.error("Error loading data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= EMPLOYEE =================
  const saveEmployee = async () => {
    if (!empName) return;

    if (editEmpId) {
      await fetch(`${API}/api/Employee/Update/${editEmpId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: empName }),
      });
      toast.success("Employee Updated");
    } else {
      await fetch(`${API}/api/Employee/Add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: empName }),
      });
      toast.success("Employee Added");
    }

    setEmpName("");
    setEditEmpId(null);
    loadData();
  };

  const deleteEmployee = async (id) => {
    await fetch(`${API}/api/Employee/Delete/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    loadData();
  };

  const editEmployee = (emp) => {
    setEmpName(emp.fullName);
    setEditEmpId(emp.employeeId);
  };

  // ================= MEALS =================
  const saveMeal = async () => {
    if (!mealName || !price) return;

    if (editMealId) {
      await fetch(`${API}/api/MealType/Update/${editMealId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealName, fixedPrice: price }),
      });
      toast.success("Meal Updated");
    } else {
      await fetch(`${API}/api/MealType/Add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealName, fixedPrice: price }),
      });
      toast.success("Meal Added");
    }

    setMealName("");
    setPrice("");
    setEditMealId(null);
    loadData();
  };

  const deleteMeal = async (id) => {
    await fetch(`${API}/api/MealType/Delete/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    loadData();
  };

  const editMeal = (meal) => {
    setMealName(meal.mealName);
    setPrice(meal.fixedPrice);
    setEditMealId(meal.mealTypeId);
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      <div className="card">
        <h3>Employees</h3>

        <input
          placeholder="Employee Name"
          value={empName}
          onChange={(e) => setEmpName(e.target.value)}
        />

        <button className="primary" onClick={saveEmployee}>
          {editEmpId ? "Update" : "Add"}
        </button>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((e) => (
              <tr key={e.employeeId}>
                <td>{e.fullName}</td>
                <td>
                  <button onClick={() => editEmployee(e)}>Edit</button>
                  <button onClick={() => deleteEmployee(e.employeeId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
        <h3>Meal Types</h3>

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

        <button className="primary" onClick={saveMeal}>
          {editMealId ? "Update" : "Add"}
        </button>

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
                  <button onClick={() => editMeal(m)}>Edit</button>
                  <button onClick={() => deleteMeal(m.mealTypeId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card">
        <h3>All Records</h3>

        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Meal</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>{r.employeeName}</td>
                <td>{r.mealName}</td>
                <td>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="accent" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;