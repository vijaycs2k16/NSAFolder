define([
    'Backbone',
    'collections/parent',
    'models/vStudentModel',
    'dataService',
    'vconstants'
], function (Backbone, Parent, StudentModel, dataService, CONSTANTS) {
    'use strict';

    var StudentCollection = Parent.extend({
        model   : StudentModel,
        url     : CONSTANTS.URLS.VSTUDENTDETAILS,
        pageSize: CONSTANTS.DEFAULT_THUMBNAILS_PER_PAGE,

        initialize: function (options) {
            var page;

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }

            options = options || {};
            options.error = options.error || _errHandler;
            page = options.page;

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
            console.info('getAlphabet');
            dataService.getData(CONSTANTS.URLS.VSTUDENTS_ALPHABET, {mid: 39}, function (response) {
                if (callback) {
                    callback(response.data);
                }
            });
        }
    });

    return StudentCollection;
});
