/**
 * Created by Deepa on 7/28/2018.
 */

var express = require('express')
    , router = express.Router()
    , groups = require('../../services/groups/groups.service');

router.get('/:id', groups.getGroupsById);
router.get('/', groups.getGroupsDetails);
router.post('/',  groups.saveUserGroups);
router.put('/:id',  groups.updateUserGroups);
router.delete('/:id', groups.deleteUserGroups);

module.exports = router;
