/**
 * Created by Deepa on 7/28/2018.
 */

var express = require('express')
    , router = express.Router()
    , syllabus = require('../../services/syllabus/syllabus.service');

router.get('/:id', syllabus.getSyllabusByClass);
router.get('/', syllabus.getSyllabusByClass);
router.post('/',  syllabus.saveSchoolSyllabus);
router.put('/',  syllabus.updateSchoolSyllabus);
router.put('/:id',  syllabus.updateSchoolSyllabusByClassId);

router.delete('/attachments/:id/', syllabus.deleteAttachments);
router.delete('/:id', syllabus.deleteSchoolSyllabus);

module.exports = router;
