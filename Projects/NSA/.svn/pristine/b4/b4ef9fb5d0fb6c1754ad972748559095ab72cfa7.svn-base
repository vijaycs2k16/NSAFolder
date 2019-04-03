define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VCenter/TabsTemplate.html',
    'collections/VCenter/franchise/filterCollection',
    'collections/VCenter/franchiseCourse/filterCollection',
    'views/VCenter/franchise/ListView',
    'views/VCenter/franchiseCourse/ListView',
], function (Backbone, $, _, Parent, DashboardTemplate, FranchiseCollection, FranchiseCourseCollection, FranchiseView, FranchiseCourseView) {

    var ContentView = Parent.extend({
        contentType: 'Accounts',
        actionType : 'Content',
        template   : _.template(DashboardTemplate),
        el         : '#content-holder',

        initialize: function (options) {
            this.startTime = options.startTime;
            $('#top-bar').hide();

            this.franchiseCollection = new FranchiseCollection();
            this.franchiseCourseCollection = new FranchiseCourseCollection();

            this.franchiseCollection.bind('reset', this.renderFranchise, this);
            this.franchiseCourseCollection.bind('reset', this.renderFranchiseCourse, this);

            this.render();
        },

        renderFranchise: function () {
            new FranchiseView({
                collection: this.franchiseCollection
            }).render();
        },

        renderFranchiseCourse: function () {
            new FranchiseCourseView({
                collection: this.franchiseCourseCollection
            }).render();
        },

        render: function () {
            var formString = this.template();

            this.$el.html(formString);

            return this;
        }

    });

    return ContentView;
});
