let url = window.location.href;
let id = url.substring(url.lastIndexOf('/') + 1);

window.addEventListener('load', () => {
    if (id == "undefined") {
        // alert('User doesnt exists')
    } else
        initReq();
})

const initReq = async () => {
    let docRef = await db.collection("usersdata").doc(id);
    docRef
        .get()
        .then(doc => {
            if (doc.data().accepted === true) {
                onAccept();
            } else if (doc.data().rejected === true) {
                onReject();
            } else {
                onReconsider();
            }
        })
        .catch(error => {
            console.log(error);
        })
}

const acceptReview = async () => {

    let passValue = false;

    await db.collection("usersdata").doc(id)
        .get()
        .then(doc => {
            if (doc.data().adminVerification !== true && (doc.data().accepted !== true || doc.data().accepted == null)) {
                passValue = true
            } else {
                alert('Already accepted!')
            }
        })
        .catch(error => {
            console.log(error);
        })

    if (passValue) {
        await db.collection("usersdata").doc(id).set({
            adminVerification: true,
            accepted: true
        }, {
            merge: true,
        }).catch(error => {
            // console.error("Error writing document: ", error);
            alert('failed to save form, please contact support');
        });

        await db.collection("users").doc("newUserCount").update({
            count: firebase.firestore.FieldValue.increment(-1)
        }).catch(error => {
            // console.error("Error writing document: ", error);
            alert('failed to save, please contact support');
        });

        await db.collection("users").doc("acceptedUsers").update({
            count: firebase.firestore.FieldValue.increment(1)
        }).catch(error => {
            // console.error("Error writing document: ", error);
            alert('failed to save, please contact support');
        });

        onAccept();
    }
}

const rejectReview = async () => {

    let passValue = false;

    await db.collection("usersdata").doc(id)
        .get()
        .then(doc => {
            if (doc.data().adminVerification !== true && (doc.data().rejected !== true || doc.data().rejected == null)) {
                passValue = true
            } else {
                alert('Already rejected!')
            }
        })
        .catch(error => {
            console.log(error);
        })

    if (passValue) {
        await db.collection("usersdata").doc(id).set({
            adminVerification: true,
            rejected: true
        }, {
            merge: true,
        }).catch(error => {
            // console.error("Error writing document: ", error);
            alert('failed to save form, please contact support');
        });

        await db.collection("users").doc("newUserCount").update({
            count: firebase.firestore.FieldValue.increment(-1)
        }).catch(error => {
            // console.error("Error writing document: ", error);
            alert('failed to save, please contact support');
        });

        await db.collection("users").doc("rejectedUsers").update({
            count: firebase.firestore.FieldValue.increment(1)
        }).catch(error => {
            // console.error("Error writing document: ", error);
            alert('failed to save, please contact support');
        });

        onReject();
    }
}

const reconsiderReview = async () => {

    let passValue = false;

    await db.collection("usersdata").doc(id)
        .get()
        .then(doc => {
            if (doc.data().adminVerification !== false && doc.data().rejected !== false && doc.data().accepted !== false) {
                passValue = true
            } else {
                alert('Please click the button only once!')
            }
        })
        .catch(error => {
            console.log(error);
        })

    if (passValue) {
        await db.collection("usersdata").doc(id).set({
            adminVerification: false,
            accepted: false,
            rejected: false
        }, {
            merge: true,
        }).catch(error => {
            // console.error("Error writing document: ", error);
            alert('failed to save form, please contact support');
        });

        await db.collection("users").doc("newUserCount").update({
            count: firebase.firestore.FieldValue.increment(1)
        }).catch(error => {
            // console.error("Error writing document: ", error);
            alert('failed to save, please contact support');
        });

        await db.collection("users").doc("acceptedUsers").update({
            count: firebase.firestore.FieldValue.increment(-1)
        }).catch(error => {
            // console.error("Error writing document: ", error);
            alert('failed to save, please contact support');
        });

        await db.collection("users").doc("rejectedUsers").update({
            count: firebase.firestore.FieldValue.increment(-1)
        }).catch(error => {
            // console.error("Error writing document: ", error);
            alert('failed to save, please contact support');
        });

        onReconsider();
    }
}

const onAccept = () => {
    $('#accept').hide();
    $('#reject').hide();
    $('#accepted').show();
    $('#reconsider').show();
}

const onReject = () => {
    $('#accept').hide();
    $('#reject').hide();
    $('#rejected').show();
    $('#reconsider').show();
}

const onReconsider = () => {
    $('#reconsider').hide();
    $('#accept').show();
    $('#reject').show();
    $('#rejected').hide();
    $('#accepted').hide();
}

const goToUserInfo = () => {
    document.location.href = '/admin/userinfo/' + id;
}

const goToUserInfo1 = () => {
    document.location.href = '/admin/userinfo1/' + id;
}

const goToUserInfo2 = () => {
    document.location.href = '/admin/userinfo2/' + id;
}