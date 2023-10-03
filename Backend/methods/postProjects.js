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
    const project = body;

    await pool.execute(
      "INSERT INTO projects (userId, projectTitle, projectDetail, liveLink, codeLink, skills, projectImageURL) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [user.UserID, project.projectTitle, project.projectDetail, project.liveLink, project.codeLink, project.skills, project.projectImage]
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ statusCode: 200, message: "Project Data added successfully" }));
  } 
  catch (error) {
    if (error.name === 'TokenExpiredError') {
      const tokenErrorResponse = handleTokenExpirationError(error, token);
      await pool.execute(
        'DELETE FROM usersTokens WHERE token=?', [token]
      );
      res.end(JSON.stringify(tokenErrorResponse.statusCode, tokenErrorResponse));
    } else {
      console.error(error);
      res.end(JSON.stringify({ title: "Bad Request", message: "Request Body is not Valid!" }));
    }
  }
};
