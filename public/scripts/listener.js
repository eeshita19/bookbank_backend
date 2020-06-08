// listen for auth status changes
function initApp() {
    auth.onAuthStateChanged(user => {
        if (user) {
            // let displayName = user.displayName;
            let email = user.email;
            // let emailVerified = user.emailVerified;
            // let photoURL = user.photoURL;
            let uid = user.uid;

            // if (!emailVerified) {
            //     document.getElementById('quickstart-verify-email').disabled = false;
            // }

        } else {
            // logout or redirect to login
        }
    });
}

window.onload = () => {
    initApp();
};