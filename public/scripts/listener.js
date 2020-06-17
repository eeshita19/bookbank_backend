// listen for auth status changes
const initApp = () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            let emailVerified = user.emailVerified;
            let username = user.displayName;
            // let photoURL = user.photoURL;

            if (!emailVerified) {
                auth.logout();
                alert("Email not verified. Access denied");
            } else
                $('#notactive').html("Active");

            $('#caste').html(username);
            $('#username').html(username);

        } else
            document.location.href = '/login'
    });
}

window.onload = () => {
    initApp();
};