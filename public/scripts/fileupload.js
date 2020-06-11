function initUp() {
    auth.onAuthStateChanged(user => {
        if (user) {
            let docRef = db.collection("usersdata").doc(auth.currentUser.uid);
            docRef
                .get()
                .then(function (doc) {
                    if (doc.exists) {
                        if (doc.data().form3 == true) {
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
    initUp();

})

const upForm = document.querySelector('#up-form');
upForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const ref = storage.ref();

    const file1 = $('#file1').get(0).files[0]
    const file2 = $('#file2').get(0).files[0]

    const name1 = "photo-" + auth.currentUser.email;
    const name2 = "id+" + auth.currentUser.email;

    const metadata1 = {
        contentType: file1.type
    };

    const metadata2 = {
        contentType: file2.type
    };

    await ref.child('photo/' + name1).put(file1, metadata1)
        .catch((error) => {
            alert('Error occured: please contact support')
        })

    await ref.child('ID/' + name2).put(file2, metadata2)
        .catch((error) => {
            alert('Error occured: please contact support')
        })

    await db.collection("usersdata").doc(auth.currentUser.uid).set({
        form3: true,
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