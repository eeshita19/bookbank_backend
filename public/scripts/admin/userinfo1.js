window.addEventListener('load', function () {
    getMarker();
})

let documents = {};

async function getMarker() {
    await db.collection('usersdata').doc(id).get()
        .then(function (doc) {
            documents[doc.id] = doc.data();
        })
        .catch((error) => {
            console.log(error)
        })

    $('#institute').val(documents[Object.keys(documents)[0]]["university"])
    $("#course").val(documents[Object.keys(documents)[0]]["course"])
    $("#courseduration").val(documents[Object.keys(documents)[0]]["courseStart"] + " to " + documents[Object.keys(documents)[0]]["courseEnd"])
    $("#enrollment").val(documents[Object.keys(documents)[0]]["uidNumber"])
    $("#shift1").val(documents[Object.keys(documents)[0]]["classShift"])
    $("#home").val(documents[Object.keys(documents)[0]]["classLocation"])
    $('#morning').text(documents[Object.keys(documents)[0]]["classShift"])
    $('#morning').append("<br><span id='shift'> Shift </span>")
    $('#residence').text(documents[Object.keys(documents)[0]]["residentCity"] + ", " + documents[Object.keys(documents)[0]]["residentState"])
    $('#branchname').text(documents[Object.keys(documents)[0]]["course"])
    $('#collegename').text(documents[Object.keys(documents)[0]]["university"])

}