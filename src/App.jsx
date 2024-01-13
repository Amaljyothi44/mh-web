import "./App.css";
import Home from "./components/Home/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import CalenderPage from "./pages/CalenderPage";
import { useContext,useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import AdminPage from "./components/AdminPage/AdminPage";
import NewUserPage from "./pages/NewUserPage/NewUserPage";
import MhRules from "./pages/MhRules";
import Notification from "./pages/Notification";
import Messfee from "./components/Messfee/Messfee";
import Userfee from "./components/userFee/Userfee";

function App() {
  const { user,setUser } = useContext(AuthContext);
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} exact path="/" />
        <Route
          element={!user ? <LoginPage /> : <Navigate to={"/dashboard"} />}
          exact
          path="/login"
        />
        <Route
          element={
            (user?.email !== "menshostelgecskp@gmail.com" ) ? (
              <AdminLoginPage />
            ) : (
              <Navigate to="/admin-page" />
            )
          }
          path="/admin-login"
        />
        <Route
          element={
            (user?.email === "menshostelgecskp@gmail.com") ? (
              <AdminPage />
            ) : user ? (
              <CalenderPage />
            ) : (
              <Navigate to="/login" />
            )
          }
          exact
          path="/dashboard"
        />

        <Route
          element={
            (user?.email === "menshostelgecskp@gmail.com") ? (
              <Messfee />
            ) : user ? (
              <Userfee />
            ) : (
              <Navigate to="/messfee" />
            )
          }
          exact
          path="/messfee"
        />

        <Route element={<NewUserPage />} exact path="/new-users" />
        <Route element={<MhRules />} exact path="/rules" />
        <Route element={<Notification />} exact path="/notification" />

        <Route element={<div>Page Not found</div>} exact path="*" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
