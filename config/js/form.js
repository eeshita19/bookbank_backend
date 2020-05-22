var userdataForm = document.getElementById('userdata-form');
let fname = document.getElementById('firstname');
let mname = document.getElementById('middlename');
let lname = document.getElementById('lastname');
let ffname = document.getElementById('ffname');
let fmname = document.getElementById('fmname');
let flname = document.getElementById('flname');
let dob = document.getElementById('dob');
let gender = document.getElementById('gender');
let res1 = document.getElementById('res1');
let res2 = document.getElementById('res2');
let uni = document.getElementById('uni');
let course = document.getElementById('course');
let startdate = document.getElementById('startdate');
let lastdate = document.getElementById('lastdate');
let shift = document.getElementById('shift');
let location = document.getElementById('location');
let enumber = document.getElementById('enumber');
let picture = document.getElementById('picture');
let fileupload = document.getElementById('fileupload');

let data = {
    email: firebase.auth().currentUser.email,
    phone: firebase.auth().currentUser.phone,
    firstname: fname.value,
    middlename: mname.value,
    lastname: lname.value,
    fatherFirstname: ffname.value,
    fatherMiddlename: fmname.value,
    fatherLastname: flname.value,
    dateOfBirth: dob.value.toString(),
    gender: gender.value,
    residentPart1: res1.value,
    residentPart2: res2.value,
    university: uni.value,
    course: course.value,
    courseStartDate: startdate.value.toString(),
    courseLastDate: lastdate.value.toString(),
    shift: shift.value,
    location: location.value,
    enrollmentNumber: enumber.value,
    pictureUrl: picture.value,
    fileUrl: fileupload.value
}

const ref = firebase.database().ref().child('users')
const logsRef = ref.child('logs')
const usersdataRef = ref.child('userdata')

if (firebase.auth().currentUser !== null)
    userId = firebase.auth().currentUser.uid

userdataForm.onsubmit = function (e) {
    e.preventDefault();
    try {
        let userdataRef = usersdataRef
            .push(data)
            .then(() => {
                return alert('success')
            })
    } catch (error) {
        console.log('User not logged in')
    }

};