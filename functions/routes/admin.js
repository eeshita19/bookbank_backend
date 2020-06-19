const adminCtrl = require('../controllers').admins

module.exports = (app) => {

    // admin routes
    // GET routes
    app.get('/admin/login', (req, res) => {
        res.render('admin/login')
    })
    app.get('/admin/add', (req, res) => {
        res.render('admin/createAdmin')
    })

    // async controllers
    app.get('/admin', adminCtrl.countUsers)
    app.get('/admin/customers', adminCtrl.getCustomers)
    app.get('/admin/userinfo/:id', adminCtrl.getUserInfo)
    app.get('/admin/userinfo1/:id', adminCtrl.getUserInfo1)
    app.get('/admin/userinfo2/:id', adminCtrl.getUserInfo2)

}