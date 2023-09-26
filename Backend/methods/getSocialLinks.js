const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { handleTokenExpirationError } = require("./sessionExpire");
const requestBodyParse = require("../util/body-parse");
const JWT_SECRET = "secret_key"; 


module.exports = async (req, res) => {
    if(req.url === '/socialLinks' && req.method === 'GET'){
        let data;
        let token;
        try {
            const body = await requestBodyParse(req);
            data = req.data;
            token = req.headers.authorization;
    
            if (!token) {
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ statusCode: 401, message: "Unauthorized" }));
                return;
            }
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = data.users.find((user) => user.id === decoded.userId);
    
            if(!user.socialLinks) {
                user.socialLinks = {};
            }
            
            const socialLinks = user.socialLinks;
            const fileContents = fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8");
            const jsonData = JSON.parse(fileContents);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ statusCode: 200, message: "Social Links Get Successfully!", socialLinks }));
        }
        catch (error) {
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
    }
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ title: "Not Found!", message: "Route not Found" }));
      }
}

