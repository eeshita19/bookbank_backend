// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const username = signupForm['username'].value;
    const email = signupForm['email'].value;
    const password = signupForm['password'].value;

    if (username.length < 4) {
        alert('Please enter an email address.');
        return;
    }

    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }

    // sign up the user & add firestore data
    auth.createUserWithEmailAndPassword(username, email, password)
        .then(() => {
            sendEmailVerification();
            signupForm.reset();
            sendToPhone();
            // signupForm.querySelector('error').innerHTML = 'Email Verification Sent!'
        }).catch(err => {
            // signupForm.querySelector('error').innerHTML = err.message;
        });

});

function sendEmailVerification() {
    // [START sendemailverification]
    auth.currentUser.sendEmailVerification().then(function () {
        // alert('Email Verification sent!');
        // [START_EXCLUDE]
        // signupForm.querySelector('.error').innerHTML = 'Email Verification Sent!';
        // [END_EXCLUDE]
    });
    // [END sendemailverification]
}

function sendToPhone() {
    alert("Email Verification sent!");
    document.location.href = '/phone'
};