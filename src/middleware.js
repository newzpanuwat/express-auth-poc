const jwt = require("jsonwebtoken");

// middleware
const ensureAuthenticated = (req, res, next) => {
  var token = req.header("Authorization");
  if (!token) return res.status(401).send({ status: "FAILED", message: "Unauthorized" });
  try {
    token = token.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) return res.status(401).send({ auth: false, message: "Failed to authenticate token." });

      req.user = decoded;
      next();
    });
  } catch (err) {
    return res.status(500).send({ status: "FAILED", message: "Internal server error" });
  }
  next();
};

module.exports = { ensureAuthenticated };
