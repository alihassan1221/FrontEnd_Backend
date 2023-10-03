const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const { handleTokenExpirationError } = require("./sessionExpire");
const requestBodyParse = require("../util/body-parse");

// const JWT_SECRET = "secret_key";

module.exports = (pool) => async (req, res, UserID) => {
  let token;
  try {
    const body = await requestBodyParse(req);
    token = req.headers.authorization;

    const [adminCheck] = await pool.promise().query('SELECT Role FROM Users WHERE UserID = ?', [UserID]);

    if (adminCheck[0].Role !== 'admin') {
        await pool.execute(
            "UPDATE Users SET Role = 'admin' WHERE UserID = ?", [UserID]
        );
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ statusCode: 200, message: "Successfully changed the role of the user to admin" }));
        return;
    }

    if (adminCheck[0].Role === 'admin') {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ statusCode: 400, message: "Already Admin" }));
        return;
    } else {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ statusCode: 403, message: "Role Not Changed" }));
    }
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
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ title: "Bad Request", message: "Request Body is not Valid!" }));
    }
  }
};
