/**
 * Created by bharatkumarr on 14/07/17.
 */

'use strict';
module.exports = function(app) {
    var service = require('./service');

    app.route('/tracking')
        .post(service.tracking);

    app.route('/tracking/reset')
        .get(service.reset);

    app.route('/processor/prepare/')
        .get(service.preparation);

    app.route('/vehicle/:id/')
        .get(service.vehicleUsers);

    app.route('/notification')
        .post(service.sendNotification);
};