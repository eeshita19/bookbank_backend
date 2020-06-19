// signup
const delay = ms => new Promise(res => setTimeout(res, ms));

const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const username = signupForm['username'].value;
    const email = signupForm['email'].value;
    const password = signupForm['password'].value;

    if (username.length < 6) {
        alert('Please enter a suitable username.');
        return;
    }

    if (email.length < 5) {
        alert('Please enter a valid email address.');
        return;
    }
    if (password.length < 7) {
        alert('Please enter a password of length greater than 7.');
        return;
    }

    // sign up the user & add firestore data
    auth.createUserWithEmailAndPassword(email, password)
        .then(async () => {
            signupForm.reset();

            await auth.currentUser.updateProfile({
                displayName: username
            }).catch(error => {
                // console.error(error)
                alert('failed to save, please contact support');
            });

            await db.collection("users").doc("userCount").update({
                count: firebase.firestore.FieldValue.increment(1)
            }).catch(error => {
                // console.error("Error writing document: ", error);
                alert('failed to save, please contact support');
            });

            await db.collection("users").doc("newUserCount").update({
                count: firebase.firestore.FieldValue.increment(1)
            }).catch(error => {
                // console.error("Error writing document: ", error);
                alert('failed to save, please contact support');
            });

            await db.collection("users").doc(auth.currentUser.uid).set({
                createdAt: firebase.firestore.Timestamp.fromDate(new Date())
            }).catch(error => {
                // console.error("Error writing document: ", error);
                alert('failed to save, please contact support');
            });

            sendEmailVerification();
            // alert('Email Verification sent!');

            delay(3000);
            sendToPhone();

        }).catch(error => {
            // console.error(error)
            alert("Signup failed, either email doesn't exist or account associated with this e-mail exists already");
        });

});

const sendEmailVerification = () => {
    // [START sendemailverification]
    auth.currentUser.sendEmailVerification()
        .then(() => {
            alert('Email Verification sent!');
        })
        .catch(error => {
            // console.error(error);
            alert("Error: unable to send verification. Please contact support");
        })
    // [END sendemailverification]
}

const sendToPhone = () => {
    document.location.href = '/phone'
};