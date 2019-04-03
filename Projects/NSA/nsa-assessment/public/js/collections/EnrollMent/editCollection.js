define([
    'Backbone',
    'collections/parent',
    'models/EnrollMentModel',
    'vconstants',
    'dataService',
    'helpers/getDateHelper',
    'custom',
], function (Backbone, Parent, JournalModel, CONSTANTS, dataService, DateHelper, Custom) {
    'use strict';
    var EmployeesCollection = Parent.extend({
        model   : JournalModel,
        url     : CONSTANTS.URLS.VENROLLMENT,
        pageSize: CONSTANTS.DEFAULT_THUMBNAILS_PER_PAGE,

        initialize: function (options) {
            var page;
            var dateRange;

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            options.error = options.error || _errHandler;
            page = options.page;
            options.count = 10000;

            this.startTime = new Date();

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        },

        showMoreAlphabet: function (options) {
            var that = this;
            var filterObject = options || {};

            that.page = 1;
            filterObject.page = (options && options.page) ? options.page : this.page;
            filterObject.count = (options && options.count) ? options.count : this.namberToShow;
            filterObject.viewType = (options && options.viewType) ? options.viewType : this.viewType;
            filterObject.contentType = (options && options.contentType) ? options.contentType : this.contentType;
            filterObject.filter = options ? options.filter : {};

            this.getFirstPage(filterObject);
        },

        getAlphabet: function (callback) {
            dataService.getData(CONSTANTS.URLS.EMPLOYEES_ALPHABET, {mid: 39}, function (response) {
                if (callback) {
                    callback(response.data);
                }
            });
        }
    });

    return EmployeesCollection;
});
