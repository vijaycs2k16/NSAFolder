define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/testConfiguration/list/ListHeader.html',
    'views/testConfiguration/CreateView',
    'views/testConfiguration/list/ListItemView',
    'models/testConfigurationModel',
    'collections/testConfiguration/filterCollection',
    'vconstants',
    'views/testConfiguration/EditView',
    'helpers/ga',
    'constants/googleAnalytics',
    'dataService',
    'common'
], function (Backbone, $, _, ListViewBase, listTemplate, CreateView, ListItemView, CurrentModel, contentCollection, CONSTANTS, EditView, ga, GA, dataService, common) {
    'use strict';

    var testConfigView = ListViewBase.extend({
        CreateView   : CreateView,
        viewType     : 'list',
        responseObj  : {},
        listTemplate : listTemplate,
        ListItemView : ListItemView,
        contentType  : CONSTANTS.TESTCONFIGURATION,
        changedModels: {},

        initialize: function (options) {
            this.CurrentModel = CurrentModel;
            this.startTime = options.startTime;
            this.contentCollection = contentCollection;
            this.collection = options.collection;
            this.data = jQuery.extend({}, options.collection);
            ListViewBase.prototype.initialize.call(this, options);
            this.render();
        },

        events: {
            'click .goToEdit'    : 'gotoEditDialog',
            'click .goToRemove'  : 'deleteItem',
            'click .status'      : 'changeScheduledStatus'
        },

        gotoEditDialog: function (e) {
            var id = $(e.target).closest('tr').data('id');
            var model = this.collection.getElement(id);

            if (!model) {
                return;
            }

            App.ownContentType = true;
            return new EditView({model: model});
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
                        self.collection.remove(id);
                        self.render();
                    },

                    error: function (model, err) {
                        self.collection = new contentCollection();
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

        changeScheduledStatus: function (e) {
            var selectedVal = $(e.target).data('value');
            var configId = $(e.target).closest('tr').attr('data-id');
            var self = this;
            var obj = { isSchedule: selectedVal };
            var scheduleMsg = (selectedVal == true ? confirm('Are you sure want to Schedule the Test Configuration ?') : confirm('Do want to UnSchedule the Test Configuration ?'));

            if(scheduleMsg) {
                dataService.putData('/testConfiguration/status/' + configId, obj, function (err) {
                    if (err) {
                        self.errorNotification(err);
                    } else {
                        return App.render({
                            type: 'notify',
                            message: 'Updated Successfully'
                        })
                    }
                });
            } else {
                self.refreshPage();
                return false;
            }
            self.refreshPage();
        },

        refreshPage: function() {
            Backbone.history.fragment = '';
            Backbone.history.navigate(window.location.hash, {trigger: true});
        },

        render: function () {
            var $currentEl = this.$el;
            $('.ui-dialog ').remove();

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate));
            $currentEl.append(new ListItemView({
                collection  : this.collection,
                page        : this.page,
                itemsNumber : this.collection.numberToShow
            }).render());

            setTimeout(function () {
                common.datatableInitWithoutExport('exampleTC')
            }, 100);

            return this;
        }
    });

    return testConfigView;
});