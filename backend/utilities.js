const jwt = require("jsonwebtoken");
/**
 * Middleware to authenticate JWT tokens from request headers
 * Verifies the token and adds the user payload to the request object
 *
 * req - Express request object
 * res - Express response object
 * next - Express next middleware function
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: true,
            message: "Authentication required",
        });
    }
    // console.log(token);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                error: true,
                message: "Invalid or expired token",
            });
        }
        //console.log("Token verified successfully:", user);

        // Extract the user object from the decoded token
        req.user = decoded.user; // Set req.user to the user object
        next();
    });
}

module.exports = authenticateToken;
