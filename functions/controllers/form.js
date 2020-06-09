const firebase = require("firebase-admin");
const functions = require('firebase-functions')

//require("firebase/firestore");

firebase.initializeApp(functions.config.firebase)

const db = firebase.firestore()
// const auth = firebase.auth()
// const storageRef = firebase.storage().ref()

module.exports = {
    async saveAcademicDetails(req, res) {
        try {
            let {
                university,
                course,
                courseStart,
                courseEnd,
                classShift,
                classLocation,
                uidNumber
            } = req.body

            let data = {
                university,
                course,
                courseStart,
                courseEnd,
                classShift,
                classLocation,
                uidNumber
            }

            const userUid = firebase.auth().currentUser.uid

            if (!userUid) throw new Error('Please sign in again')

            const usersRef = await db.collection('users').doc(userUid).set(data, {merge: true}).catch(error => res.status(400).send(error))
            // const userR = 

            await usersRef.get()
                .then(() => res.redirect('/response'))
                .catch(error => res.status(401).send(error))

        } catch (error) {
            res.status(500).send(error)
        }

    },
    
    async savePersonalDetail(req, res) {
        try {
            let {
                firstname,
                middlename,
                lastname,
                fatherfirstname,
                fathermiddlename,
                fatherlastname,
                residentState,
                residentCity,
                // gender,
            } = req.body

            let email = firebase.auth().currentUser.email
            let phone = firebase.auth().currentUser.phone

            let data = {
                firstname,
                middlename,
                lastname,
                fatherfirstname,
                fathermiddlename,
                fatherlastname,
                residentState,
                residentCity,
                email,
                phone
            }

            const userUid = firebase.auth().currentUser.uid

            if (!userUid) throw new Error('Please sign in again')

            const usersRef = await db.collection('users').doc(userUid).set(data).catch(error => res.status(400).send(error))
            await usersRef.get()
                .then(() => res.redirect('/response'))
                .catch(error => res.status(401).send(error))

        } catch (error) {
            res.status(500).send(error)
        }
    }
}