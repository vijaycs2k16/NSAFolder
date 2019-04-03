define([
    'Backbone',
    'Underscore',
    'text!templates/testConfiguration/list/ListTemplate.html',
    'moment'
], function (Backbone, _, listTemplate, moment) {
    'use strict';

    var congigItemView = Backbone.View.extend({
        el           : '#listTable',
        newCollection: null,
        startNumber  : null,

        initialize: function (options) {
            this.collection = options.collection;
        },

        render: function () {
            var collection = this.collection.toJSON();
            this.$el.append(_.template(listTemplate, {
                collection : collection,
                moment     : moment
            }));
        }
    });

    return congigItemView;
});
