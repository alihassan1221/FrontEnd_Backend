const fs = require("fs");
const jwt = require("jsonwebtoken");
const { handleTokenExpirationError } = require("./sessionExpire");
const requestBodyParse = require("../util/body-parse");
const JWT_SECRET = "secret_key";


module.exports = (pool) => async (req, res) => {
        try {
            const body = await requestBodyParse(req);
            const token = req.headers.authorization;
    
            if (!token) {
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ statusCode: 401, message: "Unauthorized" }));
                return;
            }
    
            const decoded = jwt.verify(token, JWT_SECRET);
            const [users] = await pool.promise().query('SELECT * FROM Users WHERE UserID = ?', [decoded.userId]);

            const user = users[0];
            const Role = user.Role;
            
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ statusCode: 200, message: "Social Links Get Successfully!", Role }));
        }
        catch (error) {
          console.error(error);
        }
}

