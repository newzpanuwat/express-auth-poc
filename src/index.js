const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send({ status: "OK" });
});

app.listen(4000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server started on PORT: 4000");
  }
});
