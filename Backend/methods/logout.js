const fs = require("fs");
const path = require("path");

module.exports = (pool) => async (req, res) => {
    if (req.url !== '/logout' || req.method !== 'DELETE') {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ title: "Not Found!", message: "Route not Found" }));
      return;
  }
    try {
      const token = req.headers.authorization;
      if(token){
        await pool.execute(
          'DELETE FROM usersTokens WHERE token=?', [token]
        );

        res.writeHead( 200, JSON.stringify('Content-Type', 'application/json'));
        res.end(JSON.stringify({ statusCode: 200, message: "Logout Successful" }));
      }    
      else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ statusCode: 404, message: "Token not found" }));
      }
    } 
    catch (err) {
      console.error(err);
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ title: "Bad Request", message: "Request Body is not Valid!" }));
    }
};
