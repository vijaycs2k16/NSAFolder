/**
 * Created by Sai Deepak on 01-Feb-17.
 */
var express = require('express')
    , router = express.Router()
    , taxanomy = require('../../services/taxanomy/taxanomy.service.js')

router.get('/', taxanomy.getAllCategories);
router.get('/fee', taxanomy.getTwoLevelCategories);
router.get('/classes/:id', taxanomy.getLevelCategories);
router.get('/emp/classes/:id', taxanomy.getEmpLevelCategories);
router.get('/dept', taxanomy.getDeptCategories);

module.exports = router;