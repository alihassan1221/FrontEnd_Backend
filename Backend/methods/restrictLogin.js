const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const requestBodyParse = require("../util/body-parse");
const JWT_SECRET = "secret_key";


module.exports = async (req, res) => {
    if(req.url === '/restrictedUrl' && req.method === 'GET'){
        try {
            const body = await requestBodyParse(req);
            const data = req.data;
            const token = req.headers.authorization;
    
            if (!token) {
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ statusCode: 401, message: "Unauthorized" }));
                return;
            }
    
            const decoded = jwt.verify(token, JWT_SECRET);

            const user = data.users.find((user) => user.id === decoded.userId);
            const email = user.email;
            
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ statusCode: 200, message: "Social Links Get Successfully!", email }));
        }
        catch (err) {
            console.error(err);
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ title: "Bad Request", message: "Request Body is not Valid!" }));
        }
    }
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ title: "Not Found!", message: "Route not Found" }));
      }
}

