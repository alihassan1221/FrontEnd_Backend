module.exports = (request) => {
  return new Promise((resolve, reject) => {
    try {
      let body = "";

      // Listen for incoming data chunks
      request.on("data", (chunk) => {
        body += chunk;
      });

      // When all data has been received
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
          reject(parseError); // Reject with the parsing error
        }
      });

      // Handle any errors that occur during data reading
      request.on("error", (err) => {
        console.error("Error reading request:", err);
        reject(err); // Reject with the read error
      });
    } catch (err) {
      console.error("Error setting up request body parsing:", err);
      reject(err); // Reject with the setup error
    }
  });
};
