const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const { handleTokenExpirationError } = require("./sessionExpire");
const requestBodyParse = require("../util/body-parse");

const JWT_SECRET = "secret_key";

module.exports = (pool) => async (req, res, projectId) => {
  let token;
  try {
    const id = parseInt(projectId);
    token = req.headers.authorization;
    const decoded = jwt.verify(token, JWT_SECRET);
    const [users] = await pool.promise().query('SELECT * FROM Users WHERE UserID = ?', [decoded.userId]);

    if (users.length === 0) {
      res.writeHead(402, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ statusCode: 402, message: "User not found" }));
      return;
    }

    const user = users[0];

    const [existingProjects] = await pool.promise().query('SELECT * FROM projects WHERE userId = ?', [user.UserID]);

    if (existingProjects.length > 0) {
      for (let project of existingProjects) {
        if (project.id === id) {
          await pool.execute('DELETE FROM projects WHERE id=?', [project.id]);
        }
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ statusCode: 200, message: "Project deleted successfully" }));
    } else {
      res.writeHead(402, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ statusCode: 402, message: "Project not found" }));
    }
  } catch (error) {
    console.error(error);
    if (error.name === 'TokenExpiredError') {
      const tokenErrorResponse = handleTokenExpirationError(error, token);
      res.end(JSON.stringify(tokenErrorResponse.statusCode, tokenErrorResponse));
    } else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ title: "Bad Request", message: "Request Body is not Valid!" }));
    }
  }
};
