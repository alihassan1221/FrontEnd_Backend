const fs = require("fs");
const path = require("path");

function handleTokenExpirationError(data, token) {
  const fileTokenIndex = data.userToken.findIndex((user) => {
    try {
      return user.token === token;
    } catch (err) {
      console.log(err);
      return false;
    }
  });

  if (fileTokenIndex !== -1) {
    data.userToken.splice(fileTokenIndex, 1);
    fs.writeFileSync(path.join(__dirname, "../data/users.json"), JSON.stringify(data, null, 2));
  } else {
    console.log('Index Not Found');
  }

  return {
    statusCode: 401,
    message: "Token is Expired",
  };
}

module.exports = { handleTokenExpirationError };
