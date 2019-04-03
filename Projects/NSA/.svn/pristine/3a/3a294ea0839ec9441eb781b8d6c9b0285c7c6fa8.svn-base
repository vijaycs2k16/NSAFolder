define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VCSTManagement/cvmDetails/TabsTemplate.html',
    'collections/VCourses/filterCollection',
    'collections/VTitle/filterCollection',
    'collections/VSubject/filterCollection',
    'collections/VTopics/filterCollection',
    'collections/RelatedStatuses/RelatedStatusesCollection',
    'collections/VSubjectTopics/filterCollection',
    'views/VCSTManagement/cvmDetails/courses/ListView',
    'views/VCSTManagement/cvmDetails/title/ListView',
    'views/VCSTManagement/cvmDetails/subjects/ListView',
    'views/VCSTManagement/cvmDetails/topics/ListView',
    'views/VCSTManagement/cvmDetails/subtopics/ContentView',
    'views/VCSTManagement/cvmDetails/subjecttopics/ListView',
], function (Backbone, $, _, Parent, DashboardTemplate, CourseCollection, TitleCollection, SubjectCollection, TopicCollection, subTopicCollection, SubjectTopicsCollection, CourseView, TitleView, SubjectView, TopicView, subTopicView, SubjectTopicView) {

    var ContentView = Parent.extend({
        contentType: 'Accounts',
        actionType : 'Content',
        template   : _.template(DashboardTemplate),
        el         : '#content-holder',

        initialize: function (options) {
            this.startTime = options.startTime;

            $('#top-bar').hide();

            //this.courseCollection = new CourseCollection();
            this.titleCollection = new TitleCollection();
            this.subjectCollection = new SubjectCollection();
            this.subTopicCollection = new subTopicCollection();
            //this.topicCollection = new TopicCollection();
            this.subjectTopicCollection = new SubjectTopicsCollection();


            //this.courseCollection.bind('reset', this.renderCourse, this);
            this.titleCollection.bind('reset', this.renderTitle, this);
            this.subjectCollection.bind('reset', this.renderSubjects, this);
            //this.topicCollection.bind('reset', this.renderTopics, this);
            this.subTopicCollection.bind('reset', this.rendersubTopics, this);
            this.subjectTopicCollection.bind('reset', this.renderSubjectTopics, this);

            this.render();
        },

        /*renderCourse: function () {

            new CourseView({
                collection: this.courseCollection
            }).render();
        },*/

        renderTitle: function () {
            new TitleView({
                collection: this.titleCollection
            }).render();
        },

        renderSubjects: function () {

            new SubjectView({
                collection: this.subjectCollection
            }).render();
        },

        /*renderTopics: function () {
            new TopicView({
                collection: this.topicCollection,
            }).render();
        },*/
        rendersubTopics: function () {
            new subTopicView({
                collection: this.subTopicCollection,
            }).render();
        },


        renderSubjectTopics: function () {
            new SubjectTopicView({
                collection: this.subjectTopicCollection,
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