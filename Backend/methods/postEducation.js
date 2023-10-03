const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const { handleTokenExpirationError } = require("./sessionExpire");
const requestBodyParse = require("../util/body-parse");

const JWT_SECRET = "secret_key";

module.exports = (pool) => async (req, res) => {
  let token;
  try {
    const body = await requestBodyParse(req);
    token = req.headers.authorization;

    const decoded = jwt.verify(token, JWT_SECRET);

    const [users] = await pool.promise().query('SELECT * FROM Users WHERE UserID = ?', [decoded.userId]);

    if (users.length === 0) {
      res.end(JSON.stringify({ statusCode: 404, message: "User not found" }));
      return;
    }

    const user = users[0];
    const education = body;

    await pool.execute(
      "INSERT INTO educations (userId, institute, degree, major, grades, startingDate, endingDate) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [user.UserID, education.institute, education.degree, education.major, education.grades, education.startingDate, education.endingDate]
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ statusCode: 200, message: "Education Added successfully" }));
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const tokenErrorResponse = handleTokenExpirationError(error, token);
      res.end(JSON.stringify(tokenErrorResponse.statusCode, tokenErrorResponse));
    } else {
      res.end(JSON.stringify({ title: "Bad Request", message: "Request Body is not Valid!" }));
    }
  }
};
