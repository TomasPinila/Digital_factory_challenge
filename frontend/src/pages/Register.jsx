import Form from "../components/Form";
import { Link } from "react-router-dom";
import "../styles/AuthPages.css";

function Register() {
    return (
        <div className="auth-container">
            <Form route="/api/register" method="register" />
            <Link to="/login" className="auth-link">
                Already have an account? Login
            </Link>
        </div>
    );
}

export default Register;
