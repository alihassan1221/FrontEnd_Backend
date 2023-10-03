let table = document.querySelector('#tbl tbody');
let searchUser = document.getElementById('searchUsers');
let signupForm = document.querySelector('#signupForm');
let adduserBtn = document.getElementById('adduserBtn');
let container = document.querySelector('.container');
let users = [];

adduserBtn.addEventListener('click', () => {
    container.classList.add('active');
})

closeBtn.addEventListener('click', () => {
    container.classList.remove('active');
})

function displayUsers(search = "") {

    const token = localStorage.getItem('token');
    if (!token) {

        Swal.fire('Unauthorized', 'Token Not Found', 'error');
        addEventListener('click', () => {
            window.location.href = '../index.html';
            console.error('JWT token is missing or expired');
        });
        return;
    }

    fetch('http://localhost:3000/adminUsers', {
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
            users.push(...data.users);
            table.innerHTML = '';
            let userFound = false;
            let id = 1;
            data.users.forEach((data, index) => {

                    if (data.FirstName.toLowerCase().includes(search.toLowerCase()) || data.Email.toLowerCase().includes(search.toLowerCase())) {
                        userFound = true;
                        let profileImageUrl = data.aboutData && data.aboutData.profile ? data.aboutData.profile : "../assets/Images/avatar.png";
                        table.innerHTML += `
                    <tr>
                        <td>${id}</td>
                        <td><img src="${profileImageUrl}"></td>
                        <td>${data.FirstName}</td>
                        <td>${data.LastName}</td>
                        <td>${data.Phone}</td>
                        <td>${data.Email}</td>
                        <td>
                            <button class=""btn onclick="changeUserRoleToAdmin(${data.UserID})">To Admin</button>
                            <svg id="editBtn" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path onclick="editUser(${data.UserID})" d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg> 
                            <svg class="deleteBtn" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path onclick="deleteUser(${data.UserID})" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                        </td>
                    </tr>
                    `;
                    }
                    id++;
            });
            if (!userFound) {
                table.innerHTML = `
                <tr>
                    <td colspan = '7'>User Not Found</td>
                </tr>
                `;
            }
        })
        .catch((err) => {
            console.error(err);
        })
    searchUser.addEventListener('change', () => {
        displayUsers(searchUser.value);
    });
}
displayUsers();


// Delete User

