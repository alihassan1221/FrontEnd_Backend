let popoverDetail = document.querySelector(".popover-detail");
let projectsCloseBtn = document.getElementById('projectsCloseBtn');
let projectsContainer = document.getElementById("userProjects");
let projectsForm = document.getElementById("projectsForm");
let userProjects = document.getElementById("userProjects");


// Show Details in PopUp
function showPopup(project, index) {
  let popupImage = popoverDetail.querySelector("img");
  let popupTitle = popoverDetail.querySelector("h2");
  let popupDetail = popoverDetail.querySelector("p");
  popupImage.src = project.projectImage;
  popupImage.alt = "Project Image";
  popupTitle.textContent = project.projectTitle;
  popupDetail.textContent = project.projectDetail;
  popoverDetail.style.display = "block";
}

// Close Popup Detail
function closePopup() {
  popoverDetail.style.display = "none";
}

function ProjectsList(search = "") {

  const token = localStorage.getItem('token');

  if (!token) {

      Swal.fire('Unauthorized', 'Token Not Found', 'error');
      addEventListener('click', () => {
          window.location.href = '../index.html';
          console.error('JWT token is missing or expired');
      });
      return;
  }

  fetch('http://localhost:3000/adminProjects', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    }
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
      projectsContainer.innerHTML = "";
      let projectFound;
      data.projects.forEach((data, index) => {
        if (
          data.skills.toLowerCase().includes(search.toLowerCase()) ||
          data.projectTitle.toLowerCase().includes(search.toLowerCase())
        ) {
          projectFound = true;
          
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

          popupBtn.addEventListener('click', () => {
            showPopup(data);
          });
          detailDiv.appendChild(titleElement);
          detailDiv.appendChild(descriptionElement);
          detailDiv.appendChild(skillsElement);
          detailDiv.appendChild(seeLiveButton);
          detailDiv.appendChild(sourceCodeButton);
          detailDiv.appendChild(popupBtn);

          projectElement.appendChild(detailDiv);
          projectElement.appendChild(imageElement);
          projectsContainer.appendChild(projectElement);
        }
      });
      if (!projectFound) {
        let text = document.createElement('p');
        text.textContent = 'Project Not Found!';
        projectsContainer.appendChild(text);
      }
    })
    .catch((err) => {
      console.error(err);
    })

}

ProjectsList();

let searchInput = document.getElementById("searchProjects");
searchInput.addEventListener('input', () => {
  ProjectsList(searchInput.value);
});

let popupCloseButton = popoverDetail.querySelector(".closePopup");
popupCloseButton.addEventListener("click", closePopup);


projectsCloseBtn.addEventListener('click', () => {
  projectsForm.classList.remove('active');
});


