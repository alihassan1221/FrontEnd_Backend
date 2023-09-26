const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const requestBodyParse = require("../util/body-parse");

const JWT_SECRET = "secret_key";

module.exports = async (req, res) => {
  if (req.url === "/login" && req.method === "POST") {
    try {
      const body = await requestBodyParse(req);
      const data = req.data;


      const user = data.users.find((user) => user.email === body.email);

      if (!user) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ statusCode: 400, message: "User not found" }));
        return;
      }

      const passwordMatch = await bcrypt.compare(body.password, user.password);

      if (passwordMatch) {
        const position = user.position || "Software Engineer";

        const token = jwt.sign({ userId: user.id, name: user.fname + " " + user.lname, position }, JWT_SECRET, { expiresIn:'1h' });

        if (!data.userToken) {
          data.userToken = [];
        }
        const userId = user.id;

        data.userToken.push({ userId, token });
        fs.writeFileSync(path.join(__dirname, "../data/users.json"), JSON.stringify(data, null, 2));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ statusCode: 200, message: "Login successful", position, user, token }));
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ statusCode: 401, message: "Incorrect password" }));
      }
    } catch (err) {
      console.error(err);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ title: "Bad Request", message: "Request Body is not Valid!" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ title: "Not Found!", message: "Route not Found" }));
  }
};
