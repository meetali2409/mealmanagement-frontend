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

  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadData();
    loadStats();
  }, []);

  // ✅ FIXED LOAD DATA
  const loadData = async () => {
    try {
      const [empRes, mealRes, recRes] = await Promise.all([
        fetch(`${API}/api/Employee/All`),
        fetch(`${API}/api/MealType/All`),
        fetch(`${API}/api/Meal/History`)
      ]);

      const emp = await empRes.json();
      const meal = await mealRes.json();
      const rec = await recRes.json();

      setEmployees(Array.isArray(emp) ? emp : emp.data || []);
      setMeals(Array.isArray(meal) ? meal : meal.data || []);
      setRecords(Array.isArray(rec) ? rec : rec.data || []);

    } catch {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const plates = await fetch(`${API}/api/Meal/TodayTotalPlates`).then(r => r.json());
      const amount = await fetch(`${API}/api/Meal/TodayTotalAmount`).then(r => r.json());

      setTodayPlates(plates || 0);
      setTotalAmount(amount || 0);
    } catch {}
  };

  const saveEmployee = async () => {
    if (!empName) return;

    const url = editEmpId
      ? `${API}/api/Employee/Update/${editEmpId}`
      : `${API}/api/Employee/Add`;

    const method = editEmpId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: empName }),
    });

    toast.success(editEmpId ? "Updated" : "Added");
    setEmpName("");
    setEditEmpId(null);
    loadData();
  };

  const deleteEmployee = async (id) => {
    await fetch(`${API}/api/Employee/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    loadData();
  };

  const saveMeal = async () => {
    if (!mealName || !price) return;

    const url = editMealId
      ? `${API}/api/MealType/Update/${editMealId}`
      : `${API}/api/MealType/Add`;

    const method = editMealId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mealName, fixedPrice: price }),
    });

    toast.success(editMealId ? "Updated" : "Added");
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

  const filteredEmployees = Array.isArray(employees)
    ? employees.filter(e =>
        e.fullName?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // ✅ FIXED DATE FILTER
  const filteredRecords = Array.isArray(records)
    ? records.filter(r =>
        selectedDate
          ? r.date?.split("T")[0] === selectedDate
          : true
      )
    : [];

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>

        <div>
          <button onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? "Back" : "View History"}
          </button>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* HISTORY VIEW */}
      {showHistory ? (
        <div className="card full">
          <h3>📊 Meal History</h3>

          <input
            type="date"
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
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((r) => (
                    <tr key={r.id}>
                      <td>{r.employee?.fullName || r.employeeName}</td>
                      <td>{r.mealType?.mealName || r.mealName}</td>
                      <td>{r.date?.split("T")[0]}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          {/* STATS */}
          <div className="summary-box">
            <div className="summary-card"><h4>👤 Employees</h4><p>{employees.length}</p></div>
            <div className="summary-card"><h4>🍽 Meals</h4><p>{meals.length}</p></div>
            <div className="summary-card"><h4>📊 Plates</h4><p>{todayPlates}</p></div>
            <div className="summary-card"><h4>💰 Revenue</h4><p>₹{totalAmount}</p></div>
          </div>

          <div className="dashboard-grid">

            {/* EMPLOYEES */}
            <div className="card">
              <h3>👤 Employees</h3>

              <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
              <input placeholder="Employee Name" value={empName} onChange={(e) => setEmpName(e.target.value)} />

              <button className="primary" onClick={saveEmployee}>
                {editEmpId ? "Update" : "Add"}
              </button>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Name</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map(e => (
                      <tr key={e.employeeId}>
                        <td>{e.fullName}</td>
                        <td>
                          <div className="table-actions">
                            <button className="edit-btn" onClick={() => {
                              setEmpName(e.fullName);
                              setEditEmpId(e.employeeId);
                            }}>Edit</button>
                            <button className="delete-btn" onClick={() => deleteEmployee(e.employeeId)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MEALS */}
            <div className="card">
              <h3>🍽 Meal Types</h3>

              <input placeholder="Meal Name" value={mealName} onChange={(e) => setMealName(e.target.value)} />
              <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />

              <button className="primary" onClick={saveMeal}>
                {editMealId ? "Update" : "Add"}
              </button>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr><th>Meal</th><th>Price</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {meals.map(m => (
                      <tr key={m.mealTypeId}>
                        <td>{m.mealName}</td>
                        <td>₹{m.fixedPrice}</td>
                        <td>
                          <div className="table-actions">
                            <button className="edit-btn" onClick={() => {
                              setMealName(m.mealName);
                              setPrice(m.fixedPrice);
                              setEditMealId(m.mealTypeId);
                            }}>Edit</button>
                            <button className="delete-btn" onClick={() => deleteMeal(m.mealTypeId)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;