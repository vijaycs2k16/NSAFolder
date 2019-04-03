﻿define([
    'Backbone',
    'Underscore',
    'text!templates/subjectTermTopics/list/ListTemplate.html',
    'moment'
], function (Backbone, _, listTemplate, moment) {
    'use strict';

    var termTopicsItemView = Backbone.View.extend({
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

    return termTopicsItemView;
});
