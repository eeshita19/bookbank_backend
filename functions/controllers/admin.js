const admin = require("firebase-admin")
const db = admin.firestore()

module.exports = {

    async countUsers(req, res) {
        let count
        await db.collection('users')
            .doc('userCount')
            .get()
            .then(doc => {
                count = doc.data().count
                return count
            })
            .catch(err => {
                return err
            })
        res.render('admin/index', {
            userCount: count
        })
    },

    async getCustomers(req, res) {
        let allUsers, newUsers, acceptedUsers, rejectedUsers

        await db.collection('users')
            .doc('userCount').get()
            .then(doc => {
                allUsers = doc.data().count
                return allUsers
            }).catch(err => {
                return err
            })

        await db.collection('users')
            .doc('newUserCount').get()
            .then(doc => {
                newUsers = doc.data().count
                return newUsers
            }).catch(err => {
                return err
            })

        await db.collection('users')
            .doc('acceptedUsers').get()
            .then(doc => {
                acceptedUsers = doc.data().count
                return acceptedUsers
            }).catch(err => {
                return err
            })

        await db.collection('users')
            .doc('rejectedUsers').get()
            .then(doc => {
                rejectedUsers = doc.data().count
                return rejectedUsers
            }).catch(err => {
                return err
            })

        res.render('admin/customer', {
            allUsers: allUsers,
            newUsers: newUsers,
            acceptedUsers: acceptedUsers,
            rejectedUsers: rejectedUsers
        })
    },

    async getUserInfo(req, res) {
        let uid = req.params.id
        let valid
        let username
        await admin.auth().getUser(uid)
            .then(data => {
                if (data.emailVerified === false) {
                    valid = "NOT VERIFIED"
                } else {
                    valid = "VERIFIED"
                }
                username = data.displayName
                return valid
            })
            .catch(err => {
                return err
            })
        res.render('admin/userinfo', {
            state: valid,
            username: username
        })
    },

    async getUserInfo1(req, res) {
        let uid = req.params.id
        let username

        await admin.auth().getUser(uid)
            .then(data => {
                username = data.displayName
                return username
            })
            .catch(err => {
                return err
            })
        res.render('admin/userinfo1', {
            username: username
        })
    },

    async getUserInfo2(req, res) {
        let uid = req.params.id
        let username
        await admin.auth().getUser(uid)
            .then((data) => {
                username = data.displayName
                return username
            })
            .catch(err => {
                return err
            })
        res.render('admin/userinfo2', {
            username: username
        })
    },

}