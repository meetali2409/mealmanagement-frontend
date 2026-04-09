import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import AdminDashBoard from "./pages/AdminDashBoard";
import FoodManager from "./pages/FoodManager";
import MealTypeManager from "./pages/MealTypeManager";
import MyHistory from "./pages/MyHistory";

import Loader from "./components/Loader"; 

import { useState } from "react";

function App() {
  const [loading, setLoading] = useState(false);

  return (
    <BrowserRouter>
      {loading && <Loader />}

      <Routes>
        <Route path="/" element={<Register setLoading={setLoading} />} />
        <Route path="*" element={<Register setLoading={setLoading} />} />
        <Route path="/login" element={<Login setLoading={setLoading} />} />
        <Route path="/dashboard" element={<Dashboard setLoading={setLoading} />} />
        <Route path="/history" element={<History setLoading={setLoading} />} />
        <Route path="/admindashboard" element={<AdminDashBoard setLoading={setLoading} />} />
        <Route path="/food" element={<FoodManager setLoading={setLoading} />} />
        <Route path="/mealtype" element={<MealTypeManager setLoading={setLoading} />} />
        <Route path="/myhistory" element={<MyHistory setLoading={setLoading} />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: "#161b22",
          color: "#e6edf3",
          border: "1px solid #1fba7a",
          borderRadius: "10px",
        }}
      />
    </BrowserRouter>
  );
}

export default App;