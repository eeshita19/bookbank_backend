// check user
function initLogin() {
    if (auth.currentUser === null || auth.currentUser !== null)
        auth.signOut();
}

window.addEventListener('load', function () {
    initLogin();
})

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;

    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }

    // log the user in
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            loginForm.reset();
            console.log(auth.currentUser.email)
            auth.currentUser.getIdTokenResult().then(idTokenResult => {
                auth.currentUser.admin = idTokenResult.claims.admin;
                if (auth.currentUser.admin === true)
                    sendToAdminDash();
                else
                    sendToDashboard();
            })
            // sendToDashboard();
            // loginForm.querySelector('.error').innerHTML = '';
        }).catch(err => {
            // loginForm.querySelector('.error').innerHTML = err.message;
            console.log(err)
        });
});

function sendToDashboard() {
    document.location.href = '/dashboard'
};

function sendToAdminDash() {
    document.location.href = '/admin'
};