import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import Home from "./routes/Home";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
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
      </Routes>
      </div>
    </Router>
  );
}

export default App;
