module.exports = (req, res) => {
    let baseUrl = req.url.substring(0, req.url.lastIndexOf('/') + 1);
    let email = req.url.split('/')[3];
    // const user = req.data.find(user => user.email === email);

    if(req.url === '/api/users'){
        res.statusCode =  200,
        res.setHeader('Content-type', 'application/json');
        res.write(JSON.stringify(req.data));
        res.end();
    }
    else if(baseUrl === '/api/users/' && user){
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(JSON.stringify(statusCode = "200" , user));
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