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

  const [todayPlates, setTodayPlates] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const loadData = async () => {
    try {
      const emp = await fetch(`${API}/api/Employee/All`).then(r => r.json());
      const meal = await fetch(`${API}/api/MealType/All`).then(r => r.json());
      const rec = await fetch(`${API}/api/Meal/History`).then(r => r.json());

      setEmployees(emp || []);
      setMeals(meal || []);
      setRecords(rec || []);
    } catch {
      toast.error("Error loading data");
    }
  };
  const loadStats = async () => {
    try {
      const plates = await fetch(`${API}/api/Meal/TodayTotalPlates`).then(r => r.json());
      const amount = await fetch(`${API}/api/Meal/TodayTotalAmount`).then(r => r.json());

      setTodayPlates(plates);
      setTotalAmount(amount);
    } catch {
      toast.error("Error loading stats");
    }
  };

  useEffect(() => {
    loadData();
    loadStats();
  }, []);

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

  const filteredEmployees = employees.filter(e =>
    e.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRecords = records.filter(r => {
    if (!selectedDate) return true;
    return r.date === selectedDate;
  });

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="containers">
      <h2>Admin Dashboard</h2>

      <div className="summary-box">
        <div className="summary-card">
          <h4>Total Employees</h4>
          <p>{employees.length}</p>
        </div>

        <div className="summary-card">
          <h4>Total Meals</h4>
          <p>{meals.length}</p>
        </div>

        <div className="summary-card">
          <h4>Today Plates</h4>
          <p>{todayPlates}</p>
        </div>

        <div className="summary-card">
          <h4>Total Revenue</h4>
          <p>₹{totalAmount}</p>
        </div>
      </div>
      <div className="add-meal-section">
        <h3>Employees</h3>

        <input
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          placeholder="Employee Name"
          value={empName}
          onChange={(e) => setEmpName(e.target.value)}
        />

        <button className="primary" onClick={saveEmployee}>
          {editEmpId ? "Update" : "Add"}
        </button>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((e) => (
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
      </div>
      <div className="add-meal-section">
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
      </div>
      <div className="add-meal-section">
        <h3>All Records</h3>

        <input
          type="date"
          className="date-input"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Meal</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id}>
                  <td>{r.employeeName}</td>
                  <td>{r.mealName}</td>
                  <td>{r.date}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      <button className="accent" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;