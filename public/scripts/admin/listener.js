// listen check admin
function initApp() {
    auth.onAuthStateChanged(user => {
        if (user) {
            let username = user.displayName;

            auth.currentUser.getIdTokenResult().then(idTokenResult => {
                auth.currentUser.admin = idTokenResult.claims.admin;
                if (auth.currentUser.admin === false)
                    sendToLogin();
                else
                    console.log("Welcome to admining")
            })

            $('#admin-username').html(username);


        } else
            document.location.href = '/login'
    });
}

window.onload = () => {
    initApp();
};

function sendToLogin() {
    document.location.href = '/login'
}