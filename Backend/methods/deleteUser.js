const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { handleTokenExpirationError } = require('./sessionExpire');
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
                if (isNaN(index) || index < 0 || index >= data.users.length) {
                    res.statusCode = 400;
                    res.write(JSON.stringify({ title: 'Bad Request', message: 'Invalid Index, User Not Found' }));
                    res.end();
                } else {
                    data.users.splice(index, 1);
                    fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(data, null, 2));

                    res.writeHead(204);
                    res.end();
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ title: 'Bad Request', message: 'Request Body is not Valid!' }));
    }
};
