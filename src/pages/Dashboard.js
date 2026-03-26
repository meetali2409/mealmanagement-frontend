function Dashboard() {
  return (
    <div style={{ background: "black", height: "100vh", color: "white" }}>
      <h1>USER DASHBOARD WORKING ✅</h1>
    </div>
  );
}

export default Dashboard;













// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// const API = "https://mealmanagement-backend-production.up.railway.app";

// function Dashboard() {
//   const navigate = useNavigate();
//   const employee = JSON.parse(localStorage.getItem("employee") || "null");

//   const [mealTypes, setMealTypes] = useState([]);
//   const [totalPlates, setTotalPlates] = useState(0);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [selectedMeal, setSelectedMeal] = useState(null);
//   const [loadingMeals, setLoadingMeals] = useState(true);
//   const [addingMeal, setAddingMeal] = useState(false);

//   const [showAdminBox, setShowAdminBox] = useState(false);
//   const [adminPass, setAdminPass] = useState("");

//   const fetchWithRetry = async (url, options = {}, retries = 2) => {
//     try {
//       const res = await fetch(url, options);
//       if (!res.ok) throw new Error("Server error");
//       return res;
//     } catch (error) {
//       if (retries === 0) throw error;
//       await new Promise((r) => setTimeout(r, 20000));
//       return fetchWithRetry(url, options, retries - 1);
//     }
//   };

//   const loadData = async () => {
//     try {
//       setLoadingMeals(true);

//       const mealRes = await fetchWithRetry(`${API}/api/MealType/All`);
//       const mealData = await mealRes.json();
//       setMealTypes(mealData || []);

//       const platesRes = await fetchWithRetry(`${API}/api/Meal/TodayTotalPlates`);
//       const platesData = await platesRes.json();
//       setTotalPlates(platesData);

//       const amountRes = await fetchWithRetry(`${API}/api/Meal/TodayTotalAmount`);
//       const amountData = await amountRes.json();
//       setTotalAmount(amountData);

//       setLoadingMeals(false);
//     } catch (error) {
//       console.error("Error loading data:", error);
//     }
//   };

//   useEffect(() => {
//     if (!employee) {
//       navigate("/login");
//       return;
//     }

//     loadData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [navigate, employee]);

//   const addMeal = async () => {
//   if (!selectedMeal || !employee?.employeeId) {
//     toast.warning("Select Meal First");
//     return;
//   }

//   if (addingMeal) return;

//   try {
//     setAddingMeal(true);

//     const response = await fetch(`${API}/api/Meal/Add`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         employeeId: Number(employee.employeeId),
//         mealTypeId: Number(selectedMeal),
//       }),
//     });

//     const text = await response.text();

//     let message = text;

//     try {
//       const parsed = JSON.parse(text);
//       message = parsed.message;
//     } catch {}

//     if (!response.ok) {
//       toast.warning(message);
//       return;
//     }

//     toast.success(message);

//     setSelectedMeal(null);
//     loadData();
//   } catch (error) {
//     console.error(error);
//     toast.error("Server Error");
//   } finally {
//     setAddingMeal(false);
//   }
// };

//   const openHistory = () => {
//     setShowAdminBox(true);
//   };

//   const checkAdminPassword = () => {
//     if (adminPass === "admin123") {
//       navigate("/history");
//     } else {
//       toast.warning("Wrong Password");
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("employee");
//     navigate("/login");
//   };

//   return (
//     <div className="container">
//       <h2>Welcome {employee?.fullName}</h2>

//      <div className="top-bar">

//   {!showAdminBox && (
//    <button className="secondary" onClick={openHistory}>
//   View Records
// </button>
//   )}

//   {showAdminBox && (
//     <div className="admin-login">
//       <input
//         type="password"
//         placeholder="Admin Password"
//         value={adminPass}
//         onChange={(e) => setAdminPass(e.target.value)}
//       />

//       <button className="secondary" onClick={checkAdminPassword}>
//         Go
//       </button>
//     </div>
//   )}

// </div>

//       <h3>Add Meal</h3>

//       <select
//         value={selectedMeal ?? ""}
//         onChange={(e) => setSelectedMeal(Number(e.target.value))}
//       >
//         <option value="">Select Meal</option>

//         {mealTypes.map((m) => (
//           <option key={m.id || m.mealTypeId} value={m.id || m.mealTypeId}>
//             {m.mealName} - ₹{m.fixedPrice}
//           </option>
//         ))}
//       </select>

//       <button
//         className="primary"
//         onClick={addMeal}
//         disabled={!selectedMeal || addingMeal}
//       >
//         {addingMeal ? "Adding..." : "Add Meal"}
//       </button>

//       {loadingMeals && <p></p>}

//       <div className="summary-box">
//         <div className="summary-card">
//           <h4>Total Plates</h4>
//           <p>{totalPlates}</p>
//         </div>

//         <div className="summary-card">
//           <h4>Total Amount</h4>
//           <p>₹{totalAmount}</p>
//         </div>
//       </div>

//       <button className="accent" onClick={logout}>
//         Logout
//       </button>
//     </div>
//   );
// }

// export default Dashboard;