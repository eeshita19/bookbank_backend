// logout
const logout = document.getElementById('logout');

logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
    sendToLogin();
});
