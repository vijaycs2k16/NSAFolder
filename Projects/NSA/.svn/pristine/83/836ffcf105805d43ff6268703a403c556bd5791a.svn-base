define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VBatchesManagement/batchDetails/TabsTemplate.html',
    'collections/VBatches/filterCollection',
    'collections/VBatchSchedule/filterCollection',
    'collections/SubjectSchedule/filterCollection',
    'collections/ClassSchedule/filterCollection',
    'collections/OffLineSchedule/filterCollection',
    'views/VBatchesManagement/batchDetails/batches/ListView',
    'views/VBatchesManagement/batchDetails/batchSchedule/ListView',
    'views/VBatchesManagement/batchDetails/subjectSchedule/ListView',
    'views/VBatchesManagement/batchDetails/offLineSchedule/ListView',
    'views/VBatchesManagement/batchDetails/classSchedule/ListView'
], function (Backbone, $, _, Parent, BatchTemplate, BatchesCollection, BatchesScheduleCollection, subjectScheduleCollection, classScheduleCollection, offlineScheduleCollection ,BatchView, BatchScheduleView, SubjectScheduleView, offlineScheduleView, classScheduleView) {

    var ContentView = Parent.extend({
        contentType: 'Accounts',
        actionType : 'Content',
        template   : _.template(BatchTemplate),
        el         : '#content-holder',

        initialize: function (options) {
            this.startTime = options.startTime;

            $('#top-bar').hide();

            this.batchCollection = new BatchesCollection();
            this.batchScheduleCollection = new BatchesScheduleCollection();
            this.subjectScheduleCollection = new subjectScheduleCollection();
            this.classScheduleCollection = new classScheduleCollection();
            this.offlineScheduleCollection = new offlineScheduleCollection();

            this.batchCollection.bind('reset', this.renderBatch, this);
            this.batchScheduleCollection.bind('reset', this.renderBatchSchedule, this);
            this.classScheduleCollection.bind('reset', this.renderClassSchedule, this);
            this.subjectScheduleCollection.bind('reset', this.renderSubjectSchedule, this);
            this.offlineScheduleCollection.bind('reset', this.renderofflineSchedule, this);
            this.schedule = options.schedule ? options.schedule  : false

            this.render();
        },

        renderBatch: function () {
            new BatchView({
                collection: this.batchCollection,
                schedule : this.schedule
            }).render();
        },

        renderBatchSchedule: function () {
            new BatchScheduleView({
                collection: this.batchScheduleCollection,
                schedule : this.schedule
            }).render();
        },

        renderSubjectSchedule: function () {
            new SubjectScheduleView({
                collection: this.subjectScheduleCollection,
                schedule : this.schedule
            }).render();

        },

        renderClassSchedule: function () {
            new classScheduleView({
                collection: this.classScheduleCollection,
                schedule : this.schedule
            }).render();

        },

        renderofflineSchedule: function () {
            new offlineScheduleView({
                collection: this.offlineScheduleCollection,
                schedule : this.schedule
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
