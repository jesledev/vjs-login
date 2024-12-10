import { Link } from "react-router-dom";
import { useAuth } from "../utils/authContext";
import Logout from "./Logout";

function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <nav style={{ display: "flex", gap: "15px", padding: "10px" }}>
      <Link to="/">Home</Link>
      <Link to="/register">Register</Link>
      {isAuthenticated ? (
        <>
        <Link to="/dashboard">Dashboard</Link>
        <Logout />
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}

export default Navbar;
