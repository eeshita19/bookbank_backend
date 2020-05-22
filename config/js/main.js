firebase.auth().onAuthStateChanged(function (user) {

    let uid = null;
    if (user) {
        // User is signed in.
        uid = user.uid;
        let displayName = user.displayName;

        user.getToken().then(function (accessToken) {
            document.getElementById('sign-in-status').textContent = 'Signed IN';
            document.getElementById('sign-in').textContent = 'Sign Out';
            document.getElementById('account-details').textContent = JSON.stringify({
                displayName: displayName
            }, null, ' ');
        });
    } else {
        //redirect to login page
        uid = null;
        window.location.replace("/")
    }
});

function logOut() {
    firebase.auth().signOut();
}