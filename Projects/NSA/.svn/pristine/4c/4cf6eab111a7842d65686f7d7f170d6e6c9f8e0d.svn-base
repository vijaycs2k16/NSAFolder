define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/VCenter/franchiseCourse/ListTemplate.html',
    'views/VCenter/franchiseCourse/EditView',
    'views/VCenter/franchiseCourse/CreateView',
    'helpers/ga',
    'constants/googleAnalytics',
    'common',
    'dataService',
    'vconstants',

], function (Backbone, _, $, PaymentMethodList, EditView, CreateView, ga, GA, common, dataService, constant) {
    'use strict';

    var ContentView = Backbone.View.extend({
        template  : _.template(PaymentMethodList),
        el        : '#franchiseCourseTab',
        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            
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
           // var model = this.collection.get(id);
            var answer = confirm('Are you sure to delete this entry? ');

            e.preventDefault();
            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.DELETE_PRICE_LISTS
            });

            if (answer === true ) {
                dataService.deleteData('/fcourse/' + id, {}, function (err) {
                    if (!err) {
                        self.$el.find('tr[data-id="' + id + '"]').remove();

                        return App.render({
                            type: 'notify',
                            message:constant.RESPONSES.DELETE_SUCCESS
                        });
                        self.render()
                    }
                });
                /*model.destroy({
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
                });*/
            }
        },

        toggleList: function (e) {
            e.preventDefault();

            this.$el.find('.forToggle').toggle();
        },

        goToEditDialog: function (e) {
            var tr = $(e.target).closest('tr');
            var id = tr.attr('data-id');
            var self = this;

            e.preventDefault();
            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.DELETE_PRICE_LISTS
            });

            dataService.getData('/franchise/getForCenter', {center: id}, function (data) {
                if (!_.isEmpty(data.data)) {
                    return new EditView({data: data.data, center: {_id: id}, collection: self.collection});
                }
            });
        },

        create: function (e) {
            e.preventDefault();
            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.CREATE_PRICE_LISTS
            });

            return new CreateView({collection: this.collection});
        },

        render: function () {
            var self = this;
                dataService.getData('/permission/tabs', {module : constant.MID.VFRANCHISEDETAILS, moduleId: constant.MID.VFRANCHISECOURSES}, function (data) {
                    var className =  data.data.tab ? 'active' : '';
                    $('#franchiseCourse').addClass(className);
                    $('#franchiseCourseTab').addClass(className)
                if(data.data.read) {
                    $('#franchiseCourse').removeClass('hide')
                    $('#franchiseCourseTab').removeClass('hide')
                } else {
                    $('#franchiseCourse').addClass('hide')
                    $('#franchiseCourseTab').addClass('hide')
                }
                dataService.getData('/franchise/getForCenter', {category: 'CENTER'}, function (center) {
                    center = _.map(center.data, function (center) {
                        center.name = center.centerName;
                        return center;
                    });
                    self.$el.html(self.template({
                        collection      : [],
                        data            : center,
                        dataPermission   : data
                    }));
                });
                setTimeout(function () {
                    common.datatableInitWithoutExport('example1')
                }, 500)
            });

            return this;
        }


    });

    return ContentView;
});
