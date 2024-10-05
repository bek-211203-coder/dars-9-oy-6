import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  function PrivateRoute({ isAuth, children }) {
    if (!isAuth) {
      navigate("/");
      return null;
    }
    return children;
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <Routes>
        <Route
          path="/home"
          element={
            <PrivateRoute isAuth={!!token}>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Register></Register>} />
        <Route path="/login" element={<Login></Login>} />
      </Routes>
    </div>
  );
}

export default App;
