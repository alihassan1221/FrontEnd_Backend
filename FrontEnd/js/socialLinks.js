let socialLinkForm = document.querySelector('.socialLinkForm');
let socialForm = document.getElementById('socialForm');
let socialIcons = document.getElementById('social-icons');
let addSocailLinkBtn = document.getElementById('addSocailLinkBtn');
let socialCloseBtn = document.getElementById('socialCloseBtn');



addSocailLinkBtn.addEventListener('click', () => {
  socialLinkForm.classList.add('active');
});

socialForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let twitterLink = document.getElementById('twitterLink').value;
  let githubLink = document.getElementById('githubLink').value;
  let linkedinLink = document.getElementById('linkedinLink').value;

  let socialMediaLinks = {
    twitterLink: twitterLink,
    githubLink: githubLink,
    linkedinLink: linkedinLink
  };

  const token = localStorage.getItem('token');

  if (!token) {

    Swal.fire('Unauthorized', 'Token Not Found', 'error');
    addEventListener('click', () => {
      window.location.href = '../index.html';
      console.error('JWT token is missing or expired');
    });
    return;
  }

  // Include the JWT token in the request headers
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token, // Include the token in the headers
  };

  fetch('http://localhost:3000/socialLinks', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(socialMediaLinks)
  })
    .then((response) => {
        if (response.status === 401) {
          Swal.fire('Session Expire', 'Please Login Again', 'error');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          socialLinkForm.classList.remove('active');
          addEventListener('click', () => {
            window.location.assign('../index.html');
          })
          return;
        }
        if(response.status === 200){
            Swal.fire('Good job!', 'Information Added/Updated Successfully!', 'success');
            socialLinkForm.classList.remove('active');
            attachSocialLinks();
        }
        return response.json();
    })
    .catch((err) => {
      console.error(err);
    });
});

function attachSocialLinks() {
const token = localStorage.getItem('token');

  if (!token) {

    Swal.fire('Unauthorized', 'Token Not Found', 'error');
    addEventListener('click', () => {
      window.location.href = '../index.html';
      console.error('JWT token is missing or expired');
    });
    return;
  }

  // Include the JWT token in the request headers
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token, // Include the token in the headers
  };

  fetch('http://localhost:3000/socialLinks', {
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
    .then((data)=>{
        addSocailLinkBtn.textContent = 'Edit Links';
        let twitter = document.getElementById('twitter');
        let linkedin = document.getElementById('linkedin');
        let github = document.getElementById('github');

        twitter.href = data.socialLinks.twitterLink;
        linkedin.href = data.socialLinks.linkedinLink;
        github.href = data.socialLinks.githubLink;
    })
    .catch((err) => {
      console.error(err);
    });
}

attachSocialLinks();

socialCloseBtn.addEventListener('click', () => {
  socialLinkForm.classList.remove('active');
});