const firebase = require('firebase-admin')
const functions = require('firebase-functions')

firebase.initializeApp(functions.config.firebase)

const db = firebase.firestore()

module.exports = {

    // save data from the form.ejs in the views folder
    async saveFormData(req, res) {
        try {
            let {
                dob,
                email,
                enddate,
                enumber,
                fatherfirstname,
                fatherlastname,
                fathermiddlename,
                firstname,
                gender,
                lastname,
                location,
                middlename,
                phone,
                resident1,
                resident2,
                shift,
                startdate,
                university
            } = req.body

            let data = {
                dob,
                email,
                enddate,
                enumber,
                fatherfirstname,
                fatherlastname,
                fathermiddlename,
                firstname,
                gender,
                lastname,
                location,
                middlename,
                phone,
                resident1,
                resident2,
                shift,
                startdate,
                university
            }

            const userUid = firebase.auth().currentUser.uid

            if (!userUid) throw new Error('Please sign in again')

            const usersRef = await db.collection('users').doc(userUid).set(data)
            const userR = await usersRef.get()

            res.json({
                id: usersRef.id,
                data: userR.data()
            })

        } catch (error) {
            res.status(500).send(error)
        }
    },

    // get user form data
    async getFormData(req, res) {
        try {
            const userUid = firebase.auth().currentUser.uid

            if (!userUid) throw new Error('Please sign in again')

            const userData = await db.collection('users').doc(userUid).get()

            if (!userData.exists) {
                throw new Error('User form not submitted')
            }

            res.json({
                data: userData.data()
            })

        } catch (error) {
            res.status(500).send(error)
        }
    },

    // update form 
    async updateUserFormData(req, res) {
        try {
            const userUid = firebase.auth().currentUser.uid

            if (!userUid) throw new Error('Please sign in again')

            let {
                dob,
                email,
                enddate,
                enumber,
                fatherfirstname,
                fatherlastname,
                fathermiddlename,
                firstname,
                gender,
                lastname,
                location,
                middlename,
                phone,
                resident1,
                resident2,
                shift,
                startdate,
                university
            } = req.body

            let data = {
                dob,
                email,
                enddate,
                enumber,
                fatherfirstname,
                fatherlastname,
                fathermiddlename,
                firstname,
                gender,
                lastname,
                location,
                middlename,
                phone,
                resident1,
                resident2,
                shift,
                startdate,
                university
            }

            const usersRef = await db.collection('users').doc(userUid).set(data)
            const userR = await usersRef.get()

            res.json({
                data: userR.data()
            })

        } catch (error) {
            res.status(500).send(error)
        }
    },

    // delete the user form data doc from collection
    async deleteUserRecord(req, res) {
        try {
            const userUid = firebase.auth().currentUser.uid

            if (!userUid) throw new Error('Please sign in again')

            await db.collection('users')
            .doc(userUid)
            .delete()

            res.json({
                id: userUid
            })

        } catch (error) {
            res.status(500).send(error)
        }
    }

}