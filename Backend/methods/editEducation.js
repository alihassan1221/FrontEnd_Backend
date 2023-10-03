const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const { handleTokenExpirationError } = require("./sessionExpire");
const requestBodyParse = require("../util/body-parse");

const JWT_SECRET = "secret_key";

module.exports = (pool) => async (req, res, educationId) => {
  let token;
  try {
    const id = parseInt(educationId);

    const body = await requestBodyParse(req);
    token = req.headers.authorization;

    const decoded = jwt.verify(token, JWT_SECRET);

    const [users] = await pool.promise().query('SELECT * FROM Users WHERE UserID = ?', [decoded.userId]);

    if (users.length === 0) {
      res.end(JSON.stringify({ statusCode: 402, message: "User not found" }));
      return;
    }

    const user = users[0];

    const [existingEducation] = await pool.promise().query('SELECT * FROM educations WHERE userId = ?', [user.UserID]);

    if (existingEducation.length > 0) {
      const education = body;
      await pool.execute(
        'UPDATE educations SET institute=?, degree=?, major=?, grades=?, startingDate=?, endingDate=? WHERE userId=? AND id=?',
        [education.institute, education.degree, education.major, education.grades, education.startingDate, education.endingDate, user.UserID, id]
      );

      res.end(JSON.stringify({ statusCode: 200, message: "Education updated successfully" }));
    } else {
      res.writeHead(402, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ statusCode: 402, message: "Education Not Found" }));
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
