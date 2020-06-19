module.exports = (app) => {

    app.get('/login', (req, res) => {
        res.render('login/signin')
    })

    app.get('/register', (req, res) => {
        res.render('login/signup')
    })

    //otp
    app.get('/phone', (req, res) => {
        res.render('login/phone_verification')
    })

    app.get('/dashboard', (req, res) => {
        res.render('dashboard')
    })

    //ide
    app.get('/ide', (req, res) => {
        res.render('ide/ide')
    })

    //form routes
    app.get('/form/personal', (req, res) => {
        res.render('form/personal_detail')
    })

    app.get('/form/academic', (req, res) => {
        res.render('form/academic_detail')
    })

    app.get('/form/file', (req, res) => {
        res.render('form/file_upload')
    })

    app.get('/response', (req, res) => {
        res.render('submitresponse')
    })

    app.get('/congratulations', (req, res) => {
        res.render('congratulations')
    })

    app.get('/activated', (req, res) => {
        res.render('activated')
    })

}