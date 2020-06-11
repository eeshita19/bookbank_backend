function initDetails() {
    auth.onAuthStateChanged(user => {
        if (user) {
            let email = user.email;
            let emailVerified = user.emailVerified;
            // let username = user.displayName;
            let phoneNumber = user.phoneNumber;

            $('#email').val(email);

            function checkEmail() {
                if (!emailVerified) {
                    $('#status').html("NOT VERIFIED");
                    $('#status').css("background-color", "red");
                }
            }

            $('#mobile').val(phoneNumber);
            checkEmail();

            if (phoneNumber == "" || !phoneNumber) {
                $('#statusmobile').html("NOT VERIFIED");
                $('#statusmobile').css("background-color", "red");
                alert("please register your mobile to continue with this form");
                sendToPhone();
            }

            let docRef = db.collection("usersdata").doc(auth.currentUser.uid);
            docRef
                .get()
                .then(function (doc) {
                    if (doc.exists) {
                        if (doc.data().form1 == true) {
                            sendResponse();
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })

        } else
            document.location.href = '/login'
    });
}

window.addEventListener('load', function () {
    initDetails();
})

$("#change").click(function () {
    // const refresh = initDetails();
    initDetails();
    $("#status").click(function () {
        $("#status").css("background-color", "#eea553");
        $("#status").text("VERIFING...");
    })
});

function sendToPhone() {
    document.location.href = '/phone'
};

const signupForm = document.querySelector('#details-form');
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // get user data
    const firstname = signupForm['firstname'].value;
    const middlename = signupForm['middlename'].value;
    const lastname = signupForm['lastname'].value;
    const fatherfirstname = signupForm['fatherfirstname'].value;
    const fatherlastname = signupForm['fatherlastname'].value;
    const residentState = listitem.textContent;
    const residentCity = listitem1.textContent;
    const dob = signupForm['dob'].value;
    let dateAndTime = new Date().toLocaleString();

    await db.collection("usersdata").doc(auth.currentUser.uid).set({
        username: auth.currentUser.displayName,
        email: auth.currentUser.email,
        phoneNumber: auth.currentUser.phoneNumber,
        firstname: firstname,
        middlename: middlename,
        lastname: lastname,
        dob: dob,
        fatherfirstname: fatherfirstname,
        fatherlastname: fatherlastname,
        residentState: residentState,
        residentCity: residentCity,
        dateSubmitted: dateAndTime,
        form1: true,
        adminVerification: false,
    }, {
        merge: true,
    }).catch(function (error) {
        console.error("Error writing document: ", error);
        alert('failed to save form, please contact support');
    });

    alert('form submitted');
    sendResponse();
});

function sendResponse() {
    document.location.href = '/response'

}