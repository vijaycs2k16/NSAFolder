define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/VNotifications/details/others/ListTemplate.html',
    'views/VNotifications/details/others/EditView',
    'views/VNotifications/details/others/CreateView',
    'helpers',
    'helpers/ga',
    'constants/googleAnalytics',
    'common',
    'vconstants',
    'dataService'
], function (Backbone, _, $, PaymentMethodList, EditView, CreateView, helpers, ga, GA, common, constant, dataService) {
    'use strict';

    var ContentView = Backbone.View.extend({
        template  : _.template(PaymentMethodList),
        el        : '#topicsTab',
        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.accesObj = options.accesObj;
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
            if(model.attributes.status == true){
                alert("You can't delete send Notification");
                return;
            }
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
                        if (err.status === 403) {
                            App.render({
                                type   : 'error',
                                message: 'You do not have permission to perform this action'
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
            dataService.getData('/permission', {moduleId: constant.MID.VNotifyOthers}, function (data) {
                self.$el.html(self.template({
                    collection      : self.collection.toJSON(),
                    data: data.data,
                    currencySplitter: helpers.currencySplitter
                }));
                common.datatableInitWithoutExport('example1')

            });
        }

    });

    return ContentView;
});
