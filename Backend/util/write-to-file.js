const fs = require('fs');
const path = require('path');

module.exports = (data) => {
    const filePath = path.join(__dirname, '..', 'data', 'users.json');
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Data written to file successfully');
        }
    });
};
