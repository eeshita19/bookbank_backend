// logout
const logout = document.querySelector('#button3');

logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});