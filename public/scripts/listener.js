// listen for auth status changes
const initApp = () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            let emailVerified = user.emailVerified;
            let username = user.displayName;
            // let photoURL = user.photoURL;

            if (!emailVerified) {
                auth.signOut();
                alert("Email not verified. Access denied");
                document.location.href = '/login'
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