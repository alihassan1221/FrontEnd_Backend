const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const requestBodyParse = require("../util/body-parse");
const { handleTokenExpirationError } = require("./sessionExpire");
const JWT_SECRET = "secret_key";


module.exports = async (req, res) => {
    if(req.url === '/education' && req.method === 'GET'){
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
    
            if(!user.education) {
                user.education = [];
            }
            const education = user.education; 
            const fileContents = fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf8");
            const jsonData = JSON.parse(fileContents);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ statusCode: 200, message: "Education Data Got Successfully!", education}));
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

