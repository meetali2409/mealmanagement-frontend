import { useEffect, useState } from "react";

const API = "https://mealmanagement-backend-production.up.railway.app";

function MyHistory() {
  const user = JSON.parse(localStorage.getItem("employee"));

  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchMyHistory = async () => {
    try {
      const res = await fetch(
        `${API}/api/Meal/History?name=${user.fullName}`
      );

      const data = await res.json();

      setRecords(data.records || []);
      setTotal(data.totalAmount || 0);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    fetchMyHistory();
  }, []);

  return (
    <div className="container">
      <h2>📊 My Meal History</h2>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Meal</th>
            <th>Food Items</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {records.length > 0 ? (
            records.map((r, i) => (
              <tr key={i}>
                <td>{new Date(r.mealDate).toLocaleDateString()}</td>
                <td>{r.mealName}</td>

                <td>
                  {r.foodNames && r.foodNames.length > 0
                    ? r.foodNames.join(", ")
                    : "No Food"}
                </td>

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

      <h3>Total Amount: ₹{total}</h3>

      <button
        style={{ marginTop: "20px" }}
        onClick={() => (window.location.href = "/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default MyHistory;