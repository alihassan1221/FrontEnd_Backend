
const logoutBtn = document.getElementById('logoutBtn');
const oldName = document.getElementById('oldName');
const oldPosition = document.getElementById('oldPosition');
const contactWrapper = document.getElementById('contactWrapper');

const user = JSON.parse(localStorage.getItem('user'));

logoutBtn.addEventListener('click', () => {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Logout!",
    }).then((result) => {
        if (result.isConfirmed) {
            const token = localStorage.getItem('token');

            if (!token) {
                Swal.fire('Not Found', 'Token Not Found', 'error');
                return; // No need for addEventListener here
            }

            fetch('http://localhost:3000/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            })
            .then((response) => {
                if (response.status === 200) {
                    localStorage.clear();
                    window.location.href = '../index.html';
                }
                return response.json();
            })
            .catch((err) => {
                console.error(err);
            });
        }
    });
});

// Display user data
oldName.textContent = user.name || 'Your Name Here';
oldPosition.textContent = user.position || 'Your Position Here';
contactWrapper.innerHTML = `
    <h2>Contact</h2>
    <a href="https://wa.me/${user.phone}" target="_blank">
        <img src="../assets/icons/whatsapp.png" alt="Whatsapp Icon">
    </a>
    <a href="mailto:${user.email}" target="_blank">
        <img src="../assets/icons/gmail.png" alt="Gmail Icon">
    </a>
`;
