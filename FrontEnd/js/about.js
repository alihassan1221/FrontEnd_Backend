let personalDetailBtn = document.getElementById('personalDetailBtn');
let aboutForm = document.getElementById('aboutForm');
let editPersonalDetailBtn = document.getElementById('editPersonalDetailBtn');
let aboutCloseBtn = document.getElementById('aboutCloseBtn');
let saveAbout = document.getElementById('saveAbout');

let userProfile;
let isEditing = false;


personalDetailBtn.addEventListener('click', () => {
  isEditing = false;
  aboutForm.classList.add('active');
});

aboutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let aboutPosition = document.getElementById('aboutPosition').value;
  let aboutSummary = document.getElementById('aboutSummary').value;
  let aboutAddress = document.getElementById('aboutAddress').value;
  let aboutCity = document.getElementById('aboutCity').value;

  let aboutData = {
    position: aboutPosition,
    summary: aboutSummary,
    address: aboutAddress,
    city: aboutCity,
    profile: userProfile || '../assets/images/avatar.png'
  };

  const token = localStorage.getItem('token');

  if (!token) {

    Swal.fire('Unauthorized', 'Token Not found', 'error');
    addEventListener('click', () => {
      window.location.href = '../index.html';
      console.error('JWT token is missing or expired');
    });
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token,
  };

  fetch('http://localhost:3000/about', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(aboutData)
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
    .catch((err) => {
      console.error('Fetch Error:', err);
    });
  aboutForm.classList.remove('active');
  personalDetailBtn.textContent = 'Edit Detail';
  Swal.fire('Good job!', 'Information Added Successfully!', 'success');
  displayAboutData();
});


function displayAboutData() {

  const token = localStorage.getItem('token');

  if (!token) {

    Swal.fire('Unauthorized', 'Token Not found', 'error');
    addEventListener('click', () => {
      window.location.href = '../index.html';
      console.error('JWT token is missing or expired');
    });
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token,
  };
  fetch('http://localhost:3000/about', {
    method: 'GET',
    headers: headers
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
      profileImage.innerHTML = `
      <img src="${data.aboutData.profile}" alt="Profile Image">
      `;
      aboutInformation.innerHTML = `
        <h3>${data.aboutData.position}</h3>
        <p>${data.aboutData.summary}</p>
        <p><strong>Address:</strong> ${data.aboutData.address}</p>
        <p><strong>City:</strong> ${data.aboutData.city}</p>
        <p><strong>Phone:</strong> ${data.user.phone}</p>
        <p><strong>Gmail:</strong> ${data.user.email}</p>
        <button class="btn btn-white">view resume</button>
      `;
      aboutForm.classList.remove('active');
      personalDetailBtn.textContent = 'Edit Detail';
    })
    .catch((err) => {
      console.error(err);
    })
}
displayAboutData();

function getProfileUrl(e) {
  let selectedFile = e.target.files[0];
  if (selectedFile && selectedFile.size < 1000000) {
    let fileReader = new FileReader();
    fileReader.onload = function () {
      userProfile = fileReader.result;
    };
    fileReader.readAsDataURL(selectedFile);
  } else {
    alert("File Size is Too Big. Upload a file with a size less than 1MB.");
  }
}

aboutCloseBtn.addEventListener('click', () => {
  aboutForm.classList.remove('active');
});

