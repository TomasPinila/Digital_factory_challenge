const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        console.log("Token missing");
        return res.sendStatus(401);
    }
    // console.log(token);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("Token verification failed:", err.message);
            return res.sendStatus(403);
        }
        //console.log("Token verified successfully:", user);

        // Extract the user object from the decoded token
        req.user = decoded.user; // Set req.user to the user object
        next();
    });
}

module.exports = authenticateToken;
