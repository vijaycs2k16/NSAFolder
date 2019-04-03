define([
    'Backbone',
    'jQuery',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/VPracticeExam/CreateTemplate.html',
    'models/vPaperConfigModel',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'helpers',
    'dataService',
    'services/examManagment',
    'moment',
    'Lodash'
], function (Backbone, $, _, Parent, template, Model, populate, CONSTANTS, keyValidator, helpers, dataService, examManagmentService, moment,lodash) {
    'use strict';

    var createView = Parent.extend({
        template   : _.template(template),
        contentType: 'PaperConfiguration',

        initialize : function (options) {
            options = options || {};
            this.bundleObj = {};

            _.bindAll(this, 'render', 'saveItem','generateQuestions');

            this.currentModel = new Model();

            this.collection = options.collection;

            this.responseObj = {};

            this.render();
        },

        events: {
            'keypress #price'            : 'keypressHandler',
            'click ._circleRadioRadiance': 'checked',
            'change .productCategory'    : 'changeSubject',
            'click .itemForBundle'       : 'addToBundle',
            'click .removeBundle'        : 'removeBundle',
            'click .workflow-sub'        : 'chooseWorkflowDetailes',
            'click .workflow-list li'    : 'chooseWorkflowDetailes',
            'keyup .enterQuestions'      : 'weightageSelectedQuestions',
            'click ._formBlock'          : 'hideSelect',
            'keyup #questions'           : 'noQuestions',
        },

        checked : function(e) {
            var value = $(e.target).val();
            $('.saveBtn').removeClass('hide');
            this.questionMode = value;
            this.setValues();
            $('.generatedQuestions').addClass('hide');
            if(!this.data.course || this.data.course === 'Select'){
                return App.render({
                    type   : 'error',
                    message: "Please Select course."
                });
            }
            if(_.isEmpty(this.data.subject)){
                return App.render({
                    type   : 'error',
                    message: "Please Select subject."
                });
            }
            if(_.isEmpty(this.data.topic)){
                return App.render({
                    type   : 'error',
                    message: "Please Select topic."
                });
            }

            if(!this.data.num){
                return App.render({
                    type   : 'error',
                    message: "Please enter no of questions."
                });
            }

            if(value == 'ManualQuestions'){
                $('.randomQuestions').addClass('hide');
                $('.weightQuestions').addClass('hide');
                $('.manualQuestions').removeClass('hide');
                $('.generateQue').addClass('hide');
                this.getManualQuestions();
            }else if(value == 'WeightageBase'){
                $('.saveBtn').addClass('hide');
                $('.randomQuestions').addClass('hide');
                $('.manualQuestions').addClass('hide');
                $('.weightQuestions').removeClass('hide');
                this.getWeightageQuestions();
                $('.generateQue').removeClass('hide');
            }else if(value == 'Random'){
                $('.manualQuestions').addClass('hide');
                $('.weightQuestions').addClass('hide');
                $('.randomQuestions').removeClass('hide');
                this.randomQuestions();
                $('.generateQue').addClass('hide');
            }
        },

        resetExamMode: function(){
            $('.randomQuestions').addClass('hide');
            $('.weightQuestions').addClass('hide');
            $('.manualQuestions').addClass('hide');
            $('.generatedQuestions').addClass('hide');
            if(this.questionMode){
                $('#'+this.questionMode).prop('checked', false);
            }
        },

        hideSelect: function(e) {
            $('.newSelectList').hide();
        },

        addToBundle: function (e) {
            var $thisEl = this.$el;
            var $target = $(e.target).closest('li');
            var $container = $thisEl.find('#productsBundle');
            var val = $target.text();
            var id = $target.data('id');
            this.setValues();
            if (Object.keys(this.bundleObj).length) {
                this.bundlesValues();
            }
            this.selectQuestion = this.selectQuestion ? this.selectQuestion : [];
            if(parseInt(this.data.num) > this.selectQuestion.length){
                if (Object.keys(this.bundleObj).indexOf(id) >= 0) {
                    return;
                }
                this.bundleObj[id] = '0';
                $container.append('<div class="bundle _bundle" data-id="' + id + '">' + val + '<div class="_editConteiner"><span class="removeBundle _actionCircleBtn icon-close3"></span></div></div>');
            }else {
                return App.render({
                    type   : 'error',
                    message: "No of Questions limit exceeded."
                });
            }
        },

        removeBundle: function (e) {
            var $thisEl = this.$el;
            var target = $(e.target).closest('.bundle');
            var position = Object.keys(this.bundleObj).indexOf(target.data('id'));

            if (position >= 0) {
                delete this.bundleObj[target.data('id')];
            }

            target.remove();
        },

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        chooseOption: function (e) {
            var $thisEl = this.$el;
            var $target = $(e.target);
            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            var courseId = $thisEl.find('#course').attr('data-id');
            var subjectId = $thisEl.find('#subject').attr('data-id');
            if (holder.attr('id') === 'course') {
                this.selectCourse(courseId);
            }

            if (holder.attr('id') === 'subject') {
                this.selectTopic(subjectId, courseId);
            }
        },

        getWeightageQuestions: function(){
            var $thisEl = this.$el;
            var data = this.constructData(), self = this;
            dataService.postData('/vAssessment/questions/count/weightage', data, function (err, questions) {
                if(questions.data){
                    $(".workflow-list").empty();
                    $(".workflow-list").css({'overflow': 'auto', 'word-break': 'break-all'});
                    self.weightage = questions.data;
                    self.weightage.forEach( function (item){
                        $(".workflow-list").append('<li data-id="'+ item._id +'"><a href="javascript:;" data-id="'+ item._id +'" title="'+ item.name +'" class="workflow">' + item.name +'</a></li>');
                        self.$el.find('.workflow-list li').first().addClass('active');
                        self.$el.find('.workflow-list li').first().click();
                    })
                }
            })

        },

        randomQuestions: function(){
            var data = this.constructData();
            var $thisEl = this.$el;
            var self = this;
            var noOfQue = $thisEl.find('#questions').val();
            dataService.postData('/vAssessment/questions/random/'+ noOfQue, data, function (err, questions) {
                if(questions.data){
                    self.questionsList(questions.data);
                }
            })
        },

        constructData: function(){
            var data = {};
            var $thisEl = this.$el;
            var self = this;
            data.questions = $.trim($thisEl.find('#questions').val()) ? $.trim($thisEl.find('#questions').val()) : null;
            data.course = $thisEl.find('#course').attr('data-id');
            var obj = [{
                subjectId: $thisEl.find('#subject').attr('data-id'),
                topics: [$thisEl.find('#topics').attr('data-id')]
            }];
            data.subjects = obj;
            return data;
        },

        getManualQuestions: function(){
            var data = {};
            var $thisEl = this.$el;
            var self = this;
            var data = this.constructData();
            dataService.postData('/vAssessment/questions/topic', data, function (err, questions) {
                if(questions.data){
                    var data = questions.data
                    var $container = self.$el.find('#questionList');
                    var variant = '';
                    $container.html('');
                    _.each(data, function (item) {
                        if (item.form && item.form.length) {
                            _.each(item.form, function (variantOne) {
                                variant += variantOne.form ? variantOne.form[0].desc : '';
                            });
                        }
                        $container.append('<li class="itemForBundle" data-id="' + item._id + '">' + item.form[0].desc + ' <span data-id="' + item._id + '">' + variant + '</span></li>');
                        variant = '';
                    });
                }
            })

        },

        resetSubjects: function(){
            this.resetExamMode();
            this.$el.find('#topicCategories').empty();
            this.$el.find('#checkedTopics').empty();
            this.$el.find('#productCategories').empty();
            this.$el.find('#checkedProductCategories').empty();

        },
        selectCourse: function(cId){
            var self = this;
            this.$el.find('#subject').text('Select subject');
            this.$el.find('#topics').text('Select topics');
            //this.$el.find('#number').text('');
            if (cId !== '') {
                dataService.getData('/vsubject/course', {category: 'SUBJECTS', courseId: cId, paper: true, subjectStatus: true}, function (subjects) {
                    var subjectDats = []
                    _.map( subjects.data, function(subject){
                        subject.name = subject.subject.subjectName;
                        subject._id = subject.subject._id;
                        subjectDats.push(subject)
                    })
                    self.responseObj['#subject'] = subjectDats;
                });
            }
            return false;
        },

        selectTopic: function (sid, cid) {
            var self = this;
            //this.$el.find('#course').text('Select course');
            this.$el.find('#topics').text('Select topics');
            if (sid !== '') {
                dataService.getData('/vtopic/subject/course', {subject: sid, course: cid}, function (topics) {
                    var topics =  lodash.flatMap(topics.data, ele => lodash(ele.topics).map(topic => ({name : topic.name, _id : topic._id})).value());
                    self.responseObj['#topics'] = topics;
                });
            } else {
                self.responseObj['#topics'] = [];
            }
            return false;
        },


        setValues: function () {
            var $thisEl = this.$el;
            var self = this;
            this.data ={};
            this.data.course = $thisEl.find('#course').attr('data-id');
            this.data.num = $.trim($thisEl.find('#questions').val()) ? $.trim($thisEl.find('#questions').val()) : null;
            this.data.subject = $thisEl.find('#subject').attr('data-id');
            if (Object.keys(this.bundleObj).length) {
                this.bundlesValues();
            }
            this.data.topic = $thisEl.find('#topics').attr('data-id');
            this.data.questionMark = $.trim($thisEl.find('#questionMarks').val());
            this.data.negativeMark = $.trim($thisEl.find('#nagetiveMarks').val());
            this.data.duration  = $.trim($thisEl.find('#examDuration').val());
            this.data.name = $.trim($thisEl.find('#name').val());
            this.data.canReview = $thisEl.find('#canReview').is(':checked');
            this.data.autoCorrect = $thisEl.find('#autoCorrect').is(':checked');

            this.data.center = _.map(this.centers, '_id');
            this.data.batches = _.map(this.batches, '_id');
            this.data.dateBeginAhead = moment(new Date()).format('ll');
            this.data.examMode = true;
        },

        noQuestions: function(e){
            console.info('e',$(e.target).val())
            this.resetExamMode();
        },

        saveItem: function () {
            var $thisEl = this.$el;
            var self = this;
            this.setValues();
            this.data.questionMode = this.questionMode ? this.questionMode : null;

            if(_.isEmpty(this.data.name)){
                return App.render({
                    type   : 'error',
                    message: "Please enter name."
                });
            }
            if(_.isEmpty(this.data.duration)){
                return App.render({
                    type   : 'error',
                    message: "Please enter duration."
                });
            }
            if(!this.data.course || this.data.course === 'Select'){
                return App.render({
                    type   : 'error',
                    message: "Please Select course."
                });
            }
            if(_.isEmpty(this.data.subject)){
                return App.render({
                    type   : 'error',
                    message: "Please Select subject."
                });
            }
            if(_.isEmpty(this.data.topic)){
                return App.render({
                    type   : 'error',
                    message: "Please Select topic."
                });
            }

            if(!this.data.num){
                return App.render({
                    type   : 'error',
                    message: "Please enter no of questions."
                });
            }
            if(!this.data.questionMode){
                return App.render({
                    type   : 'error',
                    message: "Please select Question Mode."
                });
            }
            if(this.data.questionMode == 'ManualQuestions'){
                this.selectQuestion = this.selectQuestion ? this.selectQuestion : [];
                if(this.selectQuestion.length == 0){
                    return App.render({
                        type   : 'error',
                        message: "Please Select Questions Manual."
                    });
                }
                this.data.questions = this.selectQuestion;
            }else {
                this.data.questions = this.generateQuesIds;
            }

            if(this.data.questionMode == 'Random'){
                this.selectQuestion = this.selectQuestion ? this.selectQuestion : [];
                if(_.isEmpty(this.data.questions)){
                    return App.render({
                        type   : 'error',
                        message: "Please Select Questions Random."
                    });
                }
            }

            dataService.postData('/vpractice/exam', this.data, function (err, result) {
                if(err) {
                    return App.render({
                        type: 'error',
                        message: 'Error'
                    })
                } else {
                    self.hideDialog();
                    return App.render({
                        type: 'notify',
                        message: 'Create Successfully'
                    })
                }
            });

            Backbone.history.fragment = '';
            Backbone.history.navigate(self.url || window.location.hash, {trigger: true});
        },

        generateQuestions: function(){
            var $thisEl = this.$el;
            var self = this;
            var data ={};
            data.course = $thisEl.find('#course').attr('data-id');
            var subjects =[];
            this.selectSubjects = [$thisEl.find('#subject').attr('data-id')];
            _.forEach(this.selectSubjects, function(value){
                var obj = {};
                obj.subjectId = value;
                var topics = _.filter(self.weightage ,function(val){
                    return val.topic.subject == value;
                });
                if(!_.isEmpty(topics)){
                    obj.topics = topics;
                    subjects.push(obj);
                }
            })
            data.subjects = subjects;
            var noOfQue = $thisEl.find('#questions').val();
            this.totalQues = 0;
            _.map(this.weightage, function(value){
                _.map(value.details, function(obj){
                    self.totalQues += obj.noOfQuestions ? parseInt(obj.noOfQuestions) :0;
                })
            })

            if(!this.totalQues || this.totalQues == 0){
                return App.render({
                    type   : 'error',
                    message: "Please enter no of questions."
                });
            }
            if(parseInt(this.data.num) >= this.totalQues){
                dataService.postData('/vassessment/questions/weightage/'+ noOfQue, data, function (err, questions) {
                    if(questions.data){
                        self.questionsList(questions.data);
                    }
                });
            }else {
                return App.render({
                    type   : 'error',
                    message: "Total Questions limit exceeded."
                });
            }
        },

        weightageSelectedQuestions: function(e){
            var $target =  $(e.target);
            var self = this;
            var id = $target.attr('id');
            var max = $(e.target).attr('max');
            var value = $(e.target).val();
            if(value > max){
                $(id).val('');
                $(e.target).val('');
                return App.render({
                    type   : 'error',
                    message: "Total Questions limit exceeded."
                });
            }
            var topicObj = _.find(this.weightage, {'_id':this.topicId});
            _.forEach(topicObj.details, function(value){
                if(value.id == id){
                    value.noOfQuestions = $(e.target).val() ? $(e.target).val() : 0;
                }
            })
        },

        questionsList: function(data){
            var $thisEl = this.$el;
            var self = this;
            $('.saveBtn').removeClass('hide');
            $('.generatedQuestions').removeClass('hide');
            var $container = self.$el.find('#generatedQues');
            $container.html('');
            self.generateQuesIds = [];
            _.each(data, function (item) {
                self.generateQuesIds.push(item._id);
                $container.append('<li class="itemForBundle">' + item.form[0].desc +'</li>');
            });
        },

        bundlesValues: function () {
            var $thisEl = this.$el, self = this;
            var bundlesArray = $thisEl.find('.bundle');
            var id;
            this.selectQuestion = [];
            _.each(bundlesArray, function (item) {
                id = $(item).data('id');
                self.selectQuestion.push(id);
            });
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        chooseWorkflowDetailes: function (e, el) {
            var $target = e ? $(e.target) : el;
            var $thisEl = this.$el;
            var self = this;
            var id;
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            $thisEl.find('.workflow-sub-list>*').remove();
            $thisEl.find('#details').addClass('active').show();
            $thisEl.find('#workflows').empty();
            $thisEl.find('#workflowNames').html('');

            if ($target.hasClass('workflow')) {
                $('.workflow-list .active').removeClass('active');
                $target.parent().addClass('active');
            }
            this.topicId = $target.data('id');
            var data = _.find(this.weightage, {'_id': this.topicId});
            $thisEl.find('#workflows').append('<table class="list stripedList blueclr"><thead><tr><th class="text-left text-clr-white">Weightage</th><th class="text-left text-clr-white">Total Questions</th><th class="text-left text-clr-white">No Of Questions</th></tr></thead><tbody id="'+data.name.replace(/[^A-Z0-9-]/g,'')+'"></tbody></table>');

            $thisEl.find('#'+ data.name.replace(/[^A-Z0-9-]/g,'')).empty();

            _.forEach(data.details, function (item, index) {
                item.id = self.topicId + index;
                $thisEl.find('#'+data.name.replace(/[^A-Z0-9-]/g,'')).append('<tr><td class="text-left">' +item.weightage +'</td><td class="text-left">' + item.questions +'</td>' +
                    '<td class="text-left">' +
                    '<input type="number" id="'+item.id+'" class="height-25 enterQuestions" style="width:50%" max="'+item.questions+'" value="'+item.noOfQuestions+'"/></td></tr>');
            })
        },

        render: function () {
            var self = this;
            var formString;

            formString = this.template({
                model           : this.currentModel.toJSON(),
                currencySplitter: helpers.currencySplitter
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Create Shipping Method',
                width      : '900px',
                right       : '250px',
                buttons    : [{
                    text : 'Save',
                    class: 'btn blue saveBtn',
                    click: function () {
                        self.saveItem();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                },
                    {
                        text : 'Generate Questions',
                        class: 'btn generateQue',
                        click: function () {
                            self.generateQuestions();
                        }
                    }
                ]

            });
            $('.generateQue').addClass('hide');

            dataService.getData('/vCourse/', {}, function (courses) {
                if (!_.isEmpty(courses.data)) {
                    courses = _.map(courses.data, function (course) {
                        course.name = course.courseName;
                        course._id = course._id;

                        return course;
                    });
                    self.responseObj['#course'] = courses;
                } else {
                    self.responseObj['#course'] = [];
                }
            });

            dataService.getData('/franchise/', {}, function (franchise) {
                if(!_.isEmpty(franchise.data)) {
                    self.centers = franchise.data;
                } else {
                    self.centers = [];
                }
            });

            dataService.getData('/vbatch/', {}, function (batches) {
                if(!_.isEmpty(batches.data)) {
                    self.batches = batches.data;
                } else {
                    self.batches = [];
                }
            });

            this.delegateEvents(this.events);

            return this;
        }
    });

    return createView;
});
