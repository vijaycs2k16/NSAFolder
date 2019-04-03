define([
    'Backbone',
    'Underscore',
    'text!templates/VStudent/list/ListTemplate.html'
], function (Backbone, _, studentListTemplate) {
    'use strict';

    var StudentItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
        },

        render: function () {
            this.$el.append(_.template(studentListTemplate, {
                StudentsCollection: this.collection.toJSON(),
            }));
        }
    });

    return StudentItemView;
});
