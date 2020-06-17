// check user
const initLogin = () => {
    if (auth.currentUser === null || auth.currentUser !== null)
        auth.signOut();
}

window.addEventListener('load', () => {
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
            auth.currentUser.getIdTokenResult().then(idTokenResult => {
                auth.currentUser.admin = idTokenResult.claims.admin;
                if (auth.currentUser.admin === true)
                    sendToAdminDash();
                else
                    sendToDashboard();
            })
            // loginForm.querySelector('.error').innerHTML = '';
        }).catch((error) => {
            // loginForm.querySelector('.error').innerHTML = err.message;
            alert('wrong email or password')
        });
});

const resetPasswordLink = () => {
    const loginForm = document.querySelector('#login-form');
    const email = loginForm['email'].value;

    auth.sendPasswordResetEmail(email).then(() => {
        alert('Email send successfully! Please check your inbox.')
    }).catch((error) => {
        alert('To get the link to reset password please input your email then click here')
    })
}

const sendToDashboard = () => {
    document.location.href = '/dashboard'
};

const sendToAdminDash = () => {
    document.location.href = '/admin'
};