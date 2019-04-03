define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/VBatchesManagement/batchDetails/batchSchedule/ListTemplate.html',
    'views/VBatchesManagement/batchDetails/batchSchedule/CreateView',
    'views/VBatchesManagement/batchDetails/batchSchedule/EditView',
    'helpers',
    'moment',
    'helpers/ga',
    'constants/googleAnalytics',
    'common',
    'dataService',
    'vconstants',
    'collections/VBatchSchedule/filterCollection',
], function (Backbone, _, $, PaymentMethodList, CreateView, EditView, helpers, moment, ga, GA, common, dataService, constant, BatchesScheduleCollection) {
    'use strict';

    var ContentView = Backbone.View.extend({
        template  : _.template(PaymentMethodList),
        el        : '#scheduleTab',
        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.schedule = options.schedule;
            this.batchScheduleCollection = new BatchesScheduleCollection();

            this.collection.bind('add change', this.render, this);

            this.render();
        },

        events: {
            'click .goToEdit'         : 'goToEditDialog',
            'click .goToRemove'       : 'deleteItem',
            'click #top-bar-createBtn': 'create',
            'click .toggleList'       : 'toggleList'
        },

        deleteItem: function (e) {

            var tr = $(e.target).closest('tr');
            var id = tr.attr('data-id');
            var cName = tr.attr('data-val');
            var index = id.indexOf("-");
            var cId = id.substr(0, index);
            var classDate = id.substr(index + 1);
            var self = this;
            var model = self.collection.get(id);
            var answer = confirm('Really DELETE items ?!');
            e.preventDefault();

            if (answer === true) {
                dataService.deleteData('/vbatchSchedule/date', {center: cId, classDate: classDate}, function (err) {
                    if (!err) {
                       // Backbone.history.navigate(window.location.hash + '?schedule=schedule', {trigger: true, replace: true});
                        self.collection = new BatchesScheduleCollection();
                        self.collection.bind('reset', self.render, self);
                    }
                });
            }
        },
        toggleList: function (e) {
            e.preventDefault();

            this.$el.find('.forToggle').toggle();
        },

        goToEditDialog: function (e) {
            var tr = $(e.target).closest('tr');
            var id = tr.attr('data-id');
            var cName = tr.attr('data-val');
            var index = id.indexOf("-");
            var cId = id.substr(0, index);
            var classDate = id.substr(index + 1);
            var self = this;
            e.preventDefault();
            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.EDIT_SHIPPING_METHOD
            });
            dataService.getData('/vbatchSchedule/date', {center: cId, classDate: classDate}, function (data) {
                if (!_.isEmpty(data.data)) {
                    return new EditView({model: data.data, center: {_id: cId, centerName: cName, classDate: classDate}, collection: self.collection, permission: self.permissionObj});
                }
            });

        },

        create: function (e) {
            e.preventDefault();

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.CREATE_SHIPPING_METHOD
            });

            return new CreateView({collection: this.collection});
        },

        render: function () {
            var self = this;
            dataService.getData('/permission/tabs', {module : constant.MID.VBatchesManagement,moduleId: constant.MID.BatchSchedule}, function (data) {
                self.permissionObj = data.data;
                var className =  (data.data.tab || self.schedule == 'schedule') ? 'active' : '';
                $('#schedule').addClass(className);
                $('#scheduleTab').addClass(className)
                if(data.data.read) {
                    $('#schedule').removeClass('hide')
                    $('#scheduleTab').removeClass('hide')
                } else {
                    $('#schedule').addClass('hide')
                    $('#scheduleTab').addClass('hide')
                }
                self.$el.html(self.template({collection: self.collection.toJSON(),
                    currencySplitter: helpers.currencySplitter,
                    moment: moment,
                    data: data.data}));
                setTimeout(function () {
                    common.datatableInitWithColFilter('example1')
                }, 100)
                return this;

            });
        }
    });

    return ContentView;
});
