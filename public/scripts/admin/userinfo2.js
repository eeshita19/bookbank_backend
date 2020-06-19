window.addEventListener('load', () => {
    if (id == "undefined") {
        alert('User doesnt exists')
    } else {
        getMarker();
        initObjection();
        getUrls();
    }
})

const initObjection = async () => {
    let docRef = await db.collection("usersdata").doc(id);
    docRef
        .get()
        .then(doc => {
            if (doc.data().objection !== "" || doc.data().objection !== null) {
                $("#objection").val(doc.data().objection); // jQuery
            }
        })
        .catch(error => {
            // console.log(error);
            alert(`can't fetch objection`)
        })
}

let documents = {};

const getMarker = async () => {
    await db.collection('usersdata').doc(id).get()
        .then(doc => {
            documents[doc.id] = doc.data();
        })
        .catch((error) => {
            console.log(error)
        })

    $('#institute').val(documents[Object.keys(documents)[0]]["university"])
    $("#course").val(documents[Object.keys(documents)[0]]["course"])
    $("#shift1").val(documents[Object.keys(documents)[0]]["classShift"])
    $('#morning').text(documents[Object.keys(documents)[0]]["classShift"])
    $('#morning').append("<br><span id='shift'> Shift </span>")
    $('#residence').text(documents[Object.keys(documents)[0]]["residentCity"] + ", " + documents[Object.keys(documents)[0]]["residentState"])
    $('#branchname').text(documents[Object.keys(documents)[0]]["course"])
    $('#collegename').text(documents[Object.keys(documents)[0]]["university"])

}

const saveObjection = async () => {
    let text = $('#objection').val();
    await db.collection("usersdata").doc(id).set({
        objection: text,
    }, {
        merge: true
    }).catch(error => {
        // console.error("Error writing document: ", error);
        alert('failed to save form, please contact support');
    });

    alert('submitted');
}

const getUrls = async () => {
    let photoName;
    let idName;
    await db.collection('usersdata').doc(id).get()
        .then((doc) => {
            photoName = doc.data().photoName;
            idName = doc.data().idName;
        }).catch((error) => {
            console.log(error)
        })

    // console.log(photoName)
    await storage.ref().child('photo/' + photoName).getDownloadURL()
        .then((url) => {
            $('#photo').wrap("<a href=" + url + "> clickhere </a>")
            $('#photo').val(url)
        }).catch((error) => {
            console.log(error)
        })

    await storage.ref().child('photo/' + idName).getDownloadURL()
        .then((url) => {
            $('#userId').wrap("<a href=" + url + "> clickhere </a>")
            $('#userId').val(url)
        }).catch((error) => {
            console.log(error)
        })
}