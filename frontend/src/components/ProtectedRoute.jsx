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

        // Check if token exists
        if (!token) {
            console.log("No token found in localStorage");
            setIsAuthorized(false);
            return;
        }

        // Basic validation - JWT should have 3 parts separated by dots
        if (
            !token.match(
                /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/
            )
        ) {
            console.error(
                "Token format is invalid:",
                token.substring(0, 10) + "..."
            );
            localStorage.removeItem(ACCESS_TOKEN); // Remove invalid token
            setIsAuthorized(false);
            return;
        }

        try {
            // Decode to check token validity
            const decoded = jwtDecode(token);

            // Check if token is expired
            if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                console.log("Token has expired");
                localStorage.removeItem(ACCESS_TOKEN);
                setIsAuthorized(false);
                return;
            }

            console.log("Valid token detected, user authorized");
            setIsAuthorized(true);
        } catch (error) {
            console.error("Token decoding error:", error);
            localStorage.removeItem(ACCESS_TOKEN); // Remove invalid token
            setIsAuthorized(false);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
