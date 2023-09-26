const writeToFile = require("../util/write-to-file");

module.exports = (req, res) => {
    let baseUrl = req.url.substring(0, req.url.lastIndexOf('/') + 1);
    let email = req.url.split('/')[3];
    const user = req.users.find(user => user.email === email);

    if(baseUrl === '/api/users/' && user){
        const index = req.users.findIndex((user) => {
            return user.email === email;
        });
        if(index === -1) {
            res.statusCode = 404;
            res.write(JSON.stringify({ title: 'Not Found!', message: 'User not found' }));
            res.end();
        }
        else {
            req.users.splice(index, 1);
            writeToFile(req.users);
            res.writeHead(204, {'Content-type': 'application/json'});
            res.end(JSON.stringify(req.users));
        }
    }
    else if(!user) {
        res.writeHead(404, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ title: 'Not Found!', message: 'User not found' }));
    }
};
