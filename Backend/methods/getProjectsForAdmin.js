const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { handleTokenExpirationError } = require("./sessionExpire");

module.exports = async (req, res) => {
  if (req.url === '/adminProjects' && req.method === 'GET') {
    let data;
    let token;
    try {
      const fileContents = fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8");
      data = JSON.parse(fileContents);
      token = req.headers.authorization;

      if (!data.users) {
        data.users = [];
      }

      // Verify and decode the token
      jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            const tokenErrorResponse = handleTokenExpirationError(data, token);
            res.writeHead(tokenErrorResponse.statusCode, { "Content-Type": "application/json" });
            res.end(JSON.stringify(tokenErrorResponse));
          } else {
            console.error(err);
            res.writeHead(401, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ statusCode: 401, message: "Unauthorized" }));
          }
        } else {
          const allProjects = [];

          data.users.forEach((user) => {
            const projects = user.projects || [];
            allProjects.push(...projects);
          });

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ statusCode: 200, message: "Projects Get Successfully!", projects: allProjects }));
        }
      });
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        const tokenErrorResponse = handleTokenExpirationError(data, token);
        res.writeHead(tokenErrorResponse.statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify(tokenErrorResponse));
      } else {
        console.error(err);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ title: "Bad Request", message: "Request Body is not Valid!" }));
      }
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ title: "Not Found!", message: "Route not Found" }));
  }
};
