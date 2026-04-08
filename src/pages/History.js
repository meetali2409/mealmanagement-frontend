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

      if (fromDate !== null) {
        params.append(
          "fromDate",
          new Date(fromDate).fromDate.toLocaleDateString("en-CA")
        );
      }

      if (toDate !== null) {
        params.append(
          "toDate",
          new Date(toDate).toDate.toLocaleDateString("en-CA")
        );
        
      }

      if (name && name.trim() !== "") {
        params.append("name", name.trim());
      }

      if (selectedMealType && selectedMealType !== "") {
        params.append("mealTypeId", selectedMealType);
      }

      const url = `${API}/api/Meal/History?${params.toString()}`;

      console.log("CALLING API:", url);

      const res = await fetch(url);
      const data = await res.json();

      console.log("RESPONSE:", data);

      setRecords(data.records || []);
      setTotal(data.totalAmount || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch(`${API}/api/MealType/All`)
      .then((res) => res.json())
      .then((data) => setMealTypes(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (record) => {
    if (!window.confirm("Delete this meal?")) return;

    await fetch(
      `${API}/api/Meal/Delete?employeeId=${record.employeeId}&mealTypeId=${record.mealTypeId}&mealDate=${record.mealDate}`,
      { method: "DELETE" }
    );

    alert("Deleted");
    fetchHistory();
  };

  return (
    <div className="container">
      <h2>📊 Meal History</h2>

      <div className="history-filters">
        <DatePicker
          selected={fromDate}
          onChange={(d) => setFromDate(d)}
          placeholderText="From Date"
        />

        <DatePicker
          selected={toDate}
          onChange={(d) => setToDate(d)}
          placeholderText="To Date"
        />

        <input
          placeholder="Search Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <button onClick={() => {
          console.log("Filter clicked");
          fetchHistory();
        }}>
          Apply Filters
        </button>
      </div>

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
                <td>{new Date(r.mealDate).toLocaleDateString()}</td>
                <td>{r.mealName}</td>
                <td>{r.foodNames?.join(", ")}</td>
                <td>₹{r.fixedPrice}</td>
                <td>
                  <button onClick={() => handleDelete(r)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No Records Found</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Total Amount: ₹{total}</h3>
    </div>
  );
}

export default History;