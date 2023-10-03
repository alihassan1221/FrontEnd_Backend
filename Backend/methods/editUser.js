const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const { handleTokenExpirationError } = require('./sessionExpire');
const requestBodyParse = require('../util/body-parse');

const JWT_SECRET = 'secret_key';

module.exports = (pool) => async (req, res, UserID) => {
    let token;
    try {
        const body = await requestBodyParse(req);
        token = req.headers.authorization;

        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    const tokenErrorResponse = handleTokenExpirationError(err, token);
                    res.writeHead(tokenErrorResponse.statusCode, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(tokenErrorResponse));
                } else {
                    console.error(err);
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ statusCode: 401, message: 'Unauthorized' }));
                }
            } else {
                const id = UserID;
                const [users] = await pool.promise().query('SELECT * FROM Users WHERE UserID = ?', [id]);
                const user = users[0];

                const hashedPassword = await bcrypt.hash(body.password, 10);

                if (user) {
                    await pool.execute("UPDATE Users SET UserID=?, FirstName=?, LastName=?, Email=?, Phone=?, PasswordHash=? WHERE UserID=?",
                        [id, body.fname, body.lname, body.email, body.phone, hashedPassword, id]
                    );

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ title: 'Updated', message: 'User Update Successful!' }));
                    return;
                }

                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ title: 'Bad Request', message: 'User Not Updated!' }));
            }
        });
    } catch (error) {
        console.error(error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ title: 'Bad Request', message: 'Request Body is not Valid!' }));
    }
};
