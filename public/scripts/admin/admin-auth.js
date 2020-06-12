// add admin cloud function
const adminForm = document.querySelector('#admin-form');
adminForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const adminEmail = document.querySelector('#admin-email').value;
    const addAdminRole = functions.httpsCallable('addAdminRole');
    addAdminRole({
        email: adminEmail
    }).then(result => {
        console.log(result);
    });
});