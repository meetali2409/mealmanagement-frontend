import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API = "https://localhost";

function AdminDashboard({ setLoading }) {  
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [empName, setEmpName] = useState("");
  const [editEmpId, setEditEmpId] = useState(null);

  const [todayPlates, setTodayPlates] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [search, setSearch] = useState("");

  const loadEmployees = async () => {
    try {
      setLoading(true); 

      const res = await fetch(`${API}/api/Employee/All`);
      const data = await res.json();

      setEmployees(Array.isArray(data) ? data : data.data || []);
    } catch {
      toast.error("Error loading employees");
    } finally {
      setLoading(false); 
    }
  };

  const loadStats = async () => {
    try {
      setLoading(true);

      const plates = await fetch(`${API}/api/Meal/TodayTotalPlates`).then(r => r.json());
      const amount = await fetch(`${API}/api/Meal/TodayTotalAmount`).then(r => r.json());

      setTodayPlates(plates || 0);
      setTotalAmount(amount || 0);
    } catch { }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadStats();
  }, []);

  const saveEmployee = async () => {
    if (!empName.trim()) {
      toast.warning("Enter employee name");
      return;
    }

    try {
      setLoading(true); 

      const url = editEmpId
        ? `${API}/api/Employee/Update/${editEmpId}`
        : `${API}/api/Employee/Add`;

      const method = editEmpId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: editEmpId,
          fullName: empName,
        }),
      });

      if (!res.ok) {
        toast.error("Operation failed");
        return;
      }

      toast.success(editEmpId ? "Updated" : "Added");

      setEmpName("");
      setEditEmpId(null);
      loadEmployees();
    } catch {
      toast.error("Error saving employee");
    } finally {
      setLoading(false); 
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/Employee/${id}`, {
        method: "DELETE",
      });

      console.log("STATUS:", res.status);

      if (!res.ok) {
        alert("Delete failed");
        return;
      }

      alert("Deleted successfully");
      loadEmployees();

    } catch (err) {
      console.error(err);
      alert("Error deleting");
    } finally {
      setLoading(false); 
    }
  };

  const editEmployee = (emp) => {
    setEmpName(emp.fullName);
    setEditEmpId(emp.employeeId);
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

      <div className="dashboard-header">
        <h2>🚀 Admin Dashboard</h2>

        <div className="dashboard-actions">
          <button onClick={() => navigate("/history")}>📊 History</button>

          <button className="primary" onClick={() => navigate("/food")}>
            🍽 Food
          </button>

          <button className="primary" onClick={() => navigate("/mealtype")}>
            🥗 Meal Types
          </button>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="summary-box">
        <div className="summary-card">
          <h4>Total Employees</h4>
          <p>{employees.length}</p>
        </div>

        <div className="summary-card">
          <h4>Today's Plates</h4>
          <p>{todayPlates}</p>
        </div>

        <div className="summary-card">
          <h4>Total Revenue</h4>
          <p>₹{totalAmount}</p>
        </div>
      </div>

      <div className="card">
        <h3>👤 Employee Management</h3>

        <input
          placeholder="🔍 Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          placeholder="Enter employee name"
          value={empName}
          onChange={(e) => setEmpName(e.target.value)}
        />

        <button className="primary" onClick={saveEmployee}>
          {editEmpId ? "Update Employee" : "Add Employee"}
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
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((e) => (
                  <tr key={e.employeeId}>
                    <td>{e.fullName}</td>
                    <td>
                      <button onClick={() => editEmployee(e)}>Edit</button>
                      <button onClick={() => deleteEmployee(e.employeeId)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No employees found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;