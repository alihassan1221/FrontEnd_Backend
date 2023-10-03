const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
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
    const [existingLinks] = await pool.promise().query('SELECT * FROM social_media_links WHERE userId = ?', [user.UserID]);

    if (existingLinks.length > 0) {
      res.writeHead(400, JSON.stringify('Content-Type', 'application/json'));
      res.end(JSON.stringify({ statusCode: 400, message: "Socail Links Already exists For this user" }));
      return;
    }

    const Links = body;

    await pool.execute(
      "INSERT INTO social_media_links (userId, twitterLink, githubLink, linkedinLink) VALUES (?, ?, ?, ?)",
      [user.UserID, Links.twitterLink, Links.githubLink, Links.linkedinLink]
    );

    res.end(JSON.stringify({ statusCode: 200, message: "Social Links Added successfully" }));
  } 
  catch (error) {
    console.error(error);
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
