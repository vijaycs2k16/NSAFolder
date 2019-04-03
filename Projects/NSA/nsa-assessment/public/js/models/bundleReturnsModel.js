/**
 * Created by intellishine on 7/2/2018.
 */
define([
    'Backbone',
    'constants',
    'moment'
], function (Backbone, CONSTANTS, moment) {

    var bundleReturnsModel = Backbone.Model.extend({
        idAttribute: '_id',

        urlRoot: function () {
            return CONSTANTS.URLS.BUNDLERETURNS;
        },

        parse: function (response) {
            if (!response.data) {
                if (response.createdBy) {
                    response.createdBy.date = moment(response.createdBy.date).format('DD MMM, YYYY, H:mm:ss');
                }

                return response;
            }
        }
    });
    return bundleReturnsModel;

});
