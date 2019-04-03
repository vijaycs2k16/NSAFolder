define([
    'Backbone',
    'jQuery',
    'Underscore',
    'Lodash',
    'views/VQuestionBank/form/FormView',
    'text!templates/VAssessment/questionBank/baseForm/baseFormEditTemplate.html',
    'text!templates/VAssessment/questionBank/baseForm/baseFormViewTemplate.html',
    'text!templates/VAssessment/questionBank/QuestionItems.html',
    'text!templates/VAssessment/questionBank/QuestionItem.html',
    'views/NoteEditor/NoteView',
    'views/dialogViewBase',
    'collections/Products/filterCollection',
    'common',
    'custom',
    'dataService',
    'populate',
    'vconstants',
    'models/VQuestionBank',
    'services/examSchedule',
    'services/examManagment',
], function (Backbone, $, _, lodash,
             ParentView,
             EditTemplate,
             ViewTemplate,
             QuestionItems,
             QuestionItem,
             NoteView, DialogView,
             SearchCollection, common, Custom, dataService, populate, CONSTANTS, QuestionModel, examScheduleService, examManagementService) {

    var EditView = ParentView.extend({
        el         : '.form-holder',
        contentType: 'vassessment/questions',
        imageSrc   : '',
        template   : _.template(EditTemplate),
        responseObj: {},

        initialize: function (options) {
            var modelObj;
            _.bindAll(this, 'render', 'saveItem');
            this.currentModel = options.model || options.collection.getElement();
            this.curModel = new QuestionModel();
            modelObj = this.currentModel.toJSON();
        },

        events: {
            'mouseenter .avatar': 'showEdit',
            'mouseleave .avatar': 'hideEdit',
            'click .updateBtn' : 'saveItem',
            'click #resetPrices': 'resetPrices',
            'keypress .forNum'  : 'keydownHandler',
            'click .addProductItem1 a': 'getProducts',
            'click .removeJob'       : 'deleteRow',
            'click .active'       : 'activeChoice',
            'load .loadValue'       : 'loadValue',
            'click .Weightage'       : 'weightage',
            'click .point'       : 'point',
            'click .cancelBtn'   : 'returnContentView',
            'click #showCenterBtn'      : examScheduleService.showCenters,
            'click ._varientCenter'     : examScheduleService.showCenters,
            'change .productCenterCategory' : 'changeCenter',
            'click .deleteCenter'           : 'deleteCenters',
            'click ._formWrap'          : 'hideSelect',
            'input .multiSelectSearch'   : examManagementService.multiSelectSearch,
            //'click .newSelectList li:not(.miniStylePagination,#generateJobs)': 'chooseOption'
        },

        returnContentView: function () {
            $('.saveBtn').prop("disabled", false);
            Backbone.history.fragment = '';
            Backbone.history.navigate(window.location.hash, {trigger: true});
        },

        weightage: function (e) {
                $('.weight').remove();
        },

        point: function (e) {
            $('.score').remove();
        },

        getProducts: function (e) {
            var selectedProducts = this.$el.find('.productItem');
            var selectedLength = selectedProducts.length;
            this.$el.find('#productList').append(_.template(QuestionItem, {model: {}, id: selectedLength + 4}));
            initSample();
        },

        activeChoice: function (e) {
            $('input[type="checkbox"]').on('click', function() {
                $('input[type="checkbox"]').not(this).prop('checked', false);
            });
            var $target = $(e.target);
            var thisEl = this.$el;
            var sList = "";
            var sThisVal="";
            $('input.active[type=checkbox]').each(function () {
                sThisVal = (this.checked ? "1" : "0");
                if (sThisVal == '1') {
                    $(this).val('1')
                }
                if (sThisVal == '0') {
                    $(this).val('0')
                }
                sList += (sList=="" ? sThisVal : "," + sThisVal);
            });
        },

        deleteRow: function (e) {
            var target = $(e.target);
            var tr = target.closest('tr');
            var jobId = tr.find('#discountValue').val();

            e.stopPropagation();
            e.preventDefault();

            tr.remove();
            var append = "Removed option " + "[" + jobId + "]" + " from the List";

            if (tr.remove() && jobId.length) {
                return App.render({
                    type: 'error',
                    message: append
                });
            }

            if (tr.remove() && !jobId.length) {
                return App.render({
                    type: 'error',
                    message: 'Removed option from the list'
                });
            }
        },
        hideSelect: function() {
            $('._categoriesList').hide();
        },
        saveItem: function () {
            var self = this;
            var mid = 55;
            var thisEl = this.$el;
            var courses = this.selectCourses;
            var subjectName = thisEl.find('#subject').attr('data-id');
            var topicName = thisEl.find('#topics').attr('data-id');
            var questionName = CKEDITOR.instances.editor.getData();
            var description = CKEDITOR.instances.editor1.getData();
            var explanation = CKEDITOR.instances.editor2.getData();
            var e = document.getElementById("Weightage");
            var weightage = e.options[e.selectedIndex].value;
            var f = document.getElementById("point");
            var score = f.options[f.selectedIndex].value;
            var choiceValue = thisEl.find('#createDiscountOrNot').val();
            var selectedProducts = this.$el.find('.productItem');
            var classes = thisEl.find('#classes').attr('data-id')
            var title =  thisEl.find('#title').attr('data-id')
            var subTopics = thisEl.find('#subTopic').attr('data-id')
            var form = [];
            var data;
            var isValid
            var IsChecked = $('.active').is(':checked');

            if(IsChecked == false) {
                return App.render({
                    type: 'error',
                    message: "Tick the Correct Answer"
                });
            }

            $('.productItem').each(function (row, targetEl) {
                var idName = $(this).find('.discountValue').attr('id');
                var choice = CKEDITOR.instances[idName].getData();
                var active = $(this).find('.active').val();

                if (active == 1) {
                    isValid = true;
                }
                else {
                    isValid = false;
                }

                var answer = {
                    desc: choice,
                    isValid: isValid
                };
                form.push({
                        desc: choice,
                        isValid: isValid
                    }
                );
            });

            if (_.isEmpty(classes)) {
                return App.render({
                    type: 'error',
                    message: "Class should't be empty."
                });
            }

            if (_.isEmpty(title)) {
                return App.render({
                    type: 'error',
                    message: "Title Name should't be empty."
                });
            }

            if (!subjectName) {
                return App.render({
                    type: 'error',
                    message: "Subject Name should't be empty."
                });
            }

            if (!topicName) {
                return App.render({
                    type: 'error',
                    message: "Topic Name should't be empty."
                });
            }

            if (!questionName) {
                return App.render({
                    type: 'error',
                    message: "Question can't be empty."
                });
            }
            if (!weightage) {
                return App.render({
                    type: 'error',
                    message: "Weightage can't be empty."
                });
            }

            if (!score) {
                return App.render({
                    type: 'error',
                    message: "Score can't be empty."
                });
            }
            var data = {
                type : choiceValue,
                point : score,
                form : [{desc : questionName.replace(/"/g, '\''), explanation: explanation, images: self.imageSrc, ans : form}],
                desc : description.replace(/"/g, '\''),
                title: title,
                subject : subjectName,
                topic : topicName,
                weightage : weightage,
                classDetail : classes,
                subTopic: subTopics != '' ? subTopics : null
            };
            this.currentModel.set(data);
            this.currentModel.save(this.currentModel.changed, {
                headers: {
                    mid: 58
                },
                put  : true,
                success: function (model) {
                    self.redirectAfterSave(self, model);
                    return App.render({
                        type: 'notify',
                        message:CONSTANTS.RESPONSES.EDIT_SUCCESS
                    });
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        redirectAfterSave: function (content) {
            //var redirectUrl = content.forSales ? 'erp/salesQuotations' : 'erp/Quotations';
            Backbone.history.fragment = '';
            Backbone.history.navigate('erp/VQuestionBank/tform/' + this.currentModel.id, {trigger: true});
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var $thisEl = this.$el;
            var id = target.attr('id');
            e.preventDefault();
            $('.newSelectList').hide();
            var currentId = target.closest('.current-selected').attr('id')
            target.closest('.current-selected').text(target.text()).attr('data-id', target.attr('id'));
            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            var subjectId = $thisEl.find('#subject').attr('data-id');
            var topicId = $thisEl.find('#topics').attr('data-id');
            var classesID = $thisEl.find('#classes').attr('data-id');
            var titleID = $thisEl.find('#title').attr('data-id')

            if(currentId == 'subject') {
                $thisEl.find('#topics').text('Select');
                $thisEl.find('#topics').attr('data-id', '');
                $thisEl.find('#subTopic').text('Select');
                $thisEl.find('#subTopic').attr('data-id', '')
            }

            if(id == classesID ){
                $thisEl.find('#subject').attr('data-id', '');
                $thisEl.find('#subject').text('Select');
                $thisEl.find('#subTopic').attr('data-id', '');
                $thisEl.find('#subTopic').text('Select');
                $thisEl.find('#topics').attr('data-id', '');
                $thisEl.find('#topics').text('Select');
                $thisEl.find('#title').attr('data-id', '');
                $thisEl.find('#title').text('Select');
                this.selectClasses(classesID)
            }

            if(id == subjectId) {
                this.selectTopic(classesID, subjectId, titleID);
            }

            if (id ==  topicId ){
                this.selectSubTopic(topicId)
            }

            if (id == titleID) {
                this.loadSubjects(titleID, classesID)
            }

            return false;
        },


        selectClasses: function(classid){
            var self = this;
            var titles = []
            dataService.getData('/title/subTitle/'+ classid, {}, function (elem) {
                self.titles = elem.data;
                if(self.titles){
                    titles = lodash.map(JSON.parse(JSON.stringify(self.titles)), function (el) {
                        el._id = el.title ? el.title._id : '';
                        el.name = el.title ? el.title.titleName : '';
                        return el;
                    });
                    self.responseObj['#title'] = titles;
                }
            });

        },

        loadSubjects: function(titleId, classId) {
            var self = this;
            var subjects = []
            if(classId != '' && titleId != '') {
                lodash.forEach(self.titles, function (val) {
                    if(val.title && val.title._id === titleId && val.classDetail == classId) {
                        subjects.push({"_id": val.subject._id, name: val.subject.subjectName})
                    }
                });
                self.responseObj['#subject'] = subjects;
            }
        },

        selectTopic: function (classId, subjectId, titleId) {
            var titles = [];
            var self = this;
            if(classId != '' && subjectId != '' && titleId != '') {
                dataService.getData('/vbatchSchedule/topics/class/', {classId: classId, subject: subjectId, titleId: titleId}, function (topics) {
                    self.topics = topics.data;
                    if(self.topics[0].topics){
                        titles = lodash.forEach(JSON.parse(JSON.stringify(self.topics)), function (el) {
                            el._id = el.topics._id;
                            el.name = el.topics.name;
                            return el;
                        });
                        self.responseObj['#topics'] = titles;
                    }
                });
            }
        },

        selectSubTopic: function(subTopic){
            var self = this;
            if (subTopic !== '') {
                dataService.getData('/title/subtopics/'+ subTopic, {}, function (topics) {
                    var data = topics.data.length > 0 ? topics.data[0].subtopic : null
                    var TopicDats = [];
                    _.map(data, function(topic){
                        topic.name = topic.name;
                        TopicDats.push(topic)
                    })
                    self.responseObj['#subTopic'] = TopicDats;
                });
            } else {
                self.responseObj['#subTopic'] = [];
                $('#subTopic').data('data-id', '');
                $('#subTopic').text('Select');
            }
            return false;
        },

        render: function () {
            var self = this;
            var $thisEl = this.$el;
            var formString;
            var template;

            $('#printPdf').addClass('hide')
            $('#top-bar-deleteBtn').addClass('hide')
            this.template = _.template(EditTemplate);

             setTimeout(function () {
                formString = self.template({
                    model      : self.currentModel.toJSON(),
                    subTtopic   : self.subTtopic
                });
                $thisEl.html(formString);

                 template = self.templateDoc({
                    model           : self.currentModel.toJSON(),
                    subTtopic        : self.subTtopic
                });

                $thisEl.find('#templateDiv').html(template);
                self.currentModel['imageSrc'] = self.currentModel.attributes.form[0].images;
                common.canvasDraw({model: self.currentModel}, self);

                dataService.getData('/title/classDetails', {}, function (courses) {
                    courses = _.map(courses.data, function (course) {
                        course.name = course.className;
                        course._id = course._id
                        return course;
                    });
                    self.responseObj['#classes'] = courses;
                });

                self.delegateEvents(self.events);

                self.$el.find('.productItemsHolder').html(_.template(QuestionItems));
                var js = document.createElement("script");
                js.type = "text/javascript";
                js.src = "http://venperacademy.com:9090/pluginwiris_engine/app//WIRISplugins.js?viewer=image";
                document.head.appendChild(js);
                initSample();
            }, 200)


            return this;
        }
    });

    return EditView;
});
