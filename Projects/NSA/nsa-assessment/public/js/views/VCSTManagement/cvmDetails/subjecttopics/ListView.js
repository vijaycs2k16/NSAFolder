define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/VCSTManagement/cvmDetails/subjecttopics/ListTemplate.html',
    'views/VCSTManagement/cvmDetails/subjecttopics/EditView',
    'views/VCSTManagement/cvmDetails/subjecttopics/CreateView',
    'helpers',
    'helpers/ga',
    'constants/googleAnalytics',
    'common',
    'dataService',
    'vconstants',
    'collections/VSubjectTopics/filterCollection',
], function (Backbone, _, $, PaymentMethodList, EditView, CreateView, helpers, ga, GA, common, dataService, constant, BatchesScheduleCollection) {
    'use strict';

    var ContentView = Backbone.View.extend({
        template  : _.template(PaymentMethodList),
        el        : '#subjectTopicsTab',
        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.subjectTopicCollection= new BatchesScheduleCollection();

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
            var self = this;
            var tr = $(e.target).closest('tr');
            var id = tr.attr('data-id');
            var model = this.collection.get(id);
            var topicId =  model.attributes.topics;
            var answer = confirm('Are you sure to delete this entry?');

            e.preventDefault();

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel: GA.EVENT_LABEL.DELETE_SHIPPING_METHOD
            });

            if (answer === true && model) {
                dataService.deleteData('/vSubject/topics/' + id, {topic: topicId}, function (err, result) {
                    if (!err) {
                        self.$el.find('tr[data-id="' + id + '"]').remove();
                        self.collection = new BatchesScheduleCollection();
                        self.collection.bind('reset', self.render, self);

                        return App.render({
                            type: 'notify',
                            message: "topic deleted successfully"
                        });
                    }
                    else{
                        if (err.status === 401) {
                            App.render({
                                type   : 'error',
                                message: err.responseText
                            });
                        }
                    }
                })
            }
        },

        toggleList: function (e) {
            e.preventDefault();

            this.$el.find('.forToggle').toggle();
        },

        goToEditDialog: function (e) {
            var tr = $(e.target).closest('tr');
            var id = tr.attr('data-id');
            var model = this.collection.get(id);

            e.preventDefault();
            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.EDIT_SHIPPING_METHOD
            });

            if (model) {
                return new EditView({model: model, collection: this.collection});
            }
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
            dataService.getData('/permission/tabs', {module : constant.MID.CSTMangement, moduleId: constant.MID.VSubjectTopics}, function (data) {
                var className =  data.data.tab ? 'active' : '';
                $('#subjectTopics').addClass(className);
                $('#subjectTopicsTab').addClass(className)
                if(data.data.read) {
                    $('#subjectTopics').removeClass('hide')
                    $('#subjectTopicsTab').removeClass('hide')
                } else {
                    $('#subjectTopics').addClass('hide')
                    $('#subjectTopicsTab').addClass('hide')
                }
                self.$el.html(self.template({
                    collection      : self.collection.toJSON(),
                    currencySplitter: helpers.currencySplitter,data: data.data,
                }));
                setTimeout(function () {
                    common.datatableInitWithoutExport('example4')
                }, 100)
            });

            return this;
        }

    });

    return ContentView;
});