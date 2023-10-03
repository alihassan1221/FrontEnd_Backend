const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { handleTokenExpirationError } = require("./sessionExpire");

module.exports = (pool) => async (req, res, searchInput) => {
    if (req.url.startsWith('/adminProjects') && req.method === 'GET') {
        let token;
        try {
            token = req.headers.authorization;
            jwt.verify(token, 'secret_key', async (err, decoded) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                      const tokenErrorResponse = handleTokenExpirationError(err, token);
                      res.writeHead(tokenErrorResponse.statusCode, { "Content-Type": "application/json" });
                      res.end(JSON.stringify(tokenErrorResponse));
                    } else {
                        console.error(err);
                        res.writeHead(401, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ statusCode: 401, message: "Unauthorized" }));
                    }
                } else {
                    const [existingProjects] = await pool.promise().query('SELECT * FROM projects');

                    if (!existingProjects) {
                        res.writeHead(402, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ statusCode: 402, message: "Projects Data Not Present!" }));
                    } else {

                        let searchProjects = [];
                        existingProjects.forEach((project, index) => {
                            if(project.projectTitle.toLowerCase().includes(searchInput.toLowerCase())|| project.skills.toLowerCase().includes(searchInput.toLowerCase())){
                                searchProjects.push(project);
                            }
                        });

                        res.writeHead(200, { "Content-Type": "application/json" });
                        res.end(JSON.stringify({ statusCode: 200, message: "Projects Get Successfully!", searchProjects }));
                    }
                }
            });
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                const tokenErrorResponse = handleTokenExpirationError(req, res);
                await pool.execute(
                    'DELETE FROM usersTokens WHERE token=?', [token]
                  );
                res.writeHead(tokenErrorResponse.statusCode, { "Content-Type": "application/json" });
                res.end(JSON.stringify(tokenErrorResponse));
            } else {
                console.error(err);
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ title: "Bad Request", message: "Request Body is not Valid!" }));
            }
        }
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ title: "Not Found!", message: "Route not Found" }));
    }
};
