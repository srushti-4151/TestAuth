import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./redux/AuthSlice.js";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ChefDashboard from "./pages/ChefDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import ManagerDashboard from "./pages/ManagerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);

  const location = useLocation();

  useEffect(() => {
    dispatch(fetchCurrentUser())
      .unwrap()
      .then((data) => {
        console.log("Fetched user:", data);
        // Only redirect if the user is on login/signup page — not from every page
        if (location.pathname === "/login" || location.pathname === "/signup") {
          if (data?.role === "manager") navigate("/manager");
          else if (data?.role === "chef") navigate("/chef");
          else if (data?.role === "customer") navigate("/dashboard");
        }
      })
      .catch((error) => {
        console.log("Failed to fetch user:", error);
      });
  }, [dispatch, navigate, location.pathname]);

  if(isLoading) return <p>Loading.....</p>

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chef"
          element={
            <ProtectedRoute allowedRoles={["chef"]}>
              <ChefDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
