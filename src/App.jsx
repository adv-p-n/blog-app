import { useEffect, useState } from "react";
import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authService from "./appwrite/authService";
import { login, logout } from "./Store/authSlice";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { CircularProgress } from "@mui/material";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate=useNavigate();

  useEffect(() => {
    authService
      .getCurrentUSer()
      .then((userData) => {
        if (userData) dispatch(login({ userData }));
        else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.error("Authentication error:", error);
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [dispatch]);
  

  return !loading ? (
    <div className="min-h-screen flex flex-wrap content-between bg-gray-500">
      <div className="w-full block">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : <CircularProgress />;
}

export default App;
