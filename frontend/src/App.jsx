import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Jobs from "./pages/Jobs";
import MyProjects from "./pages/FreelancerProjects";
import Profile from "./pages/Profile";
import JobDetail from "./pages/JobDetail";
import ClientJobDetail from "./pages/ClientJobDetail";
import ClientJobs from "./pages/ClientJobs";
import { DashboardPage } from "./pages/Dashboard";
import PostJob from "./pages/PostJob";

import LogoutRoute from "./pages/Logout";
import { clearError } from "./redux/slices/authSlice";
import { useEffect } from "react";
import AddPortfolio from "./pages/AddPortfolio";
import PortfolioDetail from "./pages/PortfolioDetail";
import ChatPage from "./pages/ChatSessionPage";
import ChatListPage from "./pages/ChatListPage";
import ChatSessionPage from "./pages/ChatSessionPage";
import Proposals from "./pages/Proposals";
import { useSelector, useDispatch } from "react-redux";
import DepositFunds from "./pages/DepositFunds";

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
                                {user?.role === "client" ? (
                                    <ClientJobs />
                                ) : (
                                    <Jobs />
                                )}
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/jobs/:id"
                        element={
                            <ProtectedRoute>
                                {user?.role === "client" ? (
                                    <ClientJobDetail />
                                ) : (
                                    <JobDetail />
                                )}
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
                        path="/deposit-funds"
                        element={
                            <ProtectedRoute>
                                <DepositFunds />
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
                        path="/chats"
                        element={
                            <ProtectedRoute>
                                <ChatListPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/chat/:chatId"
                        element={
                            <ProtectedRoute>
                                <ChatSessionPage />
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
                  <Route
                      path="/edit-profile"
                      element={
                        <ProtectedRoute>
                          <EditProfile />
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