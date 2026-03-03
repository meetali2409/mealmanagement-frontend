import { useEffect, useState, useCallback } from "react";

function History() {
  const API = "https://YOUR_RENDER_BACKEND_URL.onrender.com";

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [name, setName] = useState("");
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [mealTypes, setMealTypes] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState("");

  const fetchHistory = useCallback(async () => {
    let url = `${API}/api/Meal/History?`;

    if (fromDate) url += `fromDate=${fromDate}&`;
    if (toDate) url += `toDate=${toDate}&`;
    if (name) url += `name=${name}&`;
    if (selectedMealType) url += `mealTypeId=${selectedMealType}&`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setRecords(data.records || []);
      setTotal(data.totalAmount || 0);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  }, [fromDate, toDate, name, selectedMealType]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    fetch(`${API}/api/MealType/All`)
      .then((res) => res.json())
      .then((data) => setMealTypes(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container">
      <h2>Meal History</h2>

      <div className="filter-section">
        <div className="filter-group">
          <label>From Date</label>
          <input type="date" onChange={(e) => setFromDate(e.target.value)} />
        </div>

        <div className="filter-group">
          <label>To Date</label>
          <input type="date" onChange={(e) => setToDate(e.target.value)} />
        </div>

        <div className="filter-group">
          <label>Employee Name</label>
          <input
            placeholder="Enter Name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Meal Type</label>
          <select onChange={(e) => setSelectedMealType(e.target.value)}>
            <option value="">All Meals</option>
            {mealTypes.map((m) => (
              <option key={m.mealTypeId} value={m.mealTypeId}>
                {m.mealName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-button">
        <button className="primary" onClick={fetchHistory}>
          Apply Filters
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Meal</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((r, i) => (
                <tr key={i}>
                  <td>{r.fullName}</td>
                  <td>{new Date(r.mealDate).toLocaleDateString()}</td>
                  <td>{r.mealName}</td>
                  <td>₹{r.fixedPrice}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No Records Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="summary-box">
        <h3>Total Amount: ₹{total}</h3>
      </div>
    </div>
  );
}

export default History;