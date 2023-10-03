const bcrypt = require("bcrypt");
const requestBodyParse = require("../util/body-parse");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "secret_key";

module.exports = (pool) => async (req, res) => {
  if (req.url === "/login" && req.method === "POST") {
    try {
      const body = await requestBodyParse(req);

      const [results] = await pool.promise().query('SELECT * FROM Users WHERE Email = ?', [body.email]);

      if (results.length === 0) {
        res.end(JSON.stringify({ statusCode: 400, message: "Users not found" }));
        return;
      }
      const user = results[0];
      const passwordMatch = await bcrypt.compare(body.password, user.PasswordHash);

      if (passwordMatch) {
        const position = user.Position || "Software Engineer";

        const token = jwt.sign(
          { userId: user.UserID, name: user.FirstName + " " + user.LastName },JWT_SECRET,{ expiresIn: '1h' }
        );

        const decoded = jwt.verify(token, JWT_SECRET);

        await pool.execute(
          "INSERT INTO usersTokens (userId, token) VALUES (?, ?)",
          [decoded.userId, token]
        );

        const [users] = await pool.promise().query('SELECT * FROM Users WHERE UserID = ?', [decoded.userId]);
        const gotUser = users[0];
        const Role = gotUser.Role;

        res.end(JSON.stringify({ statusCode: 200, message: "Login successful", token, Role }));
      } else {
        res.end(JSON.stringify({ statusCode: 401, message: "Incorrect password" }));
      }
    } catch (err) {
      console.error(err);
      res.end(JSON.stringify({ title: "Bad Request", message: "Request Body is not Valid!" }));
    }
  } else {
    res.end(JSON.stringify({ title: "Not Found!", message: "Route not Found" }));
  }
};
