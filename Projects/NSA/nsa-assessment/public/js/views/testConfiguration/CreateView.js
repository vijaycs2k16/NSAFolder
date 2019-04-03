define([
    'Backbone',
    'jQuery',
    'Lodash',
    'views/dialogViewBase',
    'text!templates/testConfiguration/CreateTemplate.html',
    'models/testConfigurationModel',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'helpers',
    'dataService',
    'services/examManagment',
    'services/examSchedule',
    'Validation',
    'moment'
], function (Backbone, $, _, Parent, template, Model, populate, CONSTANTS, keyValidator, helpers, dataService, examManagmentService, examScheduleService, valid, moment) {
    'use strict';

     var configCreateView = Parent.extend({
        template   : _.template(template),
        contentType: 'testConfiguration',

        initialize : function (options) {
            options = options || {};
            this.bundleObj = {};

            _.bindAll(this, 'render', 'saveItem');

            this.currentModel = new Model();
            this.collection = options.collection;
            this.responseObj = {};
            this.selectSubTopics = [];
            this.render();
            this.selectMode = null;
        },

        events: {
            'keypress #price'            : 'keypressHandler',
            'click ._circleRadioRadiance': 'checked',
           /* 'click #showBtn'             : examManagmentService.showSubjects,
            'click ._variantsSubjects'   : examManagmentService.showSubjects,
            'change .productCategory'    : 'changeSubject',
            'click .deleteTag'           : examManagmentService.deleteSubject,
            'click .deleteTag'           : 'resetExamMode',*/
            'click #showBtn1'            : examManagmentService.showTopics,
            'click ._variantsTopics'     : examManagmentService.showTopics,
            'change .topicCategories'    : 'changeTopic',
            'click .deleteTg1'           : examManagmentService.deleteTopic,
            'click .itemForBundle'       : 'addToBundle',
            'click .removeBundle'        : 'removeBundle',
            'click .workflow-sub'        : 'chooseWorkflowDetailes',
            'click .workflow-list li'    : 'chooseWorkflowDetailes',
            'click ._formWrap'           : 'closeMultiselect',
            'click ._formBlock'          : 'hideSelect',
            'keyup #questions'           : 'noQuestions',
            'input .multiSelectSearch'   : examManagmentService.multiSelectSearch,
            /*'click #showSubTopic'        : examManagmentService.showSubTopic,
            'click ._varientSubTopic'    : examManagmentService.showSubTopic,
            'change .productSubTopic'    : 'changeSubTopic',
            'click .deleteTag2'          : examManagmentService.deleteSubTopic,
            'click .deleteTag2'          : 'resetExamMode',*/
            'keypress #questionMarks'    : 'checkLoginInputKey',
            'keypress #nagetiveMarks'    : 'checkLoginInputKey',
            'click .counterRep'          : 'chooseQuestion'
        },

        checkLoginInputKey: function (e) {
            var char = String.fromCharCode(e.charCode);
            if (valid.OnlyNumber(char)) {
                e.preventDefault();
            }
        },

        chooseQuestion : function(e) {
            $('.counterWrap').show();
        },

        checked : function(e) {
            var value = $('input[name=questionType]:checked').val();
            var methodType = $('input[name=methodType]:checked').val();
            $('.saveBtn').removeClass('hide');
            this.questionMode = value;
            this.selectMode = methodType;
            this.setValues();
            $('.generatedQuestions').addClass('hide');
            if(!this.data.classDetail || this.data.classDetail === 'Select'){
                $('#'+value).prop('checked', false);
                return App.render({
                    type   : 'error',
                    message: "Please Select class."
                });
            }
            /*if(_.isEmpty(this.data.subject)){
                $('#'+value).prop('checked', false);
                return App.render({
                    type   : 'error',
                    message: "Please Select subject."
                });
            }*/
            if(_.isEmpty(this.data.topic)){
                $('#'+value).prop('checked', false);
                return App.render({
                    type   : 'error',
                    message: "Please Select topic."
                });
            }
            if (!this.data.schedule) {
                $('#'+value).prop('checked', false);
                return App.render({
                    type   : 'error',
                    message: "Schedule field can't be empty."
                });
            }

            if(!this.data.num){
                $('#'+value).prop('checked', false);
                return App.render({
                    type   : 'error',
                    message: "Please enter no of questions."
                });
            }

            if(value == 'ManualQuestions' && this.selectMode != null){
                this.bundleObj = [];
                this.selectQuestion = [];
                $('.randomQuestions').addClass('hide');
                $('.manualQuestions').removeClass('hide');
                $('.generateQue').addClass('hide');
                this.getManualQuestions();
            } else if(value == 'Random' && this.selectMode != null){
                this.bundleObj = [];
                this.selectQuestion = [];
                var $container = this.$el.find('#productsBundle');
                $container.empty('');
                $('.manualQuestions').addClass('hide');
                $('.randomQuestions').removeClass('hide');
                this.randomQuestions();
                $('.generateQue').addClass('hide');
            }
        },

        resetExamMode: function(){
            this.selectQuestion = [];
            this.bundleObj = [];
            var $container = this.$el.find('#productsBundle');
            $container.empty('');
            $('.randomQuestions').addClass('hide');
            $('.manualQuestions').addClass('hide');
            $('.generatedQuestions').addClass('hide');

            if(this.questionMode){
                $('#'+this.questionMode).prop('checked', false);
            }

            if(this.selectMode){
                $('#'+this.selectMode).prop('checked', false);
            }
        },

        hideSelect: function() {
            $('.newSelectList').hide();
        },

        closeMultiselect : function() {
            var $thisEl = this.$el;
            var $categoriesBlock = $thisEl.find('._variantsBlock');

            if (!$categoriesBlock.length) {
                $categoriesBlock = $thisEl.find('._variantsBlock');
            }

            if ($categoriesBlock.hasClass('open')) {
                $categoriesBlock.removeClass('open');
                $categoriesBlock.children('ul').hide();
            }
        },

        addToBundle: function (e) {
            var $thisEl = this.$el;
            var $target = $(e.target).closest('li');
            var $container = $thisEl.find('#productsBundle');
            var val = $target.text();
            var id = $target.data('id');
            var repeat = id.sizeQuestion !== 0 ? '*' : '';
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
                target.remove();
                this.bundlesValues();
            }
        },

       /* changeSubject : function(e){
            var $thisEl = this.$el;
            var self = this;
            this.$el.find('#topicCategories').empty();
            this.resetExamMode();
            this.$el.find('#checkedTopics').empty();
            var $categoryContainer = $thisEl.find('#checkedProductCategories');
            var $target = $(e.target);
            var categoryId = $target.data('id');
            var categoryName = $target.data('value');
            var idsArray = [];
            var checkedProductCategory = $thisEl.find('.checkedProductCategory');
            e.stopPropagation();

            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    idsArray.push($(item).data('id'));
                });
            }
            if (idsArray.length && idsArray.indexOf(categoryId) >= 0) {
                $categoryContainer.find('[data-id=' + categoryId + ']').closest('li').remove();
            } else {
                $categoryContainer.append('<li><span class="checkedProductCategory"  data-value="' + categoryName + '" data-id="' + categoryId + '">' + categoryName + '</span><span class="deleteTag icon-close3"></span></li>');
            }
            this.selectSubjects = []
            var checkedProductCategory = $thisEl.find('.checkedProductCategory');
            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    self.selectSubjects.push($(item).data('id'));
                });
            }
            $('#topicCategories').empty();
            if(!_.isEmpty(this.selectSubjects)){
                this.getTopicsBySubjects(this.selectSubjects, self.classId, self.titleId);

            }

            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }
        },*/

        changeTopic : function(e){
            var $thisEl = this.$el;
            var self = this;
            this.$el.find('#productSubTopic').empty();
            this.resetExamMode();
            this.$el.find('#checkedSubTopic').empty();
            var $categoryContainer = $thisEl.find('#checkedTopics');
            var $target = $(e.target);
            var categoryId = $target.data('id');
            var categoryName = $target.data('value');
            var checkedProductCategory = $thisEl.find('.checkedTopics');
            var idsArray = [];
            var checkedValues = $thisEl.find('.topicCategories');

            if (categoryId == '3') {
                if ($target.is(':checked')) {
                    $thisEl.find('.topicCategories').prop('checked', true)
                    $thisEl.find('#checkedTopics').empty();
                    checkedValues.each(function (key, item) {
                        if ($(item).data('id') != 3) {
                            $categoryContainer.append('<li><span class="checkedTopics"  data-value="' + $(item).data('value') + '" data-id="' + $(item).data('id') + '">' + $(item).data('value') + '</span><span class="delSubject icon-close3"></span></li>');
                        }
                    });
                } else {
                    $thisEl.find('#checkedTopics').empty();
                    $thisEl.find('.topicCategories').prop('checked', false)
                }

            }
            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    idsArray.push($(item).data('id'));
                });
            }

            e.stopPropagation();
            if (categoryId && categoryId != '3') {
                if (idsArray.length && idsArray.indexOf(categoryId) >= 0) {
                    $categoryContainer.find('[data-id=' + categoryId + ']').closest('li').remove();
                } else {
                    $categoryContainer.append('<li><span class="checkedTopics"  data-value="' + categoryName + '" data-id="' + categoryId + '">' + categoryName + '</span><span class="deleteTg1 icon-close3"></span></li>');
                }
            }

            this.selectTopics = [];
            var checkedProductCategory = $thisEl.find('.checkedTopics');
            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    self.selectTopics.push($(item).data('id'));
                });
            }

           /* $('#productSubTopic').empty();
            if(!_.isEmpty(this.selectTopics)){
                this.getSubTopicByTopics(this.selectTopics);
            }*/

            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }
        },

        /*changeSubTopic : function(e){
            var $thisEl = this.$el;
            var self = this;
            this.resetExamMode();
            var $categoryContainer = $thisEl.find('#checkedSubTopic');
            var $target = $(e.target);
            var categoryId = $target.data('id');
            var categoryName = $target.data('value');
            var checkedProductCategory = $thisEl.find('.checkedSubTopic');
            var idsArray = [];
            var checkedValues = $thisEl.find('.productSubTopic');

            if (categoryId == '4') {
                if ($target.is(':checked')) {
                    $thisEl.find('.productSubTopic').prop('checked', true);
                    $thisEl.find('#checkedSubTopic').empty();
                    checkedValues.each(function (key, item) {
                        if ($(item).data('id') != 4) {
                            $categoryContainer.append('<li><span class="checkedSubTopic"  data-value="' + $(item).data('value') + '" data-id="' + $(item).data('id') + '">' + $(item).data('value') + '</span><span class="deleteTag2 icon-close3"></span></li>');
                        }
                    });
                } else {
                    $thisEl.find('#checkedSubTopic').empty();
                    $thisEl.find('.productSubTopic').prop('checked', false)
                }

            }
            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    idsArray.push($(item).data('id'));
                });
            }

            e.stopPropagation();
            if (categoryId && categoryId != '4') {
                if (idsArray.length && idsArray.indexOf(categoryId) >= 0) {
                    $categoryContainer.find('[data-id=' + categoryId + ']').closest('li').remove();
                } else {
                    $categoryContainer.append('<li><span class="checkedSubTopic"  data-value="' + categoryName + '" data-id="' + categoryId + '">' + categoryName + '</span><span class="deleteTag2 icon-close3"></span></li>');
                }
            }

            var checkedProductCategory = $thisEl.find('.checkedSubTopic');
            this.selectSubTopics = [];
            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    self.selectSubTopics.push($(item).data('id'));
                });
            }

            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }
        },*/

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        getTopicsBySubjects : function(classId){
            this.resetExamMode();
            var self = this;
            var ids = '5c330536b3181c395bef5e15';
            var titleId = '5c3307780d54e4fbf8e223aa';
            this.resetTopics();
            dataService.getData('/vbatchSchedule/topics/class', {classId: classId, subject: ids, titleId: titleId}, function (topics) {
                self.topics = topics.data;
                var objs = [];
                _.map(JSON.parse(JSON.stringify(self.topics)), function (value) {
                    value._id = value.topics._id;
                    value.name = value.topics.name;
                    objs.push(value);
                });
                self.topicData = _.uniqBy(objs, '_id');
                self.renderTopics(self.topicData);

            });
        },

        /*getSubTopicByTopics : function(topicId){
            this.resetExamMode();
            var $thisEl = this.$el;
            var self = this;
            self.subtopic = [];
            this.resetSubTopics();
            _.forEach(topicId, function(val, index){
                var subTopicObjs = _.filter(self.topicData, {"_id": val});
                if (!_.isEmpty(subTopicObjs) && !_.isEmpty(subTopicObjs[0].subtopics)) {
                    self.subtopic.push(_.forEach(subTopicObjs[0].subtopics[0].subtopic, function (o) {
                        o.topicName = subTopicObjs[0].name;
                        o.subject = subTopicObjs[0].subject._id;
                        return o;
                    }));

                }
                if(index == topicId.length -1) {
                    self.subtopic = _.flatten(self.subtopic);
                    self.renderSubTopics(self.subtopic);
                }
            })
        },*/

        chooseOption: function (e) {
            var target = $(e.target);
            var $thisEl = this.$el;
            var id = target.attr('id');
            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            var classesId = $thisEl.find('#classpc').attr('data-id');
            var titleId = $thisEl.find('#schltitle').attr('data-id');

            if (id == titleId) {
                this.titleId = titleId;
                this.selectTitle(titleId);
            }

            if( id == classesId ){
                this.classId = classesId;
                this.getTopicsBySubjects(classesId)
            }
        },

        randomQuestions: function(){
            var data = this.constructData();
            var $thisEl = this.$el;
            var self = this;
            var noOfQue = $thisEl.find('#questions').val();
            dataService.postData('/testConfiguration/questions/random/'+ noOfQue, data, function (err, questions) {
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
            var courseId = self.titleId;
            var subjects = [];
            data.title = courseId;
            data.classDetail = this.classId;
            data.selectMode = this.selectMode;
            if(this.selectSubTopics.length == 0){
                _.map(this.topics, function (topic) {
                    _.map(self.selectTopics, function (val) {
                        var selected =topic.topics && topic.topics._id == val ? topic.topics : {};
                        if (selected) {
                            var subj = _.find(subjects, {'subjectId': topic.subject._id});
                            if (subj) {
                                subj.topics.push(selected._id);
                            } else {
                                var obj = {
                                    subjectId: topic.subject._id,
                                    topics: [selected._id]
                                }
                                subjects.push(obj);
                            }
                        }
                    });
                });
            } else {
                _.map(self.selectSubTopics, function (val) {
                    var selected = _.find(self.subtopic, {'_id': val});
                    if (selected) {
                        var subj = _.find(subjects, {'subjectId': val.subjectId});
                        if (subj) {
                            subj.subtopic.push(selected._id);
                        } else {
                            var obj = {
                                subjectId: selected.subject,
                                subtopic: [selected._id]
                            }
                            subjects.push(obj);
                        }
                    }
                });
            }

            data.subjects = subjects;
            return data;
        },

        getManualQuestions: function(){
            var data = {};
            var $thisEl = this.$el;
            var self = this;
            var data = this.constructData();
            dataService.postData('/testConfiguration/manual/select', data, function (err, questions) {
                if(questions.data){
                    var data = questions.data;
                    var $container = self.$el.find('#questionList');
                    var variant = '';
                    $container.html('');
                    _.each(data, function (item) {
                        var repeat = item.sizeQuestion !== 0 ? '*' : '';
                        if (item.form && item.form.length) {
                            _.each(item.form, function (variantOne) {
                                variant += variantOne.form ? variantOne.form[0].desc : '';
                            });
                        }
                        $container.append('<li class="itemForBundle" data-id="' + item._id + '">' + item.form[0].desc + ' <span data-id="' + item._id + '">' + variant + '<span class="text-danger">' + '&nbsp;' + repeat + '</span></li>');
                        variant = '';
                    });
                }
            })
        },

        resetTitle: function(){
            this.resetExamMode();
            this.$el.find('#classpc').empty();
            this.$el.find('#productCenterCategories').empty();
            this.$el.find('#checkedProductCenter').empty();
            this.$el.find('#topicCategories').empty();
            this.$el.find('#checkedTopics').empty();
            this.$el.find('#productCategories').empty();
            this.$el.find('#checkedProductCategories').empty();
        },

        resetSubjects: function(){
            this.resetExamMode();
            this.$el.find('#topicCategories').empty();
            this.$el.find('#checkedTopics').empty();
            this.$el.find('#productCategories').empty();
            this.$el.find('#checkedProductCategories').empty();
        },

        resetClass: function(){
            this.resetExamMode();
            this.$el.find('#productCenterCategories').empty();
            this.$el.find('#checkedProductCenter').empty();
            this.$el.find('#topicCategories').empty();
            this.$el.find('#checkedTopics').empty();
            this.$el.find('#productCategories').empty();
            this.$el.find('#checkedProductCategories').empty();
        },

        resetSubTopics: function(){
            this.resetExamMode();
            this.$el.find('#productSubTopic').empty();
            this.$el.find('#checkedSubTopic').empty();
        },


        resetTopics: function(){
            this.resetExamMode();
            this.$el.find('#topicCategories').empty();
            this.$el.find('#checkedTopics').empty();
            this.$el.find('#productSubTopic').empty();
            this.$el.find('#checkedSubTopic').empty();
        },

        selectTitle: function(){
            this.resetTitle();
            var self = this;
            var classes = [];
            var titleid = '5c3307780d54e4fbf8e223aa';
            dataService.getData('/title/'+ titleid, {}, function (elem) {
                self.titles = elem.data;
                classes = _.map(JSON.parse(JSON.stringify(self.titles)), function (el) {
                    el._id  =  el.classDetail._id;
                    el.name = el.classDetail.className;
                    return el;
                });
                self.responseObj['#classpc'] = _.uniqBy(classes, '_id');
            });
        },

        /*selectClasses: function(classid){
            this.resetClass();
            var self = this;
            dataService.getData('/vsubject/details/'+ classid, {}, function (subjects) {
                subjects = _.map(subjects.data, function (subject) {
                    subject._id = subject.subject._id;
                    subject.name = subject.subject.subjectName;
                    return subject;
                });
                self.renderSubjects(_.uniqBy(subjects, '_id'));
                self.responseObj['#subject'] = subjects;
            })
        },*/

        /*renderSubjects : function(objs){
            var $thisEl = this.$el;
            var $checkedCategoryContainer = $thisEl.find('#checkedProductCategories');
            var $categoriesBlock = $thisEl.find('#variantsCategoriesBlock');
            var $categoryContainer = $thisEl.find('#productCategories');
            var checkedSelectedId;
            var checkedName;
            $categoryContainer.append('<input type="text" id="mySubjectInput" class="multiSelectSearch" placeholder="Search for subjects.." title="Type in a subject">')
            if(!_.isEmpty(objs)){
                _.each(objs, function (category) {
                    checkedName = '';
                    checkedSelectedId = '';

                    if (objs.indexOf(category._id) >= 0) {
                        $categoryContainer.append('<li><label class="_customCHeckbox"><input checked="checked" type="checkbox" class="checkbox productCategory" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                        checkedSelectedId = category._id;
                        checkedName = category.name;
                    } else {
                        $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox productCategory" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                    }

                    if (checkedName) {
                        $checkedCategoryContainer.append('<li><span class="checkedProductCategory"  data-value="' + checkedName + '" data-id="' + checkedSelectedId + '">' + checkedName + '</span><span class="deleteTag icon-close3"></span></li>');
                    }
                });
            } else {
                $categoryContainer.append('<li><label>No Data Found</label></li>');
            }
        },*/

        renderTopics : function(objs){
                var $thisEl = this.$el;
                var $checkedCategoryContainer = $thisEl.find('#checkedTopics');
                var $categoriesBlock = $thisEl.find('#topicBlocks');
                var $categoryContainer = $thisEl.find('#topicCategories');
                var checkedSelectedId;
                var checkedName;
            if(!_.isEmpty(objs)){
                $categoryContainer.append('<input type="text" id="myTopicInput" class="multiSelectSearch"   placeholder="Search for topics.." title="Type in a topics">')
                $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox topicCategories" id="3" data-value="ALL" data-id="3"> <span></span></label><label class="_checkboxLabel" for="3">ALL</label></li>');
                _.each(objs, function (category) {

                    checkedName = '';
                    checkedSelectedId = '';
                   var subTop = !_.isEmpty(category.subtopics) && category.subtopics[0].subtopic.length > 0 ? '*' : '';
                    var qTop = !_.isEmpty(category.questions) && category.questions.length > 0 ? '#' : '';
                    if (objs.indexOf(category._id) >= 0) {
                        $categoryContainer.append('<li><label class="_customCHeckbox"><input checked="checked" type="checkbox" class="checkbox topicCategories" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name +' - '+'<b>'+ category.subject.subjectName +'</b>'+'<span class="text-danger">'+ '&nbsp;'+ subTop +  '&nbsp;'+ qTop + '</label></li>');
                        checkedSelectedId = category._id;
                        checkedName = category.name;
                    } else {
                        $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox topicCategories" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name +' - '+'<b>'+ category.subject.subjectName +'</b>'+'<span class="text-danger">'+ '&nbsp;'+ subTop + '&nbsp;'+ qTop +'</label></li>');
                    }

                    if (checkedName) {
                        $checkedCategoryContainer.append('<li><span class="checkedTopics"  data-value="' + checkedName + '" data-id="' + checkedSelectedId + '">' + checkedName + '</span><span class="deleteTg1 icon-close3"></span></li>');
                    }
                });
            } else {
                $categoryContainer.append('<li><label>No Data Found</label></li>');
            }
        },

        /*renderSubTopics : function(objs){
            var $thisEl = this.$el;
            var $checkedCategoryContainer = $thisEl.find('#checkedSubTopic');
            var $categoriesBlock = $thisEl.find('#variantsSubTopicBlock');
            var $categoryContainer = $thisEl.find('#productSubTopic');
            var checkedSelectedId;
            var checkedName;
            if(!_.isEmpty(objs)){
                $categoryContainer.append('<input type="text" id="mySubTopicInput" class="multiSelectSearch"   placeholder="Search for subtopics.." title="Type in a subtopics">')
                $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox productSubTopic" id="4" data-value="ALL" data-id="4"> <span></span></label><label class="_checkboxLabel" for="4">ALL</label></li>');
                _.each(objs, function (category) {
                    checkedName = '';
                    checkedSelectedId = '';
                    if (objs.indexOf(category._id) >= 0) {
                        $categoryContainer.append('<li><label class="_customCHeckbox"><input checked="checked" type="checkbox" class="checkbox productSubTopic" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + ' - '+'<b>'+ category.topicName + '</b>' + '</label></li>');
                        checkedSelectedId = category._id;
                        checkedName = category.name;
                    } else {
                        $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox productSubTopic" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + ' - '+'<b>'+ category.topicName+ '</b>' +'</label></li>');
                    }

                    if (checkedName) {
                        $checkedCategoryContainer.append('<li><span class="checkedSubTopic"  data-value="' + checkedName + '" data-id="' + checkedSelectedId + '">' + checkedName + '</span><span class="deleteTag2 icon-close3"></span></li>');
                    }
                });
            } else {
                $categoryContainer.append('<li><label>No Data Found</label></li>');
            }
        },*/

        noQuestions: function(){
            this.resetExamMode();
        },

        setValues: function () {
            var $thisEl = this.$el;
            this.data ={};
            this.data.classDetail = $thisEl.find('#classpc').attr('data-id');
            this.data.title = '5c3307780d54e4fbf8e223aa';
            this.data.questionMark = $.trim($thisEl.find('#questionMarks').val());
            this.data.negativeMark = $.trim($thisEl.find('#nagetiveMarks').val());
            this.data.duration  = $.trim($thisEl.find('#examDuration').val());
            this.data.canReview = $thisEl.find('#canReview').is(':checked');
            this.data.autoCorrect = $thisEl.find('#autoCorrect').is(':checked');
            var sDate = this.getTimeForDate(moment($.trim(this.$el.find('#startTime').wickedpicker('time')).split(' '), 'hh:mm:ss A'));
            var eDate = this.getTimeForDate(moment($.trim(this.$el.find('#endTime').wickedpicker('time')).split(' '), 'hh:mm:ss A'));
            this.data.timeBegin = sDate.date;
            this.data.timeEnd = eDate.date;
            var duration = sDate.min - eDate.min;
            this.data.schedule = $thisEl.find('#scheduleDate').val();
            this.data.num = $.trim($thisEl.find('#questions').val()) ? $.trim($thisEl.find('#questions').val()) : null;
            this.data.subject = ['5c330b486cca00147c6c3c8e'];

            if (Object.keys(this.bundleObj).length) {
                this.bundlesValues();
            }

            this.data.topic = this.selectTopics;
            this.data.subTopic = this.selectSubTopics;
            var today = this.data.schedule.split(',');
            this.data.dateBeginAhead = moment(today[0]).format('LL');
            this.data.monthNo = moment(today[0]).format('M');
            this.data.year  = moment(today[0]).format('YYYY');
            this.data.weekNo = +$.datepicker.iso8601Week(new Date(today[0]));

            if (this.data.duration > Math.abs(duration)) {
                return App.render({
                    type: 'error',
                    message: "Duration is Incorrect."
                });
            }
        },

        saveItem: function () {
            var self = this;
            this.setValues();
            this.data.questionMode = this.questionMode ? this.questionMode : null;
            this.data.selectMode = this.selectMode ? this.selectMode : null;
            var timeBegin = Date.parse(this.data.timeBegin);
            var timeEnd = Date.parse(this.data.timeEnd);

            if(!this.data.title || this.data.title === 'Select'){
                return App.render({
                    type   : 'error',
                    message: "Please Select title."
                });
            }

            if(!this.data.classDetail || this.data.classDetail === 'Select'){
                return App.render({
                    type   : 'error',
                    message: "Please Select class."
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

            if (!this.data.duration) {
                return App.render({
                    type   : 'error',
                    message: "duration field can't be empty."
                });
            }

            if (timeBegin >= timeEnd) {
                return App.render({
                    type: 'error',
                    message: "Select Valid Time."
                });
            }

            if (!this.data.schedule) {
                return App.render({
                    type   : 'error',
                    message: "schedule field can't be empty."
                });
            }

            if(!this.data.num){
                return App.render({
                    type   : 'error',
                    message: "Please enter no of questions."
                });
            }

            if(!this.data.selectMode){
                return App.render({
                    type   : 'error',
                    message: "Please select Mode."
                });
            }

            if(!this.data.questionMode){
                return App.render({
                    type   : 'error',
                    message: "Please select Question Mode."
                });
            }

            this.data.num = this.selectQuestion.length;

            if(this.data.questionMode == 'ManualQuestions'){
                this.selectQuestion = this.selectQuestion ? this.selectQuestion : [];
                if(this.selectQuestion.length == 0){
                    return App.render({
                        type   : 'error',
                        message: "Please Select Questions."
                    });
                }
                this.data.questions = this.selectQuestion;
            }else {
                if(this.generateQuesIds.length == 0){
                    return App.render({
                        type   : 'error',
                        message: "Random Question can't Be Empty."
                    });
                }
                this.data.questions = this.generateQuesIds;
            }

            this.currentModel.save(this.data, {
                wait   : true,
                success: function () {
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash, {trigger: true});
                    self.hideDialog();
                    return App.render({
                        type: 'notify',
                        message:CONSTANTS.RESPONSES.CREATE_SUCCESS
                    });
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        questionsList: function(data){
            var self = this;
            $('.saveBtn').removeClass('hide');
            $('.generatedQuestions').removeClass('hide');
            var $container = self.$el.find('#generatedQues');
            $container.html('');
            self.generateQuesIds = [];
            self.selectQuestion = [];
            _.each(data, function (item) {
                var repeat = item.sizeQuestion !== 0 ? '*' : '';
                self.generateQuesIds.push(item._id);
                self.selectQuestion.push(item._id);
                $container.append('<li class="itemForBundle">' + item.form[0].desc + '<span class="text-danger">' + '&nbsp;' + repeat +'</li>');
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

        getTimeForDate: function(date){
            var hours = date.get('hours');
            var minutes = date.get('minutes');
            var seconds = date.get('seconds');
            var min = (hours * 60) + minutes + (seconds/60);

            return {"date" : moment(new Date()).hours(hours).minutes(minutes).seconds(seconds).toDate(), "min":min} ;
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
                width      : '900px',
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
                }]
            });

            this.$el.find('#startTime').wickedpicker({
                now: "19:00:00",
                showSeconds: true,
                secondsInterval: 1,
                minutesInterval: 1
            });

            this.$el.find('#endTime').wickedpicker({
                now: '19:07:00',
                showSeconds: true,
                secondsInterval: 1,
                minutesInterval: 1
            });

            this.$el.find('#scheduleDate').datepicker({
                dateFormat : 'd M yy, DD',
                //minDate: 0,
                changeMonth: true,
                changeYear: true,
               // firstDay: 0, // Start with Sunday
                //beforeShowDay: showOnlySunday
            });

            function showOnlySunday(date){
                return [date.getDay() === 0,'']; // Allow only one day a week
            }

            $('.generateQue').addClass('hide');
            $('.counterWrap').hide();

            /*dataService.getData('/title/schoolTitle', {}, function (title) {
                title = _.map(title.data, function (tit) {
                    tit.name = tit.titleName;
                    return tit;
                });
                self.responseObj['#schltitle'] = title;
            });*/

            var titleId = '5c3307780d54e4fbf8e223aa';
            dataService.getData('/title/'+ titleId, {}, function (elem) {
                self.titles = elem.data;
                elem = _.map(JSON.parse(JSON.stringify(self.titles)), function (el) {
                    el._id  =  el.classDetail._id;
                    el.name = el.classDetail.className;
                    return el;
                });
                self.responseObj['#classpc'] = _.uniqBy(elem, '_id');
            });

            this.delegateEvents(this.events);

            return this;
        }
    });

    return configCreateView;
});