const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACESSS_TOKEN_EXPIRES_IN,
  });
};

module.exports = generateAccessToken;
