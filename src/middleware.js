const jwt = require("jsonwebtoken");
const { users } = require("../helpers/data");

// middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.headers["authorization"]) {
    try {
      let authorization = req.headers["authorization"].split(" ");
      if (authorization[0] !== "Bearer") {
        return res.status(401).send({ auth: false, message: "Unauthorized" });
      } else {
        req.user = jwt.verify(authorization[1], process.env.ACCESS_TOKEN_SECRET);
        next();
      }
    } catch (err) {
      return res.status(403).send({ auth: false, message: err });
    }
  } else {
    return res.status(401).send({ auth: false, message: "Unauthorized" });
  }
};

const authUser = (req, res, next) => {
  const { email } = req.user;
  const user = users.findIndex((e) => e.email === email);
  if (!email || user < 0) {
    return res.status(403).send({ auth: false, message: "Unauthorized" });
  }
  next();
};

module.exports = { ensureAuthenticated, authUser };
