const bcrypt = require("bcrypt");
const requestBodyParse = require("../util/body-parse");
// const { parse } = require("dotenv");

module.exports = (pool) => async (req, res) => {
  try {
    const body = await requestBodyParse(req);

    try {
      const [results] = await pool.promise().query('SELECT Email FROM Users');

      const emails = results;

      if (emails && emails.length > 0) {
        for (const requiredEmail of emails) {
          if (requiredEmail.Email === body.email) {
            res.end(JSON.stringify({ statusCode: 400, message: "Registeration Failed Email Already exists" }));
            return;
          }
        }
      }

      const isAdmin = ['admin1@gmail.com', 'admin2@gmail.com'].includes(body.email);
      const role = isAdmin ? 'admin' : 'user';

      const hashedPassword = await bcrypt.hash(body.password, 10);

      await pool.promise().execute(
          `INSERT INTO Users (FirstName, LastName, Phone, Email, PasswordHash, Role) VALUES (?, ?, ?, ?, ?, ?)`,
          [body.fname, body.lname, body.phone, body.email, hashedPassword, role]
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ statusCode: 200, message: "User registered successfully" }));
    } catch (error) {
      console.error('Error executing query:', error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ statusCode: 500, message: "Internal server error" }));
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ statusCode: 500, message: "Internal server error" }));
  }
};
