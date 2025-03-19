import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        console.log("Token from localStorage:", token);
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        try {
            // Decode to check token validity
            const decoded = jwtDecode(token);
            console.log("Decoded token:", decoded);
            setIsAuthorized(true);
        } catch (error) {
            console.error("Token decoding error:", error);
            setIsAuthorized(false);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
