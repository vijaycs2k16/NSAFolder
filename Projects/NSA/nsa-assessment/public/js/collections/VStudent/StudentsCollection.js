define([
    'Backbone',
    'collections/parent',
    'models/vStudentModel',
    'constants'
], function (Backbone, Parent, studentModel, CONSTANTS) {
    'use strict';

    var studentCollection = Parent.extend({
        model   : studentModel,
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

        filterByLetter: function (letter) {
            var filtered = this.filter(function (data) {

                return data.get('studentName').first.toUpperCase().startsWith(letter);
            });
 

            return new studentCollection(filtered);
        }
    });
    return studentCollection;
});

