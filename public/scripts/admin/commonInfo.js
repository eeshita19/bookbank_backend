let url = window.location.href;
let id = url.substring(url.lastIndexOf('/') + 1);

window.addEventListener('load', () => {
    initReq();
})

const initReq = async () => {
    let docRef = await db.collection("usersdata").doc(id);
    docRef
        .get()
        .then(doc => {
            if (doc.data().reconsider === true && doc.data().adminVerification === true) {
                onAccept();
            } else if (doc.data().adminVerification === false && doc.data().reconsider === true) {
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
    await db.collection("usersdata").doc(id).set({
        adminVerification: true,
        reconsider: true
    }, {
        merge: true,
    }).catch(error => {
        // console.error("Error writing document: ", error);
        alert('failed to save form, please contact support');
    });

    onAccept();

}

const rejectReview = async () => {
    await db.collection("usersdata").doc(id).set({
        adminVerification: false,
        reconsider: true
    }, {
        merge: true,
    }).catch(error => {
        // console.error("Error writing document: ", error);
        alert('failed to save form, please contact support');
    });

    onReject();
}


const reconsiderReview = async () => {
    await db.collection("usersdata").doc(id).set({
        adminVerification: false,
        reconsider: false
    }, {
        merge: true,
    }).catch(error => {
        // console.error("Error writing document: ", error);
        alert('failed to save form, please contact support');
    });

    onReconsider();
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