// listen for auth status changes
function initApp() {
    auth.onAuthStateChanged(user => {
        if (user) {
            let emailVerified = user.emailVerified;
            let username = user.displayName;
            // let photoURL = user.photoURL;

            if (!emailVerified)
                alert("Please verify your email");
            else
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