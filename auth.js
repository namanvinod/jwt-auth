const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) res.status(403).send("A token is required for authentication");

    try {
        req.user = jwt.verify(token, 'DNRJDed44Dcc*ff');
    } catch (err) {
        res.status(401).send("Invalid Token");
    }
    
    return next();
};

module.exports = verifyToken;