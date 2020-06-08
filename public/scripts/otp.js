const db = firebase.firestore();

let prevUser;
let phoneNum;

auth.onAuthStateChanged(function (user) {
    if (user)
        prevUser = user.uid;
})

window.onload = function () {
    render();
};

function render() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    recaptchaVerifier.render();
}

function phoneAuth() {
    //get the number
    let number = '+91' + document.getElementById('inputphoneno').value;
    phoneNum = number;
    //phone number authentication function of firebase
    //it takes two parameter first one is number,,,second one is recaptcha
    auth.signInWithPhoneNumber(number, window.recaptchaVerifier).then(function (confirmationResult) {
        //s is in lowercase
        window.confirmationResult = confirmationResult;
        coderesult = confirmationResult;
        // console.log(coderesult);
        alert("OTP sent");
        $('#phoneDiv').hide();
        $('#otpDiv').show();
        getPhNum();
        let phoNum = "+91" + number[3] + number[4] + "*****" + number[11] + number[11] + number[12];
        $('#phText').html(phoNum);

    }).catch(function (error) {
        console.log(error.message);
    });
}

function codeverify() {
    var code = document.getElementById('verificationCode').value;
    coderesult.confirm(code).then(function (result) {
        alert("Successfully registered");
        let currentUser = result.user;
        console.log(currentUser);
        db.collection("users").doc(prevUser).set({
            phone: number,
        }).catch(function (error) {
            console.error("Error writing document: ", error);
        });

    }).catch(function (error) {
        console.log(error.message);
    });
}