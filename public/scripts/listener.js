// listen for auth status changes
function initApp() {
    auth.onAuthStateChanged(user => {
        if (user) {
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var uid = user.uid;

            if (!emailVerified) {
                document.getElementById('quickstart-verify-email').disabled = false;
            }

        } else {
            // logout or redirect to login
        }
    });
}

window.onload = () => {
    initApp();
};