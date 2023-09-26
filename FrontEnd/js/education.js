let educationCloseBtn = document.getElementById('educationCloseBtn');
let educationCards = document.querySelector('.educationCards')
let addEducationBtn = document.getElementById('addEducationBtn');
let educationForm = document.getElementById('educationForm');
let submitEducation = document.getElementById('submitEducation');


addEducationBtn.addEventListener('click', () => {
    educationForm.classList.add('active');
});

educationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let institute = document.getElementById('institute').value;
    let degree = document.getElementById('degree').value;
    let major = document.getElementById('major').value;
    let grades = document.getElementById('grades').value;
    let startingDate = document.getElementById('startingDate').value;
    let endingDate = document.getElementById('endingDate').value;

    if (new Date(startingDate) >= new Date(endingDate)) {
        Swal.fire('Error', 'Starting date must be lower than ending date.', 'error');
        return;
    }

    let education = {
        institute: institute,
        degree: degree,
        major: major,
        grades: grades,
        startingDate: startingDate,
        endingDate: endingDate
    }

    const token = localStorage.getItem('token');

    if (!token) {
        Swal.fire('Unauthorized', 'Token Not Found', 'error');
        addEventListener('click', () => {
            window.location.href = '../index.html';
        });
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token,
    };

    fetch('http://localhost:3000/education', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(education)
    })
        .then((response) => {
            if (response.status === 401) {
                educationForm.classList.remove('active');
                educationForm.reset();
                Swal.fire('Session Expire','Please Login Again', 'error');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                addEventListener('click', () => {
                    window.location.assign('../index.html');
                })
            }
            if (response.status === 200) {
                Swal.fire('Added!', 'Information Added Successfully', 'success');
                educationForm.reset();
                educationForm.classList.remove('active');
                displayeducation();
            }
            return response.json();
        })
        .catch((err) => {
            console.error(err);
        })
});


function deletingEducation(index) {
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
        text: 'You are about to delete this education entry.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            const token = localStorage.getItem('token')
            const headers = {
                'Content-Type': 'application/json',
                Authorization: token,
            };

            fetch(`http://localhost:3000/deleteEducation/${index}`, {
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
                    if (response.status === 204) {
                        Swal.fire('Deleted!', 'Education entry has been deleted.', 'success');
                        displayeducation();
                        return;
                    }
                    Swal.fire('Error', 'Failed to delete education entry.', 'error');
                    return response.json();
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    });
}

function editEducation(index) {
    const token = localStorage.getItem('token');
    if (!token) {

        Swal.fire('Unauthorized', 'Token Not Found', 'error');
        addEventListener('click', () => {
            window.location.href = '../index.html';
            console.error('JWT token is missing or expired');
        });
        return;
    }

    educationForm.classList.add('active');
    submitEducation.addEventListener('click', (e) => {
        e.preventDefault();
        let institute = document.getElementById('institute').value;
        let degree = document.getElementById('degree').value;
        let major = document.getElementById('major').value;
        let grades = document.getElementById('grades').value;
        let startingDate = document.getElementById('startingDate').value;
        let endingDate = document.getElementById('endingDate').value;

        if (new Date(startingDate) >= new Date(endingDate)) {
            Swal.fire('Error', 'Starting date must be lower than ending date.', 'error');
            return;
        }

        let education = {
            institute: institute,
            degree: degree,
            major: major,
            grades: grades,
            startingDate: startingDate,
            endingDate: endingDate
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token,
        };

        fetch(`http://localhost:3000/editEducation/${index}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(education)
        })
            .then((response) => {

                if (response.status === 401) {
                    Swal.fire('Session Expire', 'Please Login Again', 'error');
                    educationForm.classList.remove('active');
                    educationForm.reset();
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    addEventListener('click', () => {
                        window.location.assign('../index.html');
                    })
                    return;
                }
                if (response.status === 200) {
                    Swal.fire('Updated!', 'Education Update Successfully.', 'success');
                    educationForm.reset();
                    educationForm.classList.remove('active');
                    displayeducation();
                }
                else {
                    Swal.fire('Error', 'Failed to Update Eucation entry.', 'error');
                    return response.json();
                }
            })
            .catch((err) => {
                console.error(err);
            })


    });




}


function displayeducation(search = '') {
    const token = localStorage.getItem('token');

    if (!token) {

        Swal.fire('Unauthorized', 'Token Not Found', 'error');
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

    fetch('http://localhost:3000/education', {
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
            }
            return response.json();
        })
        .then((data) => {

            let tbody = document.querySelector('.educationBody');

            let educationFound = false;
            tbody.innerHTML = '';


            data.education.forEach((educationItem, index) => {
                if (educationItem.institute.toLowerCase().includes(search.toLowerCase()) ||
                    educationItem.degree.toLowerCase().includes(search.toLocaleLowerCase()) ||
                    educationItem.major.toLowerCase().includes(search.toLocaleLowerCase())
                ) {
                    educationFound = true;
                    tbody.innerHTML += `
                <tr>
                    <td>${educationItem.institute}</td>
                    <td>${educationItem.degree}</td>
                    <td>${educationItem.major}</td>
                    <td>${educationItem.grades}</td>
                    <td>${educationItem.startingDate}</td>
                    <td>${educationItem.endingDate}</td>
                    <td>
                      <svg id="editEducationBtn" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path onclick="editEducation(${index})" d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg> 
                      <svg class="deleteEducationBtn"  xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path onclick="deletingEducation(${index})"  d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                    </td>
                </tr>
                `;
                }
            });
            if (!educationFound) {
                tbody.innerHTML += `
              <tr>
                <td colspan = "8">Education Not Found!</td>
              </tr>
              `;
            }
        })
        .catch((err) => {
            console.error(err);
        })
}

let searchEducation = document.getElementById("searchEducation");
searchEducation.addEventListener("input", () => {
    displayeducation(searchEducation.value)
});
displayeducation();

educationCloseBtn.addEventListener('click', () => {
    educationForm.classList.remove('active');
});
