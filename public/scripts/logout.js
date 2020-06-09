// logout
const logout = document.getElementById('button3');

logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
    sendToLogin();
});

function sendToLogin() {
    document.location.href = '/login'
};