define([
    'Backbone',
    'jQuery',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/VExamSchedule/ExamPaperTemplate.html',
    'dataService',
    'populate',
    'common',
    'moment',
    'vconstants',
    'views/VExamSchedule/ExamPaperTopBarView',
    'libs/dlx-quiz',
    'libs/countdowntimer',
    'libs/ckeditor/samples/js/sample'
], function (Backbone, $, _, Parent, orgTemplate, dataService, populate, common, moment, constants, topBarView) {
    'use strict';

    var ContentView = Parent.extend({
        contentType: 'ExamPaper',
        actionType : 'Content',
        template   : _.template(orgTemplate),
        el         : '#wrapper',

        initialize : function (options) {
            var self = this;
            this.startTime = options.startTime;

            if (options.collection && options.modelId) {
                this.studentCollection = options.collection;
                this.currentModel = this.studentCollection.get(options.modelId)
            } else {
                this.currentModel = options.model;
            }

            this.topbarView = new topBarView({
                actionType  : 'Content',
                hideNavigate: true
            });

            this.render(options);
        },

        events: {
            'click .updateBtn'    : 'updateItem',
            'click .checkbox'   : 'checked',
            'click .backBtn'   : 'backEnrollment',
            'click #ansData'   : 'updateAnswer',
            'click .results'   : 'showResult'
        },
        checked : function(e) {
            var value = $(e.target).val();

        },
        updateItem: function () {
            var self = this;
            var thisEl = this.$el;
            var data = {};
            var currentData = this.currentModel.toJSON();
            this.currentModel.save(data, {
                put   : true,
                wait   : true,
                success : function (result) {
                },
                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
            Backbone.history.loadUrl(Backbone.history.getFragment());
        },
        chooseOption: function (e) {
            var $thisEl = this.$el;
            var $target = $(e.target);
            var valueId = $target.attr('id');

            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

        },

        updateAnswer: function(e){
            if($(e.target).val()){
                console.log("sycbcssssss")
                var value = JSON.parse($(e.target).val());
                value.config = this.currentModel.toJSON().config;
                if (value.examScheduleId) {
                    dataService.putData('/vAssessment/exam/student/'+ value.examScheduleId, value, function (err, result) {
                    });
                }
                if(value.lastQue){
                    dataService.putData('/vAssessment/exam/student/result/'+ this.currentModel.toJSON().id, {}, function (data) {
                        console.info('totalScore.lastQue',data);
                        if(data){
                            var text = 'Total score : ' + data.data;
                            $('.totalScore').append(text);
                        }
                    });
                }
            }

        },

        render: function (options) {
            var self = this;
            var $thisEl = this.$el;
            $('#time-out').removeClass("hide")
            dataService.getData('/vAssessment/exam/'+ self.currentModel.toJSON().id, {}, function (response) {
                _.map(self.currentModel.toJSON().paperConfig.questions, function(value){
                    value['examScheduleId'] = self.currentModel.toJSON().id;
                    value['q'] = value.form[0].desc;
                    value['options'] = value.form[0].ans;
                    value['subjectId'] = value.subject;
                    value['ans'] = _.find(value.form[0].ans, function (val) {
                        if (val.isValid) {
                            return val._id;
                        }
                    });
                    value['aid'] = value['ans']._id;
                    value['a']  = _.find(value.form[0].ans, function (val) {
                        if (val.isValid) {
                            return val.desc;
                        }
                    })
                })
                var formString = self.template({
                    model           : self.currentModel.toJSON()
                });
                console.log("this.currentModel.toJSON()", self.currentModel.toJSON())
                self.$el.html(formString);
                $("#quiz1").dlxQuiz({
                    quizData: {
                        "examSchedule": self.currentModel.toJSON(),
                        "questions":  self.currentModel.toJSON().paperConfig.questions
                    }
                });
                var duration = self.currentModel.toJSON().config.duration;
                self.displayTime(duration);
            })

            return this;
        },
        displayTime: function(duration){
            $("#future_date").countdowntimer({
		         minutes : parseInt(duration),
                 seconds : 0,
                 size : "lg",
            })
        },
        backEnrollment: function () {
            var url = 'erp/' + 'VExamSchedule';
            Backbone.history.navigate(url, {trigger: true});
        },
        showResult: function(){
            $('.ctrlDone').removeClass("disabled")
            $('.ctrlDone').click();
            $('.quiz').removeClass("hide")
        }

    });

    return ContentView;
});
