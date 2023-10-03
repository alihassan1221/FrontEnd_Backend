let personalDetailBtn = document.getElementById('personalDetailBtn');
let aboutForm = document.getElementById('aboutForm');
let editPersonalDetailBtn = document.getElementById('editPersonalDetailBtn');
let aboutCloseBtn = document.getElementById('aboutCloseBtn');
let saveAbout = document.getElementById('saveAbout');
let aboutData = [];
let userProfile;

personalDetailBtn.addEventListener('click', () => {
  aboutForm.classList.add('active');
});

editPersonalDetailBtn.addEventListener('click', () => {
  const token = localStorage.getItem('token');

  if (!token) {
    Swal.fire('Unauthorized', 'Token Not found', 'error');
    window.location.href = '../index.html';
    return;
  }

  aboutForm.classList.add('active');

  for (let data of aboutData) {
    document.getElementById('aboutPosition').value = data.position;
    document.getElementById('aboutSummary').value = data.summary;
    document.getElementById('aboutAddress').value = data.address;
    document.getElementById('aboutCity').value = data.city;
  }

  let saveAbout = document.getElementById('saveAbout');
  saveAbout.addEventListener('click', (e) => {
    e.preventDefault();

    const updatedAboutData = {
      position: document.getElementById('aboutPosition').value,
      summary: document.getElementById('aboutSummary').value,
      address: document.getElementById('aboutAddress').value,
      city: document.getElementById('aboutCity').value,
      profile: userProfile || '../assets/images/avatar.png' 
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token,
    };

    fetch('http://localhost:3000/about', {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(updatedAboutData),
    })
      .then((response) => {
        if (response.status === 401) {
          Swal.fire('Session Expired', 'Please Login Again', 'error');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '../index.html';
          return;
        }
        if (response.status === 200) {
          Swal.fire('Updated', 'Updated About Data Successfully!', 'success');
          displayAboutData();
          aboutForm.reset();
          aboutForm.classList.remove('active');
        } 
        else {
          Swal.fire('Error', 'Failed to Update About Data', 'error');
          aboutForm.classList.remove('active');
          aboutForm.reset();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

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
      if (response.status == 400){
        Swal.fire('Already Present', 'About Data Already Present', 'error');
        aboutForm.reset();
        aboutForm.classList.remove('active');
        return;
      }
      aboutForm.classList.remove('active');
      Swal.fire('Good job!', 'Information Added Successfully!', 'success');
      aboutForm.reset();
      displayAboutData();
      // return response.json();
    })
    .catch((err) => {
      console.error('Fetch Error:', err);
    });
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

      aboutData.push(data.aboutData);
      const oldName = document.getElementById('oldName');
      const oldPosition = document.getElementById('oldPosition');
      const contactWrapper = document.getElementById('contactWrapper');

      oldName.textContent = data.name || 'Your Name Here';
      oldPosition.textContent = data.aboutData.position || 'Your Position Here';
      contactWrapper.innerHTML = `
          <h2>Contact</h2>
          <a href="https://wa.me/${data.phone}" target="_blank">
              <img src="../assets/icons/whatsapp.png" alt="Whatsapp Icon">
          </a>
          <a href="mailto:${data.email}" target="_blank">
              <img src="../assets/icons/gmail.png" alt="Gmail Icon">
          </a>
      `;

      profileImage.innerHTML = `
      <img src="${data.aboutData.profile}" alt="Profile Image">
      `;
      aboutInformation.innerHTML = `
        <h3>${data.aboutData.position}</h3>
        <p>${data.aboutData.summary}</p>
        <p><strong>Address:</strong> ${data.aboutData.address}</p>
        <p><strong>City:</strong> ${data.aboutData.city}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Gmail:</strong> ${data.email}</p>
        <a href="../cv/Ali Hassan (ASE).pdf" download="AliHassan(Web Development).pdf">
        <button class="btn btn-white">download resume</button>
        </a>
      `;
      aboutForm.classList.remove('active');
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
  aboutForm.reset();
  aboutForm.classList.remove('active');
});

