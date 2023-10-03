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

    // Check if aboutData for the user already exists
    const [existingAboutData] = await pool.promise().query('SELECT * FROM aboutData WHERE userId = ?', [user.UserID]);

    if (existingAboutData.length > 0) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ statusCode: 400, message: "About data already exists for this user" }));
      return;
    }

    const aboutData = body;

    await pool.execute(
      "INSERT INTO aboutData (userId, position, summary, address, city, profile) VALUES (?, ?, ?, ?, ?, ?)",
      [user.UserID, aboutData.position, aboutData.summary, aboutData.address, aboutData.city, aboutData.profile]
    );

    res.end(JSON.stringify({ statusCode: 200, message: "About Data Added successfully" }));
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const tokenErrorResponse = handleTokenExpirationError(error, token);
      res.end(JSON.stringify(tokenErrorResponse.statusCode, tokenErrorResponse));
    } else {
      res.end(JSON.stringify({ title: "Bad Request", message: "Request Body is not Valid!" }));
    }
  }
};
