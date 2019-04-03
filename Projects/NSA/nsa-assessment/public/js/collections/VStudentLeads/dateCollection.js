define([
    'Backbone',
    'collections/parent',
    'Underscore',
    'models/VStudentLeadsModel',
    'common',
    'constants',
    'helpers/getDateHelper',
    'custom'
], function (Backbone, Parent, _, EmployeeModel, common, CONSTANTS, DateHelper, Custom) {
    'use strict';

    var EmployeesCollection = Parent.extend({
        model   : EmployeeModel,
        url     : 'vStudentLeads',
        pageSize: CONSTANTS.DEFAULT_THUMBNAILS_PER_PAGE,
        contentType : 'VStudentLeads',

        initialize: function (options) {
            var dateRange;
            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }


            this.filter = options.filter || Custom.retriveFromCash('VStudentLeads.filter');

            dateRange = this.filter && this.filter.date ? this.filter.date.value : null;

            dateRange = dateRange || DateHelper.getDate('thisWeek');

            this.startDate = new Date(dateRange[0]);
            this.endDate = new Date(dateRange[1]);

            options.filter = this.filter || {};

            options.filter.date = {
                value: [this.startDate, this.endDate]
            };

            Custom.cacheToApp('VStudentLeads.filter', options.filter);


            options = options || {};
            options.contentType = 'VStudentLeads'
            options.error = options.error || _errHandler;

            this.startTime = new Date();

            this.getFirstPage(options);
        },

        parse: function (response) {
            if (response.data) {
                if (response.data.next7days) {
                    _.map(response.data.next7days, function (employee) {
                        employee.dueDate = common.utcDateToLocaleDate(employee.dueDate, true);
                        return employee;
                    });
                }

                if (response.data.overdue) {
                    _.map(response.data.overdue, function (employee) {
                        employee.dueDate = common.utcDateToLocaleDate(employee.dueDate);
                        return employee;
                    });
                }
                if (response.data.today) {
                    _.map(response.data.today, function (employee) {
                        employee.dueDate = common.utcDateToLocaleHours(employee.dueDate);
                        return employee;
                    });
                }
            }

            return Parent.prototype.parse.apply(this, arguments);
        }
    });

    return EmployeesCollection;
});