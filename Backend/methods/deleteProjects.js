const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { handleTokenExpirationError } = require("./sessionExpire");
const requestBodyParse = require('../util/body-parse');

const JWT_SECRET = 'secret_key';

module.exports = async (req, res, index) => {
    let data;
    let token;
    try {
        data = req.data;
        token = req.headers.authorization;

        if (!token) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ statusCode: 401, message: 'Unauthorized' }));
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = data.users.find((user) => user.id === decoded.userId);

        if (!user) {
            res.writeHead(404, { 'Content-type': 'application/json' });
            res.end(JSON.stringify({ title: 'Not Found!', message: 'User not found' }));
            return;
        }

        const projects = user.projects || [];

        if (isNaN(index) || index < 0 || index >= projects.length) {
            res.statusCode = 400;
            res.write(JSON.stringify({ title: 'Bad Request', message: 'Invalid Index' }));
            res.end();
        } else {
            projects.splice(index, 1);
            fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(data, null, 2));

            res.writeHead(204); // Use 204 for successful deletion without response body
            res.end();
        }
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