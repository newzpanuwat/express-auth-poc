const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const helmet = require("helmet");
const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
require("dotenv").config();

const generateAccessToken = require("../helpers/generateAccesstoken");
const { ensureAuthenticated, authUser } = require("./middleware");

var refreshTokens = [];

app.get("/", (req, res) => {
  try {
    res.status(200).send({ status: "OK", data: "Welcome auth POC" });
  } catch (err) {
    res.status(500).send({ status: "FAILED", message: err });
  }
});

app.post("/auth/refresh", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken || !refreshTokens.includes(refreshToken))
    return res.status(403).send({ status: "FAILED", message: "Refersh token is null" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send({ status: "FAILED", message: err });
    const accessToken = generateAccessToken(user);
    res.status(200).send({ status: "OK", accessToken });
  });
});

app.post("/auth/login", (req, res) => {
  const { user } = req.body;
  if (!user) {
    return res.status(400).send({ status: "FAILED", message: "Bad Request" });
  }
  try {
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);

    res.send({ auth: true, status: "OK", accessToken, refreshToken });
  } catch (err) {
    res.status(500).send({ status: "FAILED", message: err });
  }
});

app.get("/api/v1/profile", ensureAuthenticated, authUser, (req, res) => {
  if (!req.user) return;

  try {
    const { id, email } = req.user;
    res.status(200).send({
      auth: true,
      status: "OK",
      data: [{ user_id: id, email: email }],
    });
  } catch (err) {
    res.status(500).send({ status: "FAILED", message: err });
  }
});

app.get("/api/v1/test", ensureAuthenticated, authUser, (req, res) => {
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
