define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VExam/exam/TabsTemplate.html',
    'collections/VExamConfig/filterCollection',
    'collections/VPaperConfig/filterCollection',
    'views/VExam/exam/examConfig/ListView',
    'views/VExam/exam/paperConfig/ListView',
], function (Backbone, $, _, Parent, TabsTemplate, ExamConfigCollection, PaperConfigCollection, examConfigView, paperConfigView) {

    var ContentView = Parent.extend({
        contentType: 'Exam',
        actionType : 'Content',
        template   : _.template(TabsTemplate),
        el         : '#content-holder',

        initialize: function (options) {
            this.startTime = options.startTime;

            $('#top-bar').hide();
            this.examConfigCollection = new ExamConfigCollection();
            this.paperConfigCollection = new PaperConfigCollection();

            this.examConfigCollection.bind('reset', this.renderExamConfig, this);
            this.paperConfigCollection.bind('reset', this.renderPaperConfig, this);
            this.paper = options.paper ? true : false



            this.render();
        },

        renderExamConfig: function () {
            new examConfigView({
                collection: this.examConfigCollection
            }).render();
        },

        renderPaperConfig: function () {
            new paperConfigView({
                collection: this.paperConfigCollection
            }).render();
        },

        render: function () {
            var formString = this.template({
                paper: this.paper
            });

            this.$el.html(formString);

            return this;
        }

    });

    return ContentView;
});
