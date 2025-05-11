// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Home = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        navigate("/jobs");
    }, [user, navigate]);

    return null;
};

export default Home;
