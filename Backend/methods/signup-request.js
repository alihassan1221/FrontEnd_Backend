const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { handleTokenExpirationError } = require("./sessionExpire");
const requestBodyParse = require("../util/body-parse");

module.exports = async (req, res) => {
  if (req.url === "/submit" && req.method === "POST") {
    try {
      const body = await requestBodyParse(req);
      const token = req.headers.authorization;

      if (!Array.isArray(req.data.users)) {
        req.data.users = [];
      }

      const existingEmail = req.data.users.some((user) => user.email === body.email);

      if (existingEmail) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ statusCode: 400, message: "Email already exists" }));
        return;
      }

      const userId = generateUserId(req.data.users);

      const hashedPassword = await bcrypt.hash(body.password, 10);
      const userData = {
        id: userId,
        fname: body.fname,
        lname: body.lname,
        phone: body.phone,
        email: body.email,
        password: hashedPassword,
      };

      req.data.users.push(userData);

      writeToDataFile(req.data);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ statusCode: 200, message: "User registered successfully" }));
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
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ title: "Not Found!", message: "Route not Found" }));
  }
};

function generateUserId(users) {
  if (!users || users.length === 0) {
    return 1;
  } 
  else {
    const maxUserId = Math.max(...users.map((user) => user.id));
    return maxUserId + 1;
  }
}

// Define the writeToDataFile function
function writeToDataFile(data) {
  const filePath = path.join(__dirname, "../data/users.json");
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log("Data written to users.json file successfully");
  } catch (err) {
    console.error("Error writing to users.json file:", err);
  }
}
