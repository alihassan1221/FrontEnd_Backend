CREATE DATABASE IF NOT EXISTS usersdata;

Use usersdata;

SELECT * FROM users;
SELECT * FROM aboutData;
SELECT * FROM educations;
SELECT * FROM experience;
SELECT * FROM projects;
SELECT * FROM usersTokens;
SELECT * FROM social_media_links;

DROP TABLE usersTokens;

CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Phone VARCHAR(20),
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
);


CREATE TABLE IF NOT EXISTS aboutData (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  position VARCHAR(255) NOT NULL,
  summary TEXT,
  address VARCHAR(255),
  city VARCHAR(255),
  profile LONGTEXT,
  FOREIGN KEY (userId) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS educations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  institute VARCHAR(255),
  degree VARCHAR(255),
  major VARCHAR(255),
  grades VARCHAR(10),
  startingDate Date,
  endingDate Date,
  FOREIGN KEY (userId) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  projectTitle VARCHAR(255),
  projectDetail LONGTEXT,
  liveLink VARCHAR(255),
  codeLink VARCHAR(255),
  skills VARCHAR(255),
  projectImageURL LONGTEXT,
  FOREIGN KEY (userId) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS experience (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  employmentType VARCHAR(50),
  location VARCHAR(255),
  jobType VARCHAR(50),
  startingDate DATE,
  endingDate DATE,
  FOREIGN KEY (userId) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS social_media_links (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  twitterLink VARCHAR(255),
  githubLink VARCHAR(255),
  linkedinLink VARCHAR(255),
  FOREIGN KEY (userId) REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS usersTokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT,
    token TEXT,
    FOREIGN KEY (userId) REFERENCES Users(UserID) ON DELETE CASCADE
);


