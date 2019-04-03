define([
    'Backbone',
    'jQuery',
    'Underscore',
    'Lodash',
    'text!templates/VAssessment/questionBank/CreateTemplate.html',
    'text!templates/VAssessment/questionBank/QuestionItems.html',
    'text!templates/VAssessment/questionBank/QuestionItem.html',
    'collections/Persons/PersonsCollection',
    'collections/Departments/DepartmentsCollection',
    'views/dialogViewBase',
    'views/Products/orderRows/ProductItems',
    'models/VQuestionBank',
    'common',
    'populate',
    'vconstants',
    'views/Assignees/AssigneesView',
    'dataService',
    'helpers/keyValidator',
    'helpers',
    'services/examSchedule',
    'services/examManagment'
], function (Backbone,
             $,
             _,
             lodash,
             CreateTemplate,
             QuestionItems,
             QuestionItem,
             PersonsCollection,
             DepartmentsCollection,
             ParentView,
             ProductItemView,
             QuotationModel,
             common,
             populate,
             CONSTANTS,
             AssigneesView,
             dataService,
             keyValidator,
             helpers, examScheduleService, examManagmentService) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'VQuestionBank',
        template   : _.template(CreateTemplate),
        imageSrc            : '',

        initialize: function (options) {
            if (options) {
                this.visible = options.visible;
            }
            _.bindAll(this, 'render', 'saveItem');
            this.currentModel = new QuotationModel();
            this.responseObj = {};
            this.collection = options.collection;
            this.currencySymbol = '₹';
            this.deletedProducts = [];
            this.render();
        },

        events: {
            'click button.saveItem': 'saveItem',
            'click button.savenextItem': 'savenextItem',
            'click a.RegistrationBtn'     : 'registration',
            'mouseenter .avatar': 'showEdit',
            'mouseleave .avatar': 'hideEdit',
            'click #resetPrices': 'resetPrices',
            'keypress #selectInput'  : 'keydownHandler',
            'click .addProductItem1 a': 'getProducts',
            'click .removeJob'       : 'deleteRow',
            'click .active'       : 'activeChoice',
            'click ._formWrap'          : 'hideSelect',
        },

        keydownHandler: function(e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode === 13) {
                e.preventDefault();
                return false;
            }
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
            var product = _.findWhere(this.responseObj['#productsDd'], {_id: jobId});
            if (product) {
                product.selectedElement = false;
            }

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

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        hideSelect: function() {
            $('._categoriesList').hide();
        },

        getProducts: function (e) {
            var selectedProducts = this.$el.find('.productItem');
            var selectedLength = selectedProducts.length;
            this.$el.find('#productList').append(_.template(QuestionItem, {model: {}, id: selectedLength + 4}));
        },


        chooseOption: function (e) {
            var target = $(e.target);
            var $thisEl = this.$el;
            var id = target.attr('id');
            e.preventDefault();
            $('.newSelectList').hide();
            target.closest('.current-selected').text(target.text()).attr('data-id', target.attr('id'));
            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            var subjectId = $thisEl.find('#subject').attr('data-id');
            var subjectid = $thisEl.find('#subject').attr('id');
            var topicId = $thisEl.find('#topics').attr('data-id');
            var topicid = $thisEl.find('#topics').attr('id');
            var classesID = $thisEl.find('#classes').attr('data-id')
            var titleid = $thisEl.find('#title').attr('id')
            var titleID = $thisEl.find('#title').attr('data-id')
            if( id == classesID ){
                this.selectClasses(classesID)
            }

            if (id == subjectId) {
                this.selectTopic(classesID, subjectId, titleID);
            }

            if(id ==  topicId ){
                this.selectSubTopic(topicId)
            }

            if(id == titleID) {
                this.loadSubjects(titleID, classesID)
            }
            return false;
        },
        resetClasses: function(){
            this.responseObj['#subTopic'] = [];
            this.responseObj['#title'] = [];
            this.responseObj['#subject'] = [];
            this.responseObj['#topics'] = [];
            this.$el.find('#topics').text('Select');
            $('#topics').data('data-id', '');
            this.$el.find('#subject').text('Select');
            this.$el.find('#subTopic').text('Select');
            this.$el.find('#title').text('Select');
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

        selectClasses: function(classid){
            var self = this;
            var titles = []
            self.resetClasses();
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
                $('#subTopic').data('id', '');
                $('#subTopic').text('Select');
            }
            return false;
        },

        savenextItem: function () {
            var self = this;
            var mid = 55;
            var thisEl = this.$el;
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
            var listProducts = this.$el.find('.productList');
            var selectedProducts = this.$el.find('.productItem');
            var selectedLength = selectedProducts.length;
            var form = [];
            var data;
            var selectedLength = selectedProducts.length;
            var targetEl;
            var isValid
            var title =  thisEl.find('#title').attr('data-id')
            var classess =  thisEl.find('#classes').attr('data-id')
            var subTopics = thisEl.find('#subTopic').attr('data-id')

            if (_.isEmpty(title)) {
                return App.render({
                    type: 'error',
                    message: "title shouldn't be empty."
                });
            }

            if (_.isEmpty(classess)) {
                return App.render({
                    type: 'error',
                    message: "Class shouldn't be empty."
                });
            }

            if (!subjectName) {
                return App.render({
                    type: 'error',
                    message: "Subject Name shouldn't be empty."
                });
            }

            if (!topicName) {
                return App.render({
                    type: 'error',
                    message: "Topic Name shouldn't be empty."
                });
            }

            if (!questionName) {
                return App.render({
                    type: 'error',
                    message: "Question can't be empty."
                });
            }

            for (i = selectedLength - 1; i >= 0; i--) {
                targetEl = selectedProducts.length === i ? this.$el.find('#productItem') : $(selectedProducts[i]);
                var idName = targetEl.find('.discountValue').attr('id');
                var choice = CKEDITOR.instances[idName].getData();
                var active = targetEl.find('.active').val();
                var IsChecked = $('.active').is(':checked');

                if(!IsChecked) {
                    return App.render({
                        type: 'error',
                        message: "Tick the Correct Answer"
                    });
                }

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

            var arr = [];

            form.reverse();

            data = {
                type : choiceValue,
                point : score,
                form : [{desc : questionName, explanation: explanation, images: self.imageSrc, ans : form}],
                desc : description,
                title : title,
                subject : subjectName,
                topic : topicName,
                weightage : weightage,
                classDetail : classess,
                subTopic :subTopics != '' ? subTopics : null
            };
            this.currentModel.save({questions: data}, {
                wait   : true,
                success: function (model) {
                    if(model.attributes.success === true){
                        self.redirectAfterSave(self, model);
                        var textInput=$('#customers input[type="text"]').val('');
                        $('#answer1').html('');
                        $('#answer2').html('');
                        var textAreaInput =$('#description').val('');
                        var explanationInput =$('#explanation').val('');
                        $("input[type='checkbox']").attr("checked",false);
                        return App.render({
                            type: 'notify',
                            message:CONSTANTS.RESPONSES.CREATE_SUCCESS
                        });

                        $('#customers input[type="text"]').val('');
                    }
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });

        },

        saveItem: function () {
            var self = this;
            var mid = 55;
            var thisEl = this.$el;
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
            var selectedLength = selectedProducts.length;
            var form = [];
            var data;
            var selectedLength = selectedProducts.length;
            var targetEl;
            var isValid
            var title = thisEl.find('#title').attr('data-id')
            var classess = thisEl.find('#classes').attr('data-id')
            var subTopics = thisEl.find('#subTopic').attr('data-id')

            if (_.isEmpty(classess)) {
                return App.render({
                    type: 'error',
                    message: "Class shouldn't be empty."
                });
            }

            if (_.isEmpty(title)) {
                return App.render({
                    type: 'error',
                    message: "Title shouldn't be empty."
                });
            }

            if (!subjectName) {
                return App.render({
                    type: 'error',
                    message: "Subject Name shouldn't be empty."
                });
            }

            if (!topicName) {
                return App.render({
                    type: 'error',
                    message: "Topic Name shouldn't be empty."
                });
            }

            if (!questionName) {
                return App.render({
                    type: 'error',
                    message: "Question can't be empty."
                });
            }

            for (i = selectedLength - 1; i >= 0; i--) {
                targetEl = selectedProducts.length === i ? this.$el.find('#productItem') : $(selectedProducts[i]);
                var idName = targetEl.find('.discountValue').attr('id');
                var choice = CKEDITOR.instances[idName].getData();
                var active = targetEl.find('.active').val();
                var IsChecked = $('.active').is(':checked');
                if(!IsChecked) {
                    return App.render({
                        type: 'error',
                        message: "Tick the Correct Answer"
                    });
                }

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

            var arr = [];

            form.reverse();

            data = {
                type : choiceValue,
                point : score,
                form : [{desc : questionName, explanation: explanation, images: self.imageSrc, ans : form}],
                desc : description,
                title: title,
                subject : subjectName,
                topic : topicName,
                weightage : weightage,
                classDetail : classess,
                subTopic : subTopics != '' ? subTopics : null
            };
            this.currentModel.save({questions: data}, {
                wait   : true,
                success: function (model) {
                    App.render({
                        type: 'notify',
                        message: "Question Saved"
                    });
                    var url = 'erp/' + 'VQuestionBank';
                    Backbone.history.navigate(url + '/list', {trigger: true});

                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });

        },
        redirectAfterSave: function (content) {
            clearSample();
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        render: function () {
            var self = this;
            var $thisEl = this.$el;
            var formString;
            var template;
            this.template = _.template(CreateTemplate);

            formString = this.template({
                model             : this.currentModel.toJSON(),
            });
            $thisEl.html(formString);
            $thisEl.find('#templateDiv').html(template);
            this.$el.find('#productItemsHolder').html(_.template(QuestionItems));

            dataService.getData('/title/classDetails', {}, function (courses) {
                courses = _.map(courses.data, function (course) {
                    course.name = course.className;
                    course._id = course._id
                    return course;
                });
                self.responseObj['#classes'] = courses;
            });

            this.delegateEvents(this.events);
            return this;
        },
    });

    return CreateView;
});
