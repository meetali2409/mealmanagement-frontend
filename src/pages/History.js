import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function History() {
  const API = "https://mealmanagement-backend-production.up.railway.app";

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [name, setName] = useState("");
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [mealTypes, setMealTypes] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState("");

  const fetchHistory = async () => {
    try {
      let params = new URLSearchParams();

      if (fromDate) {
        params.append("fromDate", fromDate.toISOString().split("T")[0]);
      }

      if (toDate) {
        params.append("toDate", toDate.toISOString().split("T")[0]);
      }

      if (name.trim()) {
        params.append("name", name.trim());
      }

      if (selectedMealType) {
        params.append("mealTypeId", selectedMealType);
      }

      const url = `${API}/api/Meal/History?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();

      const grouped = Object.values(
        (data.records || []).reduce((acc, item) => {
          const dateOnly = new Date(item.mealDate)
            .toISOString()
            .split("T")[0];

          const key = `${item.fullName}_${dateOnly}_${item.mealName}`;

          if (!acc[key]) {
            acc[key] = {
              ...item,
              mealDate: dateOnly,
              foodNames: [item.foodName],
            };
          } else {
            acc[key].foodNames.push(item.foodName);

            acc[key].foodNames = [...new Set(acc[key].foodNames)];
          }

          return acc;
        }, {})
      );

      setRecords(grouped);
      setTotal(data.totalAmount || 0);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    fetch(`${API}/api/MealType/All`)
      .then((res) => res.json())
      .then((data) =>
        setMealTypes(Array.isArray(data) ? data : data.data || [])
      )
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fromDate, toDate, name, selectedMealType]);

  const handleEdit = (record) => {
    setSelectedMealType(record.mealTypeId);
    setName(record.fullName);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    try {
      const res = await fetch(`${API}/api/Meal/Delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Delete failed");
        return;
      }

      alert("Deleted successfully");
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="container">
      <h2>📊 Meal History</h2>

      <div className="history-filters">
        <div>
          <label>From Date</label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="From Date"
          />
        </div>

        <div>
          <label>To Date</label>
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="To Date"
          />
        </div>

        <div>
          <label>Employee</label>
          <input
            placeholder="Search Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Meal Type</label>
          <select
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value)}
          >
            <option value="">All</option>
            {mealTypes.map((m) => (
              <option key={m.mealTypeId} value={m.mealTypeId}>
                {m.mealName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Meal</th>
              <th>Food</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {records.length > 0 ? (
              records.map((r, i) => (
                <tr key={i}>
                  <td>{r.fullName}</td>

                  <td>
                    {new Date(r.mealDate).toLocaleDateString()}
                  </td>

                  <td>{r.mealName}</td>

                  <td>{r.foodNames.join(", ")}</td>

                  <td>₹{r.fixedPrice}</td>
                  <td>
                    <button onClick={() => handleDelete(r.id)}>Delete</button>
                    <button onClick={() => handleEdit(r.id)}>Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No Records Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="summary-box">
        <div className="summary-card">
          <h4>Total Amount</h4>
          <p>₹{total}</p>
        </div>
      </div>
    </div>
  );
}

export default History;