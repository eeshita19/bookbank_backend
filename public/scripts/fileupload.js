// uploading the files
const ref = firebase.storage().ref();
const file1 = document.querySelector('#photo1').files[0]
const file2 = document.querySelector('#photo2').files[0]

const name1 = (+new Date()) + '-' + file1.name;
const name2 = (+new Date()) + '-' + file2.name;

const metadata1 = {
    contentType: file1.type
};

const metadata2 = {
    contentType: file2.type
};

const task = ref.child(name1).put(file1, metadata1);
task
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then((url) => {
        console.log(url);
        document.querySelector('#someImageTagID').src = url;
    })
    .catch(console.error);


const task = ref.child(name2).put(file2, metadata2);
task
    .then(snapshot => snapshot.ref.getDownloadURL())
    .then((url) => {
        console.log(url);
        document.querySelector('#someImageTagID').src = url;
    })
    .catch(console.error);