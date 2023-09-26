const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { handleTokenExpirationError } = require("./sessionExpire");
const requestBodyParse = require("../util/body-parse");

const JWT_SECRET = "secret_key"; // Change this to your secret key for JWT

module.exports = async (req, res) => {
  if (req.url === "/about" && req.method === "POST") {
    let data;
    let token;
    try {
      const body = await requestBodyParse(req);
      const data = req.data;
      token = req.headers.authorization;

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = data.users.find((user) => user.id === decoded.userId);

      if (!user) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ statusCode: 400, message: "User not found" }));
        return;
      }

      user.aboutData = body;
      fs.writeFileSync(path.join(__dirname, "../data/users.json"), JSON.stringify(data, null, 2));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ statusCode: 200, message: "About data updated successfully" }));
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
