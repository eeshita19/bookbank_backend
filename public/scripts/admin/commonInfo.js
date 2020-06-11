let url = window.location.href;
let id = url.substring(url.lastIndexOf('/') + 1);

window.addEventListener('load', function () {
    initReq();
})

async function initReq() {
    let docRef = await db.collection("usersdata").doc(id);
    docRef
        .get()
        .then(function (doc) {
            if (doc.data().reconsider === true && doc.data().adminVerification === true) {
                onAccept();
            } else if (doc.data().adminVerification === false && doc.data().reconsider === true) {
                onReject();
            } else {
                onReconsider();
            }

        })
        .catch(function (error) {
            console.log(error);
        })
}


async function acceptReview() {
    await db.collection("usersdata").doc(id).set({
        adminVerification: true,
        reconsider: true
    }, {
        merge: true,
    }).catch(function (error) {
        // console.error("Error writing document: ", error);
        alert('failed to save form, please contact support');
    });

    onAccept();

}

async function rejectReview() {
    await db.collection("usersdata").doc(id).set({
        adminVerification: false,
        reconsider: true
    }, {
        merge: true,
    }).catch(function (error) {
        // console.error("Error writing document: ", error);
        alert('failed to save form, please contact support');
    });

    onReject();
}


async function reconsiderReview() {
    await db.collection("usersdata").doc(id).set({
        adminVerification: false,
        reconsider: false
    }, {
        merge: true,
    }).catch(function (error) {
        // console.error("Error writing document: ", error);
        alert('failed to save form, please contact support');
    });

    onReconsider();
}

function onAccept() {
    $('#accept').hide();
    $('#reject').hide();
    $('#accepted').show();
    $('#reconsider').show();
}


function onReject() {
    $('#accept').hide();
    $('#reject').hide();
    $('#rejected').show();
    $('#reconsider').show();
}


function onReconsider() {
    $('#reconsider').hide();
    $('#accept').show();
    $('#reject').show();
    $('#rejected').hide();
    $('#accepted').hide();
}


function goToUserInfo() {
    document.location.href = '/admin/userinfo/' + id;
}

function goToUserInfo1() {
    document.location.href = '/admin/userinfo1/' + id;
}

function goToUserInfo2() {
    document.location.href = '/admin/userinfo2/' + id;
}