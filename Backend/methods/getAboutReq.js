const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const requestBodyParse = require("../util/body-parse");
const { handleTokenExpirationError } = require("./sessionExpire");

const JWT_SECRET = "secret_key";

module.exports = async (req, res) => {
    if (req.url !== '/about' || req.method !== 'GET') {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ title: "Not Found!", message: "Route not Found" }));
        return;
    }

    let data;
    let token;

    try {
        const body = await requestBodyParse(req);
        data = req.data; // Assign value to data here
        token = req.headers.authorization;
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = data.users.find((user) => user.id === decoded.userId);

        if (!user.aboutData) {
            user.aboutData = {};
        }

        const aboutData = user.aboutData;
        const fileContents = fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8");
        const jsonData = JSON.parse(fileContents);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ statusCode: 200, message: "About Data Get Successfully!", aboutData, user }));
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            const tokenErrorResponse = handleTokenExpirationError(data, token);
            res.writeHead(tokenErrorResponse.statusCode, { "Content-Type": "application/json" });
            res.end(JSON.stringify(tokenErrorResponse));
        } else {
            console.error(error);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ title: "Bad Request", message: "Request Body is not Valid!" }));
        }
    }
};
