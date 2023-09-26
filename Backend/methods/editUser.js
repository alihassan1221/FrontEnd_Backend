const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { handleTokenExpirationError } = require('./sessionExpire');
const requestBodyParse = require('../util/body-parse');

const JWT_SECRET = 'secret_key';

module.exports = async (req, res) => {
    try {
        const body = await requestBodyParse(req);
        const data = req.data;
        const users = data.users || [];

        // Get the token from the Authorization header
        const token = req.headers.authorization;

        // Verify and decode the token
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    const tokenErrorResponse = handleTokenExpirationError(data, token);
                    res.writeHead(tokenErrorResponse.statusCode, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(tokenErrorResponse));
                } else {
                    console.error(err);
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ statusCode: 401, message: 'Unauthorized' }));
                }
            } else {
                // Token is valid, continue with your logic
                if (isNaN(index) || index < 0 || index >= users.length) {
                    res.statusCode = 400;
                    res.write(JSON.stringify({ title: 'Bad Request', message: 'Invalid Index' }));
                    res.end();
                } else {
                    users[index] = body;
                    fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(data, null, 2));
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'User updated successfully' }));
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ title: 'Bad Request', message: 'Request Body is not Valid!' }));
    }
};
