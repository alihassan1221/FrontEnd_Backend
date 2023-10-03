const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { handleTokenExpirationError } = require("./sessionExpire");

const JWT_SECRET = "secret_key";

module.exports = (pool) => async (req, res) => {
    if (req.url !== '/socialLinks' || req.method !== 'GET') {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ title: "Not Found!", message: "Route not Found" }));
        return;
    }

    let token;

    try {
        token = req.headers.authorization;
        const decoded = jwt.verify(token, JWT_SECRET);

        const [users] = await pool.promise().query('SELECT * FROM Users WHERE UserID = ?', [decoded.userId]);

        const user = users[0];

        const [existingLinks] = await pool.promise().query('SELECT * FROM social_media_links WHERE userId = ?', [user.UserID]);

        if (!existingLinks) {
            res.writeHead(402, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ statusCode: 402, message: "Social Data Not Present!" }));
        } else {
            const socialLinks = existingLinks[0];
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ statusCode: 200, message: "Social Data Get Successfully!", socialLinks }));
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            const tokenErrorResponse = handleTokenExpirationError(error, token);
            res.writeHead(tokenErrorResponse.statusCode, { "Content-Type": "application/json" });
            res.end(JSON.stringify(tokenErrorResponse));
        } else {
            console.error(error);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ title: "Bad Request", message: "Request Body is not Valid!" }));
        }
    }
};
