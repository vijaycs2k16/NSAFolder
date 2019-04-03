﻿define([
        'Backbone',
        'collections/parent',
        'models/LeadsModel',
        'vconstants',
        'helpers/getDateHelper',
        'custom'
    ],
    function (Backbone, Parent, LeadsModel, CONSTANTS, DateHelper, Custom) {
        'use strict';

    var LeadsCollection = Parent.extend({
        model   : LeadsModel,
        url     : CONSTANTS.URLS.LEADS,
        pageSize: CONSTANTS.DEFAULT_ELEMENTS_PER_PAGE,
        //page        : null,
        //namberToShow: null,
        //contentType : null,

        initialize: function (options) {
            var page;
            var dateRange;

            function _errHandler(models, xhr) {
                if (xhr.status === 401) {
                    Backbone.history.navigate('#login', {trigger: true});
                }
            }
            var viewType =  Custom.getCurrentVT();
            if(viewType == 'thumbnails') {
                viewType = 'list'
            }
            options.viewType = viewType;
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
            options.error = options.error || _errHandler;
            page = options.page;

            this.startTime = new Date();

            if (page) {
                return this.getPage(page, options);
            }

            this.getFirstPage(options);
        }

        /*initialize: function (options) {
         this.startTime = new Date();
         var that = this;
         this.namberToShow = options.count;
         this.viewType = options.viewType;
         this.contentType = options.contentType;
         this.count = options.count;
         this.page = options.page || 1;

         /!*if (options && options.viewType) {
         this.url += options.viewType;
         }*!/

         this.fetch({
         data   : options,
         reset  : true,
         success: function () {
         that.page++;
         },
         error  : function (models, xhr) {
         if (xhr.status == 401) {
         Backbone.history.navigate('#login', {trigger: true});
         }
         }
         });
         },

         showMore: function (options) {
         var that = this;
         var filterObject = {};

         if (options) {
         for (var i in options) {
         filterObject[i] = options[i];
         }
         }
         if (options && options.page) {
         this.page = options.page;
         }
         if (options && options.count) {
         this.namberToShow = options.count;
         }
         filterObject['page'] = this.page;
         filterObject['count'] = this.namberToShow;
         filterObject['filter'] = (options) ? options.filter : {};
         filterObject['contentType'] = (options && options.contentType) ? options.contentType : this.contentType;
         this.fetch({
         data   : filterObject,
         waite  : true,
         success: function (models) {
         that.page++;
         that.trigger('showmore', models);
         },
         error  : function () {
         App.render({
         type   : 'error',
         message: "Some Error."
         });
         }
         });
         },
         parse   : function (response) {
         return response.data;
         }*/
    });
    return LeadsCollection;
});