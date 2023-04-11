const jwt = require("jsonwebtoken");

// middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.headers["authorization"]) {
    try {
      let authorization = req.headers["authorization"].split(" ");
      if (authorization[0] !== "Bearer") {
        return res.status(401).send({ auth: false, message: "Unauthorized" });
      } else {
        req.user = jwt.verify(authorization[1], process.env.JWT_SECRET);
        next();
      }
    } catch (err) {
      return res.status(403).send({ auth: false, message: err });
    }
  } else {
    return res.status(401).send({ auth: false, message: "Unauthorized" });
  }
};

module.exports = { ensureAuthenticated };
