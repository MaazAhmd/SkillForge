// src/pages/Home.jsx
import LogoutButton from "../components/LogoutButton";

const Home = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome Home!</h1>
      <LogoutButton />
    </div>
  );
};

export default Home;
