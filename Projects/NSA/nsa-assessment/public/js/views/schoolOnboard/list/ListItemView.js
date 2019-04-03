define([
    'Backbone',
    'Underscore',
    'text!templates/schoolOnboard/list/ListTemplate.html',
    'moment'
], function (Backbone, _, listTemplate, moment) {
    'use strict';

    var schoolOnboardListItemView = Backbone.View.extend({

        el           : '#listTable',
        newCollection: null,
        startNumber  : null,

        initialize: function (options) {
            this.collection = options.collection;
        },
        render: function () {
            var collect = this.collection.toJSON();
            this.$el.append(_.template(listTemplate, {
                collection: collect,
                moment    : moment
            }));
        }
    });

    return schoolOnboardListItemView;
});
