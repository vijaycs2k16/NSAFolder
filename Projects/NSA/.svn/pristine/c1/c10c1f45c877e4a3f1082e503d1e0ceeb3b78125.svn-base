define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/VBatchesManagement/batchDetails/batches/ListTemplate.html',
    'views/VBatchesManagement/batchDetails/batches/EditView',
    'views/VBatchesManagement/batchDetails/batches/CreateView',
    'helpers',
    'helpers/ga',
    'constants/googleAnalytics',
    'common',
    'vconstants',
    'dataService',
    'collections/VBatches/filterCollection'
], function (Backbone, _, $, PaymentMethodList, EditView, CreateView, helpers, ga, GA, common, constant, dataService, FilterCollection) {
    'use strict';

    var ContentView = Backbone.View.extend({
        template  : _.template(PaymentMethodList),
        el        : '#batchTab',
        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.data = jQuery.extend({}, options.collection);
            this.schedule = options.schedule;

            this.collection.bind('add change', this.render, this);

            //this.render();
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
            dataService.getData('/permission/tabs', {module: constant.MID.VBatchesManagement, moduleId: constant.MID.BatchTab}, function (data) {
                var className =  data.data.tab ? 'active' : '';
                if(self.schedule) {
                    className = '';
                }
                $('#batch').addClass(className);
                $('#batchTab').addClass(className)
                if(data.data.read) {
                    $('#batch').removeClass('hide')
                    $('#batchTab').removeClass('hide')
                } else {
                    $('#batch').addClass('hide')
                    $('#batchTab').addClass('hide')
                }
                self.$el.html(self.template({
                    collection       : self.collection.toJSON(),
                    currencySplitter : helpers.currencySplitter,
                    data             : data.data
                }));
                common.datatableInitWithColFilter('example')
            })
            return this;
        }

    });

    return ContentView;
});
