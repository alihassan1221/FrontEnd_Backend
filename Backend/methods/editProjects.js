const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const { handleTokenExpirationError } = require("./sessionExpire");
const requestBodyParse = require("../util/body-parse");

const JWT_SECRET = "secret_key";

module.exports = (pool) => async (req, res, projectId) => {
  let token;
  try {
    const id = parseInt(projectId);

    const body = await requestBodyParse(req);
    token = req.headers.authorization;

    const decoded = jwt.verify(token, JWT_SECRET);

    const [users] = await pool.promise().query('SELECT * FROM Users WHERE UserID = ?', [decoded.userId]);

    if (users.length === 0) {
      res.end(JSON.stringify({ statusCode: 402, message: "User not found" }));
      return;
    }

    const user = users[0];

    const [existingProjects] = await pool.promise().query('SELECT * FROM projects WHERE userId = ?', [user.UserID]);

    if (existingProjects.length > 0) {
      const project = body;
      await pool.execute(
        'UPDATE projects SET projectTitle=?, projectDetail=?, liveLink=?, codeLink=?, skills=?, projectImageURL=? WHERE userId=? AND id=?',
        [project.projectTitle, project.projectDetail, project.liveLink, project.codeLink, project.skills, project.projectImage, user.UserID, id]
      );

      res.end(JSON.stringify({ statusCode: 200, message: "Projects updated successfully" }));
    } else {
      res.writeHead(402, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ statusCode: 402, message: "Projects Not Found" }));
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    if (error.name === 'TokenExpiredError') {
      const tokenErrorResponse = handleTokenExpirationError(error, token);
      res.end(JSON.stringify(tokenErrorResponse.statusCode, tokenErrorResponse));
    } else {
      res.end(JSON.stringify({ title: "Bad Request", message: "Request Body is not Valid!" }));
    }
  }
};
