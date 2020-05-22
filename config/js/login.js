// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(firebase.auth());

const uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {

            return true;
        },
        uiShown: function () {

            document.getElementById('loader').style.display = 'none';
        }
    },
    signInFlow: 'redirect',
    signInSuccessUrl: '/main',
    signInOptions: [


        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '/main',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>',
    recaptchaParameters: {
        'size': 'visible'
    }
};


ui.start('#firebaseui-auth-container', uiConfig);