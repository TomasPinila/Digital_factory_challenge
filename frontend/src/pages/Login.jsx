import Form from "../components/Form";
import { Link } from "react-router-dom";
import "../styles/AuthPages.css";

function Login() {
    return (
        <div className="auth-container">
            <Form route="/api/login" method="login" />
            <Link to="/register" className="auth-link">
                Don't have an account? Register
            </Link>
        </div>
    );
}

export default Login;
