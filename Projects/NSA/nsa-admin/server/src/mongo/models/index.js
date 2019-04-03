var models = require('@nsa/nsa-assessment');

module.exports = (function () {
    //For NSA Start
    require('./school_notification');
    require('./school_media_usage_log');
    require('./school_attendance');
    require('./school_attendance_details');
    require('./school_assignment');
    require('./school_assignment_details');
    //For NSA End

})();
