const formsCtrl = require('../controllers').forms

module.exports = (app) => {

    app.post('/form/acad', formsCtrl.saveAcademicDetails)
    app.post('/form/details', formsCtrl.savePersonalDetail)

}