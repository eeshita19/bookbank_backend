// reset password
let emailAddress = "user@example.com";

auth.sendPasswordResetEmail(emailAddress).then(() => {
  // Email sent.
}).catch(error => {
  // An error happened.
});
