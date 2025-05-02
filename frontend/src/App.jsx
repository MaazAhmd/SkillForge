import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import Home from "./routes/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Jobs from "./routes/Jobs";
import MyJobs from "./routes/MyJobs";
import Profile from "./routes/Profile";
import { DashboardPage } from "./routes/Dashboard";
import PostJob from "./routes/PostJob";
import LogoutRoute from "./routes/Logout";
import { clearError } from "./redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";


function App() {
    const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);
   
  return (
    <Router>
      <div className="font-sans">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
    path="/"
    element={
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    }
  />
        <Route
    path="/jobs"
    element={
      <ProtectedRoute>
        <Jobs />
      </ProtectedRoute>
    }
  />
        <Route
    path="/myjobs"
    element={
      <ProtectedRoute>
        <MyJobs />
      </ProtectedRoute>
    }
  />
        <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }
  />
        <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    }
  />
        <Route
    path="/postjob"
    element={
      <ProtectedRoute>
        <PostJob />
      </ProtectedRoute>
    }
  />
  <Route path="/logout" element={<LogoutRoute/>}/>
      </Routes>
      </div>
    </Router>
  );
}

export default App;
