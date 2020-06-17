window.addEventListener('load', () => {
    getMarker();
})

let documents = {};

const getMarker = async () => {
    await db.collection('usersdata').doc(id).get()
        .then(doc => {
            documents[doc.id] = doc.data();
        })
        .catch((error) => {
            console.log(error)
        })

    $("#mobileno").val(documents[Object.keys(documents)[0]]["phoneNumber"])
    $("#email").val(documents[Object.keys(documents)[0]]["email"])
    $("#user1").val(documents[Object.keys(documents)[0]]["firstname"])
    $("#lastname").val(documents[Object.keys(documents)[0]]["lastname"])
    $("#fathername").val(documents[Object.keys(documents)[0]]["fatherfirstname"])
    $("#fatherlastname").val(documents[Object.keys(documents)[0]]["fatherlastname"])
    $("#state").val(documents[Object.keys(documents)[0]]["residentState"])
    $("#city").val(documents[Object.keys(documents)[0]]["residentCity"])
    $("#dob").val(documents[Object.keys(documents)[0]]["dob"])
    $('#collegename').text(documents[Object.keys(documents)[0]]["university"])
    $('#morning').text(documents[Object.keys(documents)[0]]["classShift"])
    $('#morning').append("<br><span id='shift'> Shift </span>")
    $('#branchname').text(documents[Object.keys(documents)[0]]["course"])
    // $('#branchname').text(documents[Object.keys(documents)[0]]["course"])
    $('#residence').text(documents[Object.keys(documents)[0]]["residentCity"] + ", " + documents[Object.keys(documents)[0]]["residentState"])

}
