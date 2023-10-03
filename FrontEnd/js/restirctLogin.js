function restrictLogin() {
  const token = localStorage.getItem('token');
  if (token) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token,
    };

    fetch('http://localhost:3000/restrictedUrl', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          if (data.Role === 'admin') {
            if (window.location.pathname === '/html/user.html' || window.location.pathname === '/index.html') {
              window.location.href = '../html/adminDashboard';
            }
          } 

          else {
            if (window.location.pathname === '/html/adminDashboard.html' || window.location.pathname === '/index.html') {
              window.location.href = '../html/user.html';
            }
          }
        }
      })
      .catch((err) => {
        console.error('Fetch Error:', err);
      });
  }
}
restrictLogin();
