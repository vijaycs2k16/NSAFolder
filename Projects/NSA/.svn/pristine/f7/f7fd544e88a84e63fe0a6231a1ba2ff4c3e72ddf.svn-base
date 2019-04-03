define([
    'Backbone',
    'Underscore',
    'text!templates/VAssessment/questionBank/list/ListTemplate.html',
    'helpers',
    'vconstants',
    'moment'
], function (Backbone, _, listTemplate, helpers, CONSTANTS, moment) {
    var OrderListItemView = Backbone.View.extend({
        el: '#listTable',

        initialize: function (options) {
            this.collection = options.collection;
            this.startNumber = (parseInt(this.collection.currentPage, 10) - 1) * this.collection.pageSize; // Counting the start index of list items
        },

        render: function () {
            this.$el.append(_.template(listTemplate, {
                collection        : this.collection.toJSON(),
                startNumber       : this.startNumber,
                moment            : moment
            }));
        }
    });

    return OrderListItemView;
});
