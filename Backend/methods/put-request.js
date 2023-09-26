const writeToFile = require('../util/write-to-file');
const requestBodyParse = require('../util/body-parse');

module.exports = async (req, res) => {
    let baseUrl = req.url.substring(0, req.url.lastIndexOf('/') + 1);
    let email = req.url.split('/')[3];
    const user = req.users.find(user => user.email === email);

    if(baseUrl === '/api/users/' && user){
        try{
            let body = await requestBodyParse(req);
            const index = req.users.findIndex((user) => {
                return user.email === email;
            });
            if(index === -1) {
                res.statusCode = 404;
                res.write(JSON.stringify({ title: 'Not Found!', message: 'User not found' }));
                res.end();
            }
            else {
                req.users[index] = {email, ...body};
                writeToFile(req.users);
                res.writeHead(200, {'Content-type': 'application/json'});
                res.end(JSON.stringify(req.users[index]));  
            }

        }catch(err){
            res.writeHead(400, {'Content-type': 'application/json'});
            res.end(JSON.stringify({ title: 'Not Valid!', message: 'Request Body is not Valid!' })); 

        }
        // res.statusCode = 200;
        // res.setHeader('Content-type', 'application/json');
        // res.end(JSON.stringify(user));
    }
    else if(!user) {
        res.writeHead(404, { 'Content-type': 'application/json' });
        res.end(JSON.stringify({ title: 'Not Found!', message: 'User not found' }));
    }
    else {
        res.writeHead(404, {'Content-type': 'application/json'});
        res.end(JSON.stringify({title: 'Not Found!', message: 'Route not Found'}));
    }
};
