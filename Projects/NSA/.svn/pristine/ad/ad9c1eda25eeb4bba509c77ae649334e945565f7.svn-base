define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VNotifications/details/TabsTemplate.html',
    'collections/VNotifications/filterCollection',
    'collections/VEmpNotifications/filterCollection',
    'collections/VOtherNotifications/filterCollection',
    'views/VNotifications/details/students/ListView',
    'views/VNotifications/details/employees/ListView',
    'views/VNotifications/details/others/ListView',
    'vconstants'
], function (Backbone, $, _, Parent, DashboardTemplate, StudentCollection, SubjectCollection, TopicCollection, StudentView, SubjectView, TopicView, Constants) {

    var ContentView = Parent.extend({
        contentType: 'Accounts',
        actionType : 'Content',
        template   : _.template(DashboardTemplate),
        el         : '#content-holder',

        initialize: function (options) {
            this.startTime = options.startTime;
            var obj = App.currentUser.profile.profileAccess.filter(function (r) {
                return r.module == Constants.MID['VNotifications'];
            });
            this.accesObj = !_.isEmpty(obj) ? obj[0] : {};
            $('#top-bar').hide();

            this.studentCollection = new StudentCollection();
            this.subjectCollection = new SubjectCollection();
            this.topicCollection = new TopicCollection();

            this.studentCollection.bind('reset', this.renderStudent, this);
            this.subjectCollection.bind('reset', this.renderSubjects, this);
            this.topicCollection.bind('reset', this.renderTopics, this);




            this.render();
        },

        renderStudent: function () {
            new StudentView({
                collection: this.studentCollection,
                accesObj: this.accesObj
            }).render();
        },

        renderSubjects: function () {
            new SubjectView({
                collection: this.subjectCollection,
                accesObj: this.accesObj
            }).render();
        },

        renderTopics: function () {
            new TopicView({
                collection: this.topicCollection,
                accesObj: this.accesObj
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
