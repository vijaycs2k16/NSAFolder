/**
 * Created by kiranmai on 9/5/17.
 */

var express = require('express')
    , router = express.Router()
    , nexapp = require('../../services/nexapp/nexapp.service');

router.post('/subject', nexapp.getSubjectsbyClassSections);
router.get('/class/subjects', nexapp.getClassSubjects);
router.get('/class/:id', nexapp.getSubjectsbyClass);
router.post('/topic', nexapp.getContentByTopic);
router.get('/subject/:id', nexapp.getContentBySubject);
router.post('/subject/contents', nexapp.getContentBySubTitTerm);

module.exports = router;