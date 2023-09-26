const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  if (req.url === "/logout" && req.method === "POST") {
    try {
      const data = req.data;
      const token = req.headers.authorization;

      const fileTokenIndex = data.userToken.findIndex((user) => {
        try {
          return user.token === token;
        } catch (err) {
          console.log(err);
          return false;
        }
      });

      if (fileTokenIndex !== -1) {
        data.userToken.splice(fileTokenIndex, 1);
        fs.writeFileSync(path.join(__dirname, "../data/users.json"), JSON.stringify(data, null, 2));

        // Send a success response to the client
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ statusCode: 200, message: "Logout successful" }));
      } else {
        console.log('Token not found');
        // Send a response indicating that the token was not found
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ statusCode: 404, message: "Token not found" }));
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
