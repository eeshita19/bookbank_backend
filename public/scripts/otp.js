let prevUser;

auth.onAuthStateChanged(function (user) {
    if (user)
        prevUser = user;

    if (!user) {
        alert("Please sign in!!");
        sendToLogin();
    }
})

window.onload = function () {
    render();
};

function render() {
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    'size': 'invisible',  
  });
    recaptchaVerifier.render();
}

function phoneAuth() {
    //get the number
    let number = '+91' + document.getElementById('inputphoneno').value;
    //phone number authentication function of firebase
    prevUser.linkWithPhoneNumber(number, window.recaptchaVerifier).then(function (confirmationResult) {
        //s is in lowercase
        window.confirmationResult = confirmationResult;
        coderesult = confirmationResult;
        // console.log(coderesult);
        alert("OTP sent");
        $('#phoneDiv').hide();
        $('#otpDiv').show();
       // getPhNum();
        let phoNum = "+91" + number[3] + number[4] + "*****" + number[10] + number[11] + number[12];
        $('#phText').html(phoNum);

    }).catch(function (error) {
        // console.log(error.message);
        alert('Please try again');
    });
}

function codeverify() {
    var code = document.getElementById('verificationCode').value;
    coderesult.confirm(code).then(function (result) {
        let currentUser = result.user;

        alert("Successfully registered");

        auth.signOut();
        sendToLogin();

    }).catch(function (error) {
        // console.log(error.message);
        alert("Wrong OTP, please try again");
    });
}

function sendToLogin() {
    document.location.href = '/login'
};
