// -------------------------------- Projects --------------------------------------//

let popoverDetail = document.querySelector(".popover-detail");
let addProjectBtn = document.getElementById("addProject");
let projectsCloseBtn = document.getElementById("projectsCloseBtn");
let projectsContainer = document.getElementById("userProjects");
let projectsForm = document.getElementById("projectsForm");
let userProjects = document.getElementById("userProjects");
let projectImage = document.getElementById("projectImage");
let projects = [];
let imgUrl;

addProjectBtn.addEventListener("click", () => {
  projectsForm.classList.add("active");
});

projectsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let projectTitle = document.getElementById("projectTitle").value;
  let projectDetail = document.getElementById("projectDetail").value;
  let liveLink = document.getElementById("liveLink").value;
  let codeLink = document.getElementById("codeLink").value;
  let skills = document.getElementById("skills").value;

  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire("Unauthorized", "Token Not Found", "error");
    addEventListener("click", () => {
      window.location.href = '../index.html';
      console.error("JWT token is missing or expired");
    });
    return;
  }

  let project = {
    projectTitle: projectTitle,
    projectDetail: projectDetail,
    liveLink: liveLink,
    codeLink: codeLink,
    skills: skills,
    projectImage: imgUrl || "../assets/images/dummy.jpeg",
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: token,
  };

  fetch("http://localhost:3000/projects", {
    method: "POST",
    headers: headers,
    body: JSON.stringify(project),
  })
    .then((response) => {
      if (response.status === 401) {
        Swal.fire('Session Expire', 'Please Login Again', 'error');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        projectsForm.reset();
        projectsForm.classList.remove("active");
        addEventListener('click', () => {
          window.location.assign('../index.html');
        })
        return;
      }
      if (response.status === 200) {
        Swal.fire("Added!", "Project Added Successfully", "success");
        ProjectsList();
        projectsForm.reset();
        projectsForm.classList.remove("active");
      }
      return response.json();
    })
    .catch((err) => {
      console.error(err);
    });
});

function getImageUrl(e) {
  let selectedFile = e.target.files[0];
  if (selectedFile && selectedFile.size < 1000000) {
    let fileReader = new FileReader();
    fileReader.onload = function () {
      imgUrl = fileReader.result;
    };
    fileReader.readAsDataURL(selectedFile);
  } else {
    alert("File Size is Too Big. Upload a file with a size less than 1MB.");
  }
}

