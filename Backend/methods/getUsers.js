const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { handleTokenExpirationError } = require("./sessionExpire");

module.exports = (pool) => async (req, res) => {
  if (req.url === '/adminUsers' && req.method === 'GET') {
    let token;
    try {
      token = req.headers.authorization;

      jwt.verify(token, 'secret_key', async (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            const tokenErrorResponse = handleTokenExpirationError(err, token);
            res.writeHead(tokenErrorResponse.statusCode, { "Content-Type": "application/json" });
            res.end(JSON.stringify(tokenErrorResponse));
          } else {
            console.error(err);
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ statusCode: 401, message: "Unauthorized" }));
          }
        } else {
          try {
            const [results] = await pool.promise().query('SELECT * FROM Users');

            const users = results;

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ statusCode: 200, message: "Users Data Get Successfully!", users }));
          } catch (error) {
            console.error('Error executing database query:', error);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ statusCode: 500, message: "Internal server error" }));
          }
        }
      });
    } catch (error) {
      console.error(error);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ title: "Bad Request", message: "Request Body is not Valid!" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ title: "Not Found!", message: "Route not Found" }));
  }
};
