define([
    'Backbone',
    'jQuery',
    'dataService',
    'moment',
], function (Backbone, $, dataService, moment) {
    'use strict';

    var tableExports = function (event) {
        $('#' + event).tableExport({
                  formats: ['xlsx', 'xls', 'csv']
               });
    }


    return {
        tableExports     : tableExports
    }
});
