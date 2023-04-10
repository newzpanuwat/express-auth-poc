const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
require("dotenv").config();

app.use(express.json());

// verifyToken
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
    return res.status(401).send({ status: "FAILED", message: "Unauthorized" });
  }
  next();
};

app.get("/", (req, res) => {
  try {
    res.status(200).send({ status: "OK", data: req.body });
  } catch (err) {
    res.status(500).send({ status: "FAILED", message: "Internal server error" });
  }
});

// auth
app.post("/api/v1/login", (req, res) => {
  if (!req.body.user) {
    return res.status(400).send({ status: "FAILED", message: "Bad Request" });
  }
  try {
    jwt.sign(req.body.user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }, (err, token) => {
      if (!err) res.send({ auth: true, status: "OK", token });
      console.log(err);
    });
  } catch (err) {
    res.status(500).send({ status: "FAILED", message: "Internal server error" });
  }
});

app.get("/api/v1/profile", ensureAuthenticated, (req, res) => {
  if (!req.user) return;

  try {
    const { id, email } = req.user;
    res.status(200).send({
      auth: true,
      status: "OK",
      data: [{ user_id: id, email: email }],
    });
  } catch (err) {
    res.status(500).send({ status: "FAILED", message: "Internal server error" });
  }
});

app.get("/api/v1/test", ensureAuthenticated, (req, res) => {
  if (!req.user) return;

  try {
    const { id, email } = req.user;
    res.status(200).send({
      auth: true,
      status: "OK",
      data: [{ test: "test data something" }],
    });
  } catch (err) {
    res.status(500).send({ status: "FAILED", message: "Internal server error" });
  }
});

app.listen(4000, (err) => {
  err ? console.log(err) : console.log("Server started on PORT: 4000");
});
