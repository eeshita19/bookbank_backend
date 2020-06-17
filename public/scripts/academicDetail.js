const initAcad = () => {
    auth.onAuthStateChanged(user => {
        if (user) {
            let docRef = db.collection("usersdata").doc(auth.currentUser.uid);
            docRef
                .get()
                .then(doc => {
                    if (doc.exists) {
                        if (doc.data().form2 == true) {
                            sendResponse();
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                })

        } else
            document.location.href = '/login'
    });
}

window.addEventListener('load', () => {
    initAcad();

})

const acadForm = document.querySelector('#acad-form');
acadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // get user data
    const university = listitem.textContent;
    const course = listitem1.textContent;
    const courseStart = acadForm['courseStart'].value;
    const courseEnd = acadForm['courseEnd'].value;
    const classShift = acadForm['shift'].value;
    const classLocation = acadForm['place'].value;
    let uidNumber = acadForm['enroll'].value;

    if (uidNumber == null || uidNumber == "") {
        uidNumber = "Not provided";
    }

    await db.collection("usersdata").doc(auth.currentUser.uid).set({
        university: university,
        course: course,
        courseStart: courseStart,
        courseEnd: courseEnd,
        classShift: classShift,
        classLocation: classLocation,
        uidNumber: uidNumber,
        form2: true,
    }, {
        merge: true,
    }).catch(error => {
        console.error("Error writing document: ", error);
        alert('failed to save form, please contact support');
    });

    alert('form submitted');
    sendResponse();
});

const sendResponse = () => {
    document.location.href = '/response'

}