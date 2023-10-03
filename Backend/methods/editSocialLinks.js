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
      res.end(JSON.stringify({ statusCode: 402, message: "User not found" }));
      return;
    }

    const user = users[0];
    const [existingLinks] = await pool.promise().query('SELECT * FROM social_media_links WHERE userId = ?', [user.UserID]);

    if (existingLinks.length > 0) {
      const links = body;
      await pool.execute(
        'UPDATE social_media_links SET twitterLink=?, githubLink=?, linkedinLink=? WHERE userId=?',
        [links.twitterLink, links.githubLink, links.linkedinLink, user.UserID]
      );

      res.end(JSON.stringify({ statusCode: 200, message: "Social Links updated successfully" }));
    } else {
      res.writeHead(402, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ statusCode: 402, message: "Social Links Not Found" }));
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
      res.end(JSON.stringify({ title: "Bad Request", message: "Request Body is not Valid!" }));
    }
  }
};
