const http = require("http");
const mysql = require('mysql2');


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Admin@123',
  database: 'usersdata',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database!');

  connection.release();
});

pool.on('error', (err) => {
  console.error('MySQL error:', err);
});
module.exports = pool;

const signupReq = require('./methods/signup-request')(pool);
const loginReq = require('./methods/login-request')(pool);
const postAboutData = require('./methods/postAboutData')(pool);
const getAboutReq = require('./methods/getAboutReq')(pool);
const editAboutData = require('./methods/editAboutData')(pool);
const getUsers = require('./methods/getUsers')(pool);
const educationReq = require('./methods/postEducation')(pool);
const getEducation = require('./methods/getEducation')(pool);
const deleteEducation = require('./methods/deleteEducation')(pool);
const editEducation = require('./methods/editEducation')(pool);
const postExperience = require('./methods/postExperience')(pool);
const getExperience = require('./methods/getExperience')(pool);
const deleteExperience = require('./methods/deleteExperience')(pool);
const editExperience = require('./methods/editExperience')(pool);
const postProjects = require('./methods/postProjects')(pool);
const getProjects = require('./methods/getProjects')(pool);
const deleteProjects = require('./methods/deleteProjects')(pool);
const editProjects = require('./methods/editProjects')(pool);
const postSocialLinks = require('./methods/postSocialLinks')(pool);
const getSocialLinks = require('./methods/getSocialLinks')(pool);
const editSocialLinks = require('./methods/editSocialLinks')(pool);
const editUser = require('./methods/editUser')(pool);
const deleteUser = require('./methods/deleteUser')(pool);
const getProjectsForAdmin = require("./methods/getProjectsForAdmin")(pool);
const logout = require('./methods/logout')(pool);
const changeRole = require('./methods/changeUserRole')(pool);
const restrictLogin = require('./methods/restrictLogin')(pool);
const checkToken = require('./methods/sessionExpire');

const cors = require("cors");
const PORT = 3000;

const app = http.createServer(async (req, res) => {
 
  cors()(req, res, () => {});
  
  if (req.url === "/logout") {
    if(req.method === "DELETE"){
      logout(req, res);
    }
  }

  else if (req.url === "/submit") {
    if(req.method === 'POST'){
      signupReq(req, res);
      return;
    }
  } 

  else if (req.url === "/login") {
    if( req.method === "POST"){
      loginReq(req, res);
      return;
    }
  } 

  else if (req.url === '/about') {
    if(req.method === 'POST'){
      postAboutData(req, res);
    }
    if(req.method === 'GET'){
      getAboutReq(req, res);
    }
    if(req.method === 'PUT'){
      editAboutData(req, res);
    }
  }

  else if (req.url.startsWith('/education')) {
    if (req.method === 'POST') {
        educationReq(req, res);
    }
     if (req.method === 'GET') {
        getEducation(req, res);
    } 
    if (req.method === 'DELETE') {
        const educationId = req.url.split('/').pop();
        deleteEducation(req, res, educationId);
    }
    if (req.method === 'PUT') {
        const educationId = req.url.split('/').pop();
        editEducation(req, res, educationId);
    }
  }
 
  else if (req.url.startsWith('/experience')){
    if(req.method === 'POST'){
      postExperience(req, res);
    }
    if(req.method === 'GET'){
      getExperience(req, res);
    }
    if(req.method === 'PUT'){
      const experienceId = req.url.split('/').pop();
      editExperience(req, res, experienceId);
    }
    if(req.method === 'DELETE'){
      const experienceId = req.url.split('/').pop();
      deleteExperience(req, res, experienceId);
    }
  }

  else if (req.url.startsWith('/projects')){
    if(req.method === 'POST'){
      postProjects(req, res);
    }
    if(req.method === 'GET'){
      getProjects(req, res);
    }
    if(req.method === 'PUT'){
      const projectId = req.url.split('/').pop();
      editProjects(req, res, projectId);
    }
    if(req.method === 'DELETE'){
      const projectId = req.url.split('/').pop();
      deleteProjects(req, res, projectId);
    }
  }
  
  else if (req.url === '/socialLinks') {
    if(req.method === 'POST'){
      postSocialLinks(req, res);
    }
    if(req.method === 'GET'){
      getSocialLinks(req, res);
    }
    if(req.method === 'PUT'){
      editSocialLinks(req, res);
    }
  }

    else if (req.url.startsWith('/adminUsers')){
    if(req.method === 'GET'){
      const searchInput = req.url.split('/').pop();
      getUsers(req, res, searchInput);
      return;
    }
    if(req.method === 'PUT'){
      const UserID = req.url.split('/').pop();
      editUser(req, res, UserID);
    }
    if(req.method === 'DELETE'){
      const UserID = req.url.split('/').pop();
      deleteUser(req, res, UserID);
    }
  }

  else if (req.url.startsWith('/adminProjects')) {
    if (req.method === "GET") {
      const searchInput = req.url.split('/').pop();
      getProjectsForAdmin(req, res, searchInput);
    }
  }

  else if (req.url.startsWith('/changeUserRoleToAdmin')){
    if(req.method === 'POST'){
      const UserID = req.url.split('/').pop();
      changeRole(req, res, UserID);
    }
  }

  else if (req.url === '/restrictedUrl') {
    if(req.method === "GET"){
      restrictLogin(req, res);
    }
  } 

  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ statusCode: '404', title: "Not Found!", message: "Route not Found" }));
  }

  
});

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
