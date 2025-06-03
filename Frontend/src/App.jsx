import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Signup from "./components/Signup";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./redux/AuthSlice";
import Login from "./components/login";
import ProtectedRoute from "./components/ProtectedRoute";
import ManagerDashboard from "./pages/ManagerDashboad";
import ChefDashoad from "./pages/ChefDashoard";
import CustomerDashboard from "./pages/CustomerDashborad";

function App() {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   // dispatch(fetchCurrentUser()).then((res) => console.log("user fetched : ", res));
  //   dispatch(fetchCurrentUser());
  // }, [dispatch]);
  // useEffect(() => {
  //   dispatch(fetchCurrentUser())
  //     .unwrap()
  //     .catch((error) => {
  //       console.log("Failed to fetch user:", error);
  //       // Handle logout or redirect if needed
  //     });
  // }, [dispatch]);

  // const user = useSelector((state) => state.auth.user)
  // console.log("userr",user)
  

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser())
      .unwrap()
      .then((data) => {
        console.log("Fetched user:", data);
        // Auto-redirect based on role only if not already on the target page
        if (data?.role === "manager") navigate("/manager");
        else if (data?.role === "chef") navigate("/chef");
        else if (data?.role === "customer") navigate("/dashboard");
      })
      .catch((error) => {
        console.log("Failed to fetch user:", error);
      });
  }, [dispatch, navigate]);

  // const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/not-authorized" element={<Signup />} />

        {/* Manager */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Chef */}
        <Route
          path="/chef"
          element={
            <ProtectedRoute allowedRoles={["chef"]}>
              <ChefDashoad />
            </ProtectedRoute>
          }
        />

        {/* Customer */}
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
