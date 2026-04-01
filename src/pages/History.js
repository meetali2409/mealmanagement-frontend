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

  const [editModal, setEditModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [foodOptions, setFoodOptions] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);

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
              employeeId: item.employeeId,
              mealTypeId: item.mealTypeId,
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
      console.error(error);
    }
  };

  useEffect(() => {
    fetch(`${API}/api/MealType/All`)
      .then((res) => res.json())
      .then((data) => setMealTypes(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fromDate, toDate, name, selectedMealType]);

  const handleDelete = async (record) => {
    if (!window.confirm("Delete this meal?")) return;

    const formattedDate = new Date(record.mealDate)
      .toISOString()
      .split("T")[0];

    try {
      const res = await fetch(
        `${API}/api/Meal/DeleteByGroup?employeeId=${record.employeeId}&mealTypeId=${record.mealTypeId}&date=${formattedDate}`,
        { method: "DELETE" }
      );

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

  const handleEdit = async (record) => {
    setEditRecord(record);
    setEditModal(true);

    const res = await fetch(
      `${API}/api/Food/ByMeal/${record.mealTypeId}`
    );
    const data = await res.json();

    setFoodOptions(data);
    setSelectedFoods(record.foodNames || []);
  };

  const toggleFood = (foodName) => {
    if (selectedFoods.includes(foodName)) {
      setSelectedFoods(selectedFoods.filter((f) => f !== foodName));
    } else {
      setSelectedFoods([...selectedFoods, foodName]);
    }
  };

const handleUpdate = async () => {
  const formattedDate = new Date(editRecord.mealDate)
    .toISOString()
    .split("T")[0];

  // DELETE OLD
  await fetch(
    `${API}/api/Meal/DeleteByGroup?employeeId=${editRecord.employeeId}&mealTypeId=${editRecord.mealTypeId}&date=${formattedDate}`,
    { method: "DELETE" }
  );

  // ADD NEW
  for (let foodName of selectedFoods) {
    const food = foodOptions.find((f) => f.foodName === foodName);

    if (!food) continue;

    await fetch(`${API}/api/Meal/Add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeId: editRecord.employeeId,
        mealTypeId: editRecord.mealTypeId,
        foodId: food.foodId,
      }),
    });
  }

  alert("Updated successfully");
  setEditModal(false);
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
          {records.map((r, i) => (
            <tr key={i}>
              <td>{r.fullName}</td>
              <td>{new Date(r.mealDate).toLocaleDateString()}</td>
              <td>{r.mealName}</td>
              <td>{r.foodNames.join(", ")}</td>
              <td>₹{r.fixedPrice}</td>
              <td>
                <button onClick={() => handleDelete(r)}>Delete</button>
                <button onClick={() => handleEdit(r)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Total Amount: ₹{total}</h3>

      {editModal && (
        <div className="modal">
          <h3>Edit Meal</h3>

          {foodOptions.map((f) => (
            <div key={f.foodId}>
              <input
                type="checkbox"
                checked={selectedFoods.includes(f.foodName)}
                onChange={() => toggleFood(f.foodName)}
              />
              {f.foodName}
            </div>
          ))}

          <br />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default History;