const fs = require("fs");
const path = require("path");
const { handleTokenExpirationError } = require("./sessionExpire");
const jwt = require("jsonwebtoken");
const requestBodyParse = require("../util/body-parse");

const JWT_SECRET = "secret_key";

module.exports = async (req, res) => {
  if (req.url === "/projects" && req.method === "POST") {
    let data;
    let token;
    try {
      const body = await requestBodyParse(req);
      data = req.data;
      token = req.headers.authorization;

      if (!token) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ statusCode: 401, message: "Unauthorized" }));
        return;
      }
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = data.users.find((user) => user.id === decoded.userId);

      if (!user) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ statusCode: 400, message: "User not found" }));
        return;
      }

      if (!user.projects) {
        user.projects = [];
      }

      user.projects.push(body);
      fs.writeFileSync(path.join(__dirname, "../data/users.json"), JSON.stringify(data, null, 2));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Project Added successfully' }));
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const tokenErrorResponse = handleTokenExpirationError(data, token);
        res.writeHead(tokenErrorResponse.statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify(tokenErrorResponse));
      } else {
        console.error(error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ title: "Bad Request", message: "Request Body is not Valid!" }));
      }
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ title: "Not Found!", message: "Route not Found" }));
  }
};
