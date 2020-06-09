// signup
const delay = ms => new Promise(res => setTimeout(res, ms));

const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const username = signupForm['username'].value;
    const email = signupForm['email'].value;
    const password = signupForm['password'].value;

    if (username.length < 6) {
        alert('Please enter a suitable username.');
        return;
    }

    if (email.length < 5) {
        alert('Please enter a valid email address.');
        return;
    }
    if (password.length < 7) {
        alert('Please enter a password of length greater than 7.');
        return;
    }

    // sign up the user & add firestore data
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            signupForm.reset();

            auth.currentUser.updateProfile({
                displayName: username
            }).catch(function(error) {
                console.error(error)
            })

            sendEmailVerification();
            alert('Email Verification sent!');

            delay(3000);
            sendToPhone();

        }).catch(function (error) {
            // console.error(error)
            alert("Try to signup again with proper details");
        });

});

function sendEmailVerification() {
    // [START sendemailverification]
    auth.currentUser.sendEmailVerification()
    .then(function () {
        alert('Email Verification sent!');
    })
    .catch(function (error) {
        // console.error(error);
        alert("Error: unable to send verification. Please contact support");
    })
    // [END sendemailverification]
}

function sendToPhone() {
    document.location.href = '/phone'
};