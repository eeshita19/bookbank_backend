let prevUser;

auth.onAuthStateChanged(user => {
    if (user)
        prevUser = user;

    if (!user) {
        alert("Please sign in!!");
        sendToLogin();
    }
})

window.onload = () => {
    render();
};

const render = () => {
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    'size': 'invisible',  
  });
    recaptchaVerifier.render();
}

const phoneAuth = () => {
    //get the number
    let number = '+91' + document.getElementById('inputphoneno').value;
    //phone number authentication from firebase
    prevUser.linkWithPhoneNumber(number, window.recaptchaVerifier).then(confirmationResult => {
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

    }).catch(error => {
        // console.log(error.message);
        alert('Please try again');
    });
}

const codeverify = () => {
    var code = document.getElementById('verificationCode').value;
    coderesult.confirm(code).then(result => {
        let currentUser = result.user;

        alert("Successfully registered");

        auth.signOut();
        sendToLogin();

    }).catch(error => {
        // console.log(error.message);
        alert("Wrong OTP, please try again");
    });
}

let sendToLogin = () => {
    document.location.href = '/login'
};
