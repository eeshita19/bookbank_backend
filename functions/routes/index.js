const usersCtrl = require('../controllers').users

module.exports = (app) => {

    app.post('/form/add', usersCtrl.saveFormData)
    app.get('/form/display', usersCtrl.getFormData)
    app.put('/form/update', usersCtrl.updateUserFormData)
    app.delete('/form/delete', usersCtrl.deleteUserRecord)

}