function deleteUser(UserID) {

    const token = localStorage.getItem('token');

    if (!token) {

        Swal.fire('Unauthorized', 'Token Not Found', 'error');
        addEventListener('click', () => {
            window.location.href = '../index.html';
            console.error('JWT token is missing or expired');
        });
        return;
    }

    Swal.fire({
        title: 'Are you sure?',
        text: 'You are about to delete this user.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': token,
            };

            fetch(`http://localhost:3000/adminUsers/${UserID}`, {
                method: 'DELETE',
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
                        Swal.fire('Deleted!', 'User has been deleted.', 'success');
                        displayUsers();
                    } else {
                        Swal.fire('Error', 'Failed to delete user.', 'error');
                        return response.json();
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    });
}


// SignUp Form



signupForm.addEventListener('submit', (e) => {
    const token = localStorage.getItem('token');

    if (!token) {

        Swal.fire('Unauthorized', 'Token Not Found', 'error');
        addEventListener('click', () => {
            window.location.href = '../index.html';
            console.error('JWT token is missing or expired');
        });
        return;
    }

    e.preventDefault();
    let fname = document.getElementById('fname').value;
    let lname = document.getElementById('lname').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let password = document.getElementById('password').value;
    let namePattern = /^[a-zA-Z\s]*$/;

    if (!namePattern.test(fname) || !namePattern.test(lname)) {
        Swal.fire('Do not use Numbers and Symbols in First and Last Name');
        return;
    }

    if (password.length < 8) {
        Swal.fire('Password should be at least 8 characters long.');
        return;
    }

    fname = capitalize(fname);
    lname = capitalize(lname);

    let user = {
        fname: fname,
        lname: lname,
        email: email,
        phone: phone,
        password: password,
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token
    }

    fetch('http://localhost:3000/submit', {
        method: "POST",
        headers: headers,
        body: JSON.stringify(user)
    })
        .then((response) => {
            if (response.status === 401) {
                Swal.fire('Session Expire', 'Please Login Again', 'error');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                signupForm.reset();
                container.classList.remove('active');
                addEventListener('click', () => {
                    window.location.assign('../index.html');
                })
                return;
            }
            return response.json();
        })
        .then(data => {
            if (data.statusCode === 400) {
                Swal.fire('Already Exists', 'Registration Not Successful!', 'error');
            }
            else if (data.statusCode === 200) {
                signupForm.reset();
                Swal.fire('Good job!', 'Registration Successful!', 'success');
                container.classList.remove('active');
                displayUsers();
            }
        })
        .catch(err => {
            console.log(err);
        });
});

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


function editUser(UserID) {
    let submitBtn = document.querySelector('.submitBtn');
    const token = localStorage.getItem('token');

    if (!token) {

        Swal.fire('Unauthorized', 'Token Not Found', 'error');
        addEventListener('click', () => {
            window.location.href = '../index.html';
            console.error('JWT token is missing or expired');
        });
        return;
    }

    for (let user of users) {
        if (user.UserID === UserID) {
            document.getElementById('fname').value = user.FirstName;
            document.getElementById('lname').value = user.LastName;
            document.getElementById('email').value = user.Email;
            document.getElementById('phone').value = user.Phone;
        }
    }
    container.classList.add('active');

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let fname = document.getElementById('fname').value;
        let lname = document.getElementById('lname').value;
        let email = document.getElementById('email').value;
        let phone = document.getElementById('phone').value;
        let password = document.getElementById('password').value;
        let namePattern = /^[a-zA-Z\s]*$/;

        if (!namePattern.test(fname) || !namePattern.test(lname)) {
            Swal.fire('Do not use Numbers and Symbols in First and Last Name');
            return;
        }

        if (fname === '' || lname === '' || email === '' || phone === '') {
            Swal.fire('All Fields are Required');
            return;
        }

        if (password.length < 8) {
            Swal.fire('Password should be at least 8 characters long.');
            return;
        }

        fname = capitalize(fname);
        lname = capitalize(lname);

        let updatedUser = {
            fname: fname,
            lname: lname,
            email: email,
            phone: phone,
            password: password,
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
        }

        fetch(`http://localhost:3000/adminUsers/${UserID}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(updatedUser)
        })
            .then((response) => {
                if (response.status === 401) {
                    Swal.fire('Session Expire', 'Please Login Again', 'error');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    signupForm.reset();
                    container.classList.remove('active');
                    addEventListener('click', () => {
                        window.location.assign('../index.html');
                    })
                    return;
                }
                if (response.status === 200) {
                    Swal.fire('Updated!', 'User Update Successfully.', 'success');
                    signupForm.reset();
                    container.classList.remove('active');
                    displayUsers();
                } else {
                    Swal.fire('Error', 'Failed to Update User entry.', 'error');
                }
            })
            .catch((err) => {
                console.error(err);
            })
    });

}


function changeUserRoleToAdmin(userID) {

    const token = localStorage.getItem('token');
    if (!token) {
        Swal.fire('Unauthorized', 'Token Not Found', 'error');
        return;
    }

    fetch(`http://localhost:3000/changeUserRoleToAdmin/${userID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    })
    .then((response) => {
        if (response.status === 200) {
            Swal.fire('Changed!', 'User Changed to Admin.', 'success');
            displayUsers();
            return;
        }
        if (response.status === 400) {
            Swal.fire('Already Done!', 'Already Changed to Admin', 'error');
            displayUsers();
            return;
        }  
        else {
            Swal.fire('Error', "Failed to change the user's role", 'error');
            return;
        }
    })
    .catch((err) => {
        console.error(err);
    });
}