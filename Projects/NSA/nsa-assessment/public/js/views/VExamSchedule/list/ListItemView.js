define([
    'Backbone',
    'Underscore',
    'text!templates/VExamSchedule/list/ListTemplate.html',
    'dataService',
    'vconstants'
], function (Backbone, _, ListTemplate, dataService, constant) {
    'use strict';

    var ListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
        },

        render: function () {
            var self = this;
            dataService.getData('/permission', {moduleId: constant.MID.VExamSchedule}, function (data) {
                self.$el.append(_.template(ListTemplate, {
                    collection: self.collection.toJSON(),
                    data: data.data
                }));
            });
            return this;
        }
    });

    return ListItemView;
});
