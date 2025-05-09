import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import Home from "./routes/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Jobs from "./routes/Jobs";
import MyProjects from "./routes/MyProjects";
import Profile from "./routes/Profile";
import JobDetail from "./routes/JobDetail";
import ClientJobs from "./routes/ClientJobs";
import { DashboardPage } from "./routes/Dashboard";
import PostJob from "./routes/PostJob";
import LogoutRoute from "./routes/Logout";
import { clearError } from "./redux/slices/authSlice";
import { useEffect } from "react";
import AddPortfolio from "./routes/AddPortfolio";
import PortfolioDetail from "./routes/PortfolioDetail";
import Proposals from "./routes/Proposals";
import { useSelector, useDispatch } from "react-redux";
function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const user = useSelector((state) => state.auth.user);
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
                                {user.role === "client" ? <ClientJobs /> : <Jobs />}
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/jobs/:id"
                        element={
                            <ProtectedRoute>
                                <JobDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/projects"
                        element={
                            <ProtectedRoute>
                                <MyProjects />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/proposals"
                        element={
                            <ProtectedRoute>
                                <Proposals />
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
                    <Route
                        path="/addportfolio"
                        element={
                            <ProtectedRoute>
                                <AddPortfolio />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/portfolios/:id"
                        element={
                            <ProtectedRoute>
                                <PortfolioDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/logout" element={<LogoutRoute />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
