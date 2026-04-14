import { useEffect, useState } from "react";
const API = "https://meetali-api-001.azurewebsites.net";

function MyHistory({ setLoading }) {
  const user = JSON.parse(localStorage.getItem("employee"));

  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchMyHistory = async () => {
  try {
    if (!user) {
      console.error("User not found in localStorage");
      return;
    }

    const employeeId = user?.employeeId || user?.id;

    if (!employeeId) {
      console.error("Employee ID missing");
      return;
    }

    setLoading(true); 

    const url = `${API}/api/Meal/MyHistory/${employeeId}`;
    console.log("API CALL:", url);

    const res = await fetch(url);

    if (!res.ok) {
      console.error("API Error:", res.status);
      return;
    }

    const data = await res.json();

    setRecords(data.records || []);
    setTotal(data.totalAmount || 0);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchMyHistory();
  }, []);

  return (
    <div className="container">
      <h2>📊 My Meal History</h2>

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
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
                <td>
                  {r.mealDate
                    ? new Date(r.mealDate).toLocaleDateString()
                    : "-"}
                </td>
                <td>{r.mealName || "-"}</td>

                <td>
                  {r.foodNames && r.foodNames.length > 0
                    ? r.foodNames.join(", ")
                    : "No Food"}
                </td>

                <td>₹{r.fixedPrice || 0}</td>
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