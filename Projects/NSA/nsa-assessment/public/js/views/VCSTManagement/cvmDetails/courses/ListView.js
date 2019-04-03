define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/VCSTManagement/cvmDetails/courses/ListTemplate.html',
    'views/VCSTManagement/cvmDetails/courses/EditView',
    'views/VCSTManagement/cvmDetails/courses/CreateView',
    'helpers',
    'helpers/ga',
    'constants/googleAnalytics',
    'common',
    'dataService',
    'vconstants',
    'collections/VCourses/filterCollection'
], function (Backbone, _, $, PaymentMethodList, EditView, CreateView, helpers, ga, GA, common, dataService, constant, FilterCollection) {
    'use strict';

    var ContentView = Backbone.View.extend({
        template  : _.template(PaymentMethodList),
        el        : '#courseTab',
        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.data = jQuery.extend({}, options.collection);

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
            var answer = confirm('Really DELETE items ?!');

            e.preventDefault();

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.DELETE_SHIPPING_METHOD
            });

            if (answer === true && model) {

                model.destroy({
                    success: function (model) {
                        self.$el.find('tr[data-id="' + model.id + '"]').remove();
                        self.collection.remove(id)
                        self.render()
                    },

                    error: function (model, err) {
                        self.collection = new FilterCollection();
                        if (err.status === 403) {
                            App.render({
                                type   : 'error',
                                message: 'You do not have permission to perform this action'
                            });
                        } else if (err.status === 401) {
                            App.render({
                                type   : 'error',
                                message: err.responseText
                            });
                        }
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
            dataService.getData('/permission/tabs', {module : constant.MID.CSTMangement, moduleId: constant.MID.CourseTab}, function (data) {
                var className =  data.data.tab ? 'active' : '';
                $('#course').addClass(className);
                $('#courseTab').addClass(className)
                if(data.data.read) {
                    $('#course').removeClass('hide')
                    $('#courseTab').removeClass('hide')
                } else {
                    $('#course').addClass('hide')
                    $('#courseTab').addClass('hide')
                }
                self.$el.html(self.template({
                    collection      : self.collection.toJSON(),
                    currencySplitter: helpers.currencySplitter,
                    data            : data.data
                }));
                setTimeout(function () {
                common.datatableInitWithoutExport('example')
                }, 100)
            });

            return this;
        }
    });

    return ContentView;
});