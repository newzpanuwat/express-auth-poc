const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

require("dotenv").config();
const { ensureAuthenticated } = require("./middleware");

app.get("/", (req, res) => {
  try {
    res.status(200).send({ status: "OK", data: req.body });
  } catch (err) {
    res.status(500).send({ status: "FAILED", message: "Internal server error" });
  }
});

// auth
app.post("/api/v1/login", (req, res) => {
  const { user } = req.body;
  if (!user) {
    return res.status(400).send({ status: "FAILED", message: "Bad Request" });
  }
  try {
    jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }, (err, token) => {
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