// Delete Project
function deleteProject(projectId) {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire("Unauthorized", "Token Not Found", "error");
    addEventListener("click", () => {
      window.location.href = '../index.html';
      console.error("JWT token is missing or expired");
    });
    return;
  }
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      const headers = {
        "Content-Type": "application/json",
        Authorization: token,
      };

      fetch(`http://localhost:3000/projects/${projectId}`, {
        method: "DELETE",
        headers: headers,
      })
        .then((response) => {
          if (response.status === 401) {
            Swal.fire('Session Expire', 'Please Login Again', 'error');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            addEventListener('click', () => {
              window.location.assign('../index.html');
            })
            return;
          }
          if (response.status === 200) {
            Swal.fire("Deleted!", "Project entry has been deleted.", "success");
            ProjectsList();
          } else {
            Swal.fire("Error", "Failed to delete Project entry.", "error");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
}

// Show Details in PopUp
function showPopup(project) {
  let popupImage = popoverDetail.querySelector("img");
  let popupTitle = popoverDetail.querySelector("h2");
  let popupDetail = popoverDetail.querySelector("p");
  popupImage.src = project.projectImageURL;
  popupImage.alt = "Project Image";
  popupTitle.textContent = project.projectTitle;
  popupDetail.textContent = project.projectDetail;
  popoverDetail.style.display = "block";
}

// Close Popup Detail
function closePopup() {
  popoverDetail.style.display = "none";
}



// Edit Function
function editProject(projectId) {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire("Unauthorized", "Token Not Found", "error");
    addEventListener("click", () => {
      window.location.href = '../index.html';
      console.error("JWT token is missing or expired");
    });
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: token,
  };

  projectsForm.classList.add("active");

  for(let project of projects){
    if(project.id === projectId){
      document.getElementById("projectTitle").value = project.projectTitle;
      document.getElementById("projectDetail").value = project.projectDetail;
      document.getElementById("liveLink").value = project.liveLink;
      document.getElementById("codeLink").value = project.codeLink;
      document.getElementById("skills").value = project.skills;
    }

}

  let saveBtn = document.getElementById("saveProjectBtn");
  saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let projectTitle = document.getElementById("projectTitle").value;
    let projectDetail = document.getElementById("projectDetail").value;
    let liveLink = document.getElementById("liveLink").value;
    let codeLink = document.getElementById("codeLink").value;
    let skills = document.getElementById("skills").value;

    let updatedProject = {
      projectTitle: projectTitle,
      projectDetail: projectDetail,
      liveLink: liveLink,
      codeLink: codeLink,
      skills: skills,
      projectImage: imgUrl || "../assets/images/dummy.jpeg",
    };

    fetch(`http://localhost:3000/projects/${projectId}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(updatedProject),
    })
      .then((response) => {
        if (response.status === 401) {
          Swal.fire('Session Expire', 'Please Login Again', 'error');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          projectsForm.reset();
          projectsForm.classList.remove("active");
          addEventListener('click', () => {
            window.location.assign('../index.html');
          })
          return;
        }
        if (response.status === 200) {
          Swal.fire("Updated!", "Project Update Successfully.", "success");
          projectsForm.reset();
          projectsForm.classList.remove("active");
          ProjectsList();
        } else {
          Swal.fire("Error", "Failed to Update Project Entry.", "error");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
}

// Displaying and Searching proejcts in FrontEnd
function ProjectsList(search = "") {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire("Unauthorized", "Token Not Found", "error");
    addEventListener("click", () => {
      window.location.href = '../index.html';
      console.error("JWT token is missing or expired");
    });
    return;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: token,
  };

  fetch("http://localhost:3000/projects", {
    method: "GET",
    headers: headers,
  })
    .then((response) => {
      if (response.status === 401) {
        Swal.fire('Session Expire', 'Please Login Again', 'error');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        addEventListener('click', () => {
          window.location.assign('../index.html');
        })
        return;
      }
      return response.json();
    })
    .then((data) => {

      projects.push(...data.projects);

      let projectsContainer = document.getElementById("userProjects");
      projectsContainer.innerHTML = "";
      userFound = false;
      data.projects.forEach((data, index) => {
        if (
          data.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
          data.skills.toLowerCase().includes(search.toLowerCase()) ||
          data.projectDetail.toLowerCase().includes(search.toLowerCase())
        ) {
          userFound = true;
          let projectElement = document.createElement("div");
          projectElement.classList.add("project");

          let detailDiv = document.createElement("div");
          detailDiv.classList.add("detail");

          let titleElement = document.createElement("h3");
          titleElement.textContent = data.projectTitle;

          let descriptionElement = document.createElement("p");
          descriptionElement.textContent = data.projectDetail;

          let skillsElement = document.createElement("p");
          skillsElement.innerHTML = `<span>Skills: </span>${data.skills}`;

          let seeLiveButton = document.createElement("button");
          seeLiveButton.classList.add("btn", "gradient-color");
          seeLiveButton.innerHTML = `<a href="${data.liveLink}" target="_blank" title="See Live">See Live</a>`;

          let sourceCodeButton = document.createElement("button");
          sourceCodeButton.classList.add("btn", "gradient-color");
          sourceCodeButton.innerHTML = `<a href="${data.codeLink}" target="_blank" title="Source Code">Source Code</a>`;

          let imageElement = document.createElement("div");
          imageElement.classList.add("project-image");
          let img = document.createElement("img");
          img.src = data.projectImageURL;
          img.alt = "Project Image";
          imageElement.appendChild(img);

          let popupBtn = document.createElement("button");
          popupBtn.classList.add("btn", "gradient-color");
          popupBtn.innerHTML = `<a title="View">View</a>`;

          popupBtn.addEventListener("click", () => {
            showPopup(data);
          });

          let editButton = document.createElement("button");
          editButton.classList.add("btn", "gradient-color");
          editButton.textContent = "Edit";
          editButton.addEventListener("click", () => {
            editProject(data.id);
          });

          let deleteBtn = document.createElement("button");
          deleteBtn.classList.add("btn", "gradient-color");
          deleteBtn.innerHTML = `<a title="Delete">Delete</a>`;

          deleteBtn.addEventListener("click", () => {
            deleteProject(data.id);
          });

          detailDiv.appendChild(titleElement);
          detailDiv.appendChild(descriptionElement);
          detailDiv.appendChild(skillsElement);
          detailDiv.appendChild(seeLiveButton);
          detailDiv.appendChild(sourceCodeButton);
          detailDiv.appendChild(popupBtn);
          detailDiv.appendChild(editButton);
          detailDiv.appendChild(deleteBtn);

          projectElement.appendChild(detailDiv);
          projectElement.appendChild(imageElement);
          projectsContainer.appendChild(projectElement);
        }
      });
      if (!userFound) {
        let text = document.createElement("p");
        text.textContent = "Project Not Found!";

        projectsContainer.appendChild(text);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

let searchInput = document.getElementById("searchProjects");
searchInput.addEventListener("input", () => {
  ProjectsList(searchInput.value);
});

let popupCloseButton = popoverDetail.querySelector(".closePopup");
popupCloseButton.addEventListener("click", closePopup);

ProjectsList();

projectsCloseBtn.addEventListener("click", () => {
  projectsForm.classList.remove("active");
});
