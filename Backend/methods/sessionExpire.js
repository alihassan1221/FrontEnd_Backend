const jwt = require("jsonwebtoken");

const JWT_SECRET = "secret_key";

function handleTokenExpirationError(error, token) {
  if (error.name === 'TokenExpiredError') {
    return { statusCode: 401, message: "Token has expired." };
  } else {
    return { statusCode: 403, message: "Invalid token." };
  }
}

module.exports = { handleTokenExpirationError };
