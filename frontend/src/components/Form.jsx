import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
    const [fullName, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    //track if loading or not
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        // prevent from reload page
        e.preventDefault();

        // try to send request
        try {
            if (method === "login") {
                const res = await api.post(route, { email, password });
                //console.log("Login response:", res.data);
                localStorage.setItem(ACCESS_TOKEN, res.data.accessToken);
                navigate("/");
            } else {
                const res = await api
                    .post(route, {
                        fullName,
                        email,
                        password,
                    })
                    .then((res) => {
                        console.log("Register response:", res.data);
                        if (
                            res.data.error === true &&
                            res.data.message === "User already exists"
                        ) {
                            alert("User already exists");
                        } else {
                            alert("Successfully registered");
                            navigate("/login");
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                        alert("An error occurred creating your account");
                    });
            }
        } catch (error) {
            if (error.response) {
                console.error("Error response:", error.response.data);
                alert(error.response.data.message || "An error occurred");
            } else {
                console.error("Error:", error.message);
                alert("An error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            {method !== "login" && (
                <input
                    className="form-input"
                    type="text"
                    value={fullName}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Full name"
                />
            )}
            <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                {name}
            </button>
        </form>
    );
}

export default Form;
