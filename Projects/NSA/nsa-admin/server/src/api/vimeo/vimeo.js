/**
 * Created by kiranmai on 9/5/17.
 */

var express = require('express')
    , router = express.Router()
    , vimeo = require('../../services/vimeo/vimeo.service');

router.get('/:id', vimeo.getVideo);

module.exports = router;