const jwt = require("jsonwebtoken");

exports.authenticateJWT = (req, res, next) => {
  const token = req.cookies.rememberMe;

  if (!token) {
    console.log("No token provided");
    return res.status(401).send("Unauthorized");
  }

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      console.log("Failed to authenticate token");
      return res.status(401).send("Unauthorized");
    }

    console.log("Token authenticated, userId:", decoded.userId);
    req.userId = decoded.userId;
    next();
  });
};
