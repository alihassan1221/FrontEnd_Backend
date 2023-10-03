// const fs = require('fs');
// const path = require('path');
const jwt = require('jsonwebtoken');
const { handleTokenExpirationError } = require('./sessionExpire');
const JWT_SECRET = 'secret_key';

module.exports = (pool) => async (req, res, UserID) => {
    let token;
    try {
        token = req.headers.authorization;
        
        if (!token) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ statusCode: 401, message: 'Unauthorized' }));
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET);

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
                
                if (user) {
                    await pool.execute("DELETE FROM users WHERE UserID=?", [id])
                    res.writeHead(200, JSON.stringify('Content-Type', 'application/json'));
                    res.end(JSON.stringify({ statusCode: 200, title: 'Success', message: 'User Deleted Successfully' }));
                } else {
                    res.writeHead(404, JSON.stringify('Content-Type', 'application/json'));
                    res.end(JSON.stringify({ statusCode: 404, title: 'Not Found', message: 'User not found' }));
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
};
