const http = require("http");
const signupReq = require('./methods/signup-request');
const loginReq = require('./methods/login-request');
const aboutReq = require('./methods/about-request');
const getAboutReq = require('./methods/getAboutReq');
const educationReq = require('./methods/education-request');
const getEducation = require('./methods/getEducation');
const deleteEducation = require('./methods/deleteEducation');
const editEducation = require('./methods/editEducation');
const postExperience = require('./methods/postExperience');
const getExperience = require('./methods/getExperience');
const deleteExperience = require('./methods/deleteExperience');
const editExperience = require('./methods/editExperience');
const postProjects = require('./methods/postProjects');
const getProjects = require('./methods/getProjects');
const deleteProjects = require('./methods/deleteProjects');
const editProjects = require('./methods/editProjects');
const postSocialLinks = require('./methods/postSocialLinks');
const getSocialLinks = require('./methods/getSocialLinks');
const getUsers = require('./methods/getUsers');
const editUser = require('./methods/editUser');
const getProjectsForAdmin = require("./methods/getProjectsForAdmin");
const logout = require('./methods/logout');
const getReq = require('./methods/get-request');
const deleteUser = require('./methods/deleteUser');
const restrictLogin = require('./methods/restrictLogin');

const cors = require("cors");
let data;

// Try to load the JSON data from the file
try {
  data = require("./data/users.json");
} catch (err) {
  console.error("Error loading data from users.json:", err);
  data = { users: [] };
}

const PORT = 3000;

const app = http.createServer((req, res) => {
  req.data = data;

  cors()(req, res, () => {});

  if (req.url === "/logout" && req.method === "POST") {
    logout(req, res);
  }
  else if (req.url === "/submit" && req.method === "POST") {
    signupReq(req, res);
  } 
  else if (req.url === "/login" && req.method === "POST") {
    loginReq(req, res);
  } 
  else if (req.url === '/restrictedUrl' && req.method === "GET") {
    restrictLogin(req, res);
  } 
  else if (req.url === '/about' && req.method === 'POST'){
    aboutReq(req, res);
  }
  else if (req.url === '/about' && req.method === 'GET'){
    getAboutReq(req, res);
  }
  else if (req.url === '/education' && req.method === 'POST'){
    educationReq(req, res);
  }
  else if (req.url === '/education' && req.method === 'GET'){
    getEducation(req, res);
  }
  else if (req.url.startsWith('/deleteEducation/') && req.method === 'DELETE'){
    const index = req.url.split('/').pop();
    deleteEducation(req, res, index);
  }
  else if (req.url.startsWith('/editEducation/') && req.method === 'PUT'){
    const index = req.url.split('/').pop();
    editEducation(req, res, index);
  }
  else if (req.url === '/experience' && req.method === 'POST'){
    postExperience(req, res);
  }
  else if (req.url === '/experience' && req.method === 'GET'){
    getExperience(req, res);
  }
  else if (req.url.startsWith('/deleteExperience/') && req.method === 'DELETE'){
    const index = req.url.split('/').pop();
    deleteExperience(req, res, index);
  }
  else if (req.url.startsWith('/editExperience/') && req.method === 'PUT'){
    const index = req.url.split('/').pop();
    editExperience(req, res, index);
  }
  else if (req.url === '/projects' && req.method === 'POST'){
    postProjects(req, res);
  }
  else if (req.url === '/projects' && req.method === 'GET'){
    getProjects(req, res);
  }
  else if (req.url.startsWith('/deleteProjects/') && req.method === 'DELETE'){
    const index = req.url.split('/').pop();
    deleteProjects(req, res, index);
  }
  else if (req.url.startsWith('/editProjects/') && req.method === 'PUT'){
    const index = req.url.split('/').pop();
    editProjects(req, res, index);
  }
  else if (req.url === '/socialLinks' && req.method === "POST") {
    postSocialLinks(req, res);
  }
  else if (req.url === '/socialLinks' && req.method === "GET") {
    getSocialLinks(req, res);
  } 
  else if (req.url === '/getUsers' && req.method === "GET") {
    getUsers(req, res);
  } 
  else if (req.url.startsWith('/deleteUser/') && req.method === 'DELETE'){
    const index = req.url.split('/').pop();
    deleteUser(req, res, index);
  }
  else if (req.url.startsWith('/editUser/') && req.method === 'PUT'){
    const index = req.url.split('/').pop();
    editUser(req, res, index);
  }
  else if (req.url === '/adminProjects' && req.method === "GET") {
    getProjectsForAdmin(req, res);
  } 
  else if (req.url.startsWith('/api/users') && req.method === "GET") {
    getReq(req, res);
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port: ${PORT}`);
});
