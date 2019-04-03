/**
 * Created by intellishine on 7/2/2018.
 */
define([
    'Backbone',
    'Underscore',
    'text!templates/BundleReturns/list/listTemplate.html'
], function (Backbone, _, listTemplate) {
    'use strict';

    var ListItemView = Backbone.View.extend({

        el           : '#listTable',
        newCollection: null,
        startNumber  : null,

        initialize: function (options) {
            this.collection = options.collection;
        },

        render: function () {
            var collect = this.collection.toJSON();
            this.$el.append(_.template(listTemplate, {
                collection: collect
            }));
        }
    });

    return ListItemView;
});
