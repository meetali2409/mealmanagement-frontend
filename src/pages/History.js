import { useEffect, useState, useCallback } from "react";
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

  // ✅ FETCH HISTORY (SAFE)
  const fetchHistory = useCallback(async () => {
    let url = `${API}/api/Meal/History?`;

    if (fromDate) {
      const f = fromDate.toLocaleDateString("en-CA");
      url += `fromDate=${f}&`;
    }

    if (toDate) {
      const t = toDate.toLocaleDateString("en-CA");
      url += `toDate=${t}&`;
    }

    if (name) url += `name=${name}&`;
    if (selectedMealType) url += `mealTypeId=${selectedMealType}&`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      // 🔥 SAFE HANDLING
      setRecords(Array.isArray(data) ? data : data.records || []);
      setTotal(data.totalAmount || 0);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  }, [fromDate, toDate, name, selectedMealType]);

  // LOAD MEAL TYPES
  useEffect(() => {
    fetch(`${API}/api/MealType/All`)
      .then((res) => res.json())
      .then((data) => setMealTypes(Array.isArray(data) ? data : data.data || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="containers">
      <h2>📊 Meal History</h2>

      {/* FILTERS */}
      <div className="filter-section">

        <div className="filter-group">
          <label>From Date</label>
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            dateFormat="yyyy-MM-dd"
            customInput={
              <input placeholder="From Date" className="date-input" />
            }
          />
        </div>

        <div className="filter-group">
          <label>To Date</label>
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            dateFormat="yyyy-MM-dd"
            customInput={
              <input placeholder="To Date" className="date-input" />
            }
          />
        </div>

        <div className="filter-group">
          <label>Employee</label>
          <input
            placeholder="Search Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="filter-group">
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

      {/* TABLE */}
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
                  <td>{r.fullName || r.employeeName}</td>
                  <td>
                    {r.mealDate
                      ? new Date(r.mealDate).toLocaleDateString()
                      : r.date?.split("T")[0]}
                  </td>
                  <td>{r.mealName || r.mealType?.mealName}</td>
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

      {/* TOTAL */}
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