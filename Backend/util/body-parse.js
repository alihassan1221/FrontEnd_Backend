module.exports = (request) => {
  return new Promise((resolve, reject) => {
    try {
      let body = "";

      request.on("data", (chunk) => {
        body += chunk;
      });

      request.on("end", () => {
        try {
          if (!body || body.trim() === "") {
            // Resolve with null for empty body
            resolve(null);
          } else {
            const parsedBody = JSON.parse(body);
            resolve(parsedBody);
          }
        } catch (parseError) {
          console.error("Error parsing request body:", parseError);
          reject(parseError);
        }
      });
    } catch (err) {
      console.error("Error reading request body:", err);
      reject(err);
    }

    request.on("error", (err) => {
      console.error("Error reading request:", err);
      reject(err);
    });
  });
};
