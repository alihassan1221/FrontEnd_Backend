const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const { handleTokenExpirationError } = require("./sessionExpire");
const requestBodyParse = require("../util/body-parse");

const JWT_SECRET = "secret_key";

module.exports = (pool) => async (req, res, experienceId) => {
  let token;
  try {
    const id = parseInt(experienceId);

    token = req.headers.authorization;
    const decoded = jwt.verify(token, JWT_SECRET);

    const [users] = await pool.promise().query('SELECT * FROM Users WHERE UserID = ?', [decoded.userId]);

    if (users.length === 0) {
      res.writeHead(402, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ statusCode: 402, message: "User not found" }));
      return;
    }

    const user = users[0];

    const [existingExperience] = await pool.promise().query('SELECT * FROM experience WHERE userId = ?', [user.UserID]);

    if (existingExperience.length > 0) {
      for (let experience of existingExperience) {
        if (experience.id === id) {
          await pool.execute('DELETE FROM experience WHERE id=?', [experience.id]);
        }
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ statusCode: 200, message: "Experience deleted successfully" }));
    } else {
      res.writeHead(402, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ statusCode: 402, message: "Experience not found" }));
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    if (error.name === 'TokenExpiredError') {
      const tokenErrorResponse = handleTokenExpirationError(error, token);
      await pool.execute(
        'DELETE FROM usersTokens WHERE token=?', [token]
      );
      res.end(JSON.stringify(tokenErrorResponse.statusCode, tokenErrorResponse));
    } else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ title: "Bad Request", message: "Request Body is not Valid!" }));
    }
  }
};
