let signupFormBtn = document.querySelectorAll(".border-right");
let signupPage = document.querySelector(".container"); 
let loginPage = document.querySelector(".wrapper");
let loginFormBtn = document.querySelectorAll(".border-left");
let loginForm = document.getElementById('loginForm');
let signupForm = document.getElementById('signupForm');
let userData = null;


for(let show of signupFormBtn){
    show.addEventListener('click', () => {
        signupPage.classList.add('active');
        loginPage.classList.add('hide');
    });
}

for(let hide of loginFormBtn){
    hide.addEventListener('click', () => {
        signupPage.classList.remove('active');
        loginPage.classList.remove('hide');
    });
}

// Signup
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let fname = document.getElementById('fname').value;
    let lname = document.getElementById('lname').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let password = document.getElementById('password').value;
    let cpassword = document.getElementById('cpassword').value;
    let namePattern = /^[a-zA-Z\s]*$/;

    if (!namePattern.test(fname) || !namePattern.test(lname)) {
        Swal.fire('Do not use Numbers and Symbols in First and Last Name');
        return;
    }

    if (password.length < 8) {
        Swal.fire('Password should be at least 8 characters long.');
        return;
    }

    if (password !== cpassword) {
        Swal.fire('Different Passwords', 'Passwords Does Not Match', 'error');
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

    fetch('http://localhost:3000/submit', {
        method: "POST",
        headers: {
            "Content-Type": "application/json", 
        },
        body: JSON.stringify(user)
    })
    .then(res => {
        return res.json();
    })
    .then(data => {
        if(data.statusCode === 400) {
            Swal.fire('Email Exists', 'Registeration Failed Email Already exists!', 'error');
        } 
        else if(data.statusCode === 200) {
            signupForm.reset();
            Swal.fire('Good job!', 'Registration Successful!', 'success');
            signupPage.classList.remove('active');
            loginPage.classList.remove('hide');
        }
    })
    .catch(err => {
        console.log(err);
    });
});

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}



loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;

    let user = {
        email: email,
        password: password,
    };

    fetch('http://localhost:3000/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json" 
        },
        body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(data => {
        if(data.statusCode === 400) {
            loginForm.reset();
            Swal.fire('Bad Request', 'User not found', 'error');
        } 
        else if(data.statusCode === 404){
            Swal.fire('Not Found', 'Route not Found', 'error');
            return;
        }
        else if(data.statusCode === 401) {
            loginForm.reset();
            Swal.fire('Incorrect Information', 'Incorrect Password / Email', 'error');
        } else if(data.statusCode === 200) {
            const token = data.token;

            if(data.Role === 'admin'){
                localStorage.setItem('token', token); 
                Swal.fire('Good job!', 'Admin Login Successful!', 'success');
                addEventListener('click', (e)=>{
                    e.preventDefault();
                    window.location.href = '../html/adminDashboard.html';
                });
                return;
            }

            else {
                localStorage.setItem('token', token);            
                Swal.fire('Good job!', 'User Login Successful!', 'success');
                localStorage.setItem('token', data.token);
                addEventListener('click', ()=> {
                    window.location.href = '../html/user.html';
                    loginForm.reset();
                });
            }           
        }
    })
    .catch(err => {
        console.log(err);
    });
});