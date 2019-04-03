    define([
        'jQuery',
        'Underscore',
        'views/listViewBase',
        'views/selectView/selectView',
        'text!templates/VBatchesManagement/batchDetails/classSchedule/ListTemplate.html',
        'models/VBatchScheduleModel',
        'dataService',
        'async',
        'helpers',
        'Lodash',
        'populate',
        'moment',
        'common',
        'vconstants',
        'helpers/ga',
        'constants/googleAnalytics',
        'services/examManagment',
        'services/examSchedule',

    ], function ($, _, listViewBase, SelectView, listTemplate, CurrentModel, dataService, async, helpers, lodash, populate, moment, common, CONSTANTS, ga, GA, examManagmentService, examScheduleService) {
        'use strict';
        var monthObj;

        var ListView = listViewBase.extend({
            template  : _.template(listTemplate),
            listTemplate     : listTemplate,
            CurrentModel     : CurrentModel,
            contentType      : 'VSLeaveReports',
            changedModels    : {},
            responseObj      : {},
            el        : '#classScTab',

            initialize: function (options) {
                $(document).off('click');
                this.startTime = options.startTime;
                this.collection = options.collection;
                this.schedule = options.schedule;
                this.currentModel = new CurrentModel();

                this.collection.bind('add change', this.render, this);

                this.render();
            },

            events: {
                'click .searchBtn': 'renderData',
                'click .newBtn' : 'newData',
                'click .saveStatus' : 'saveItem',
                'change .topicCategories'    : 'changeTopic',
                'change .topicDataCategories'    : 'changeDTopic',
                'click #showBtn1'            : examManagmentService.showTopics,
                'click ._variantsTopics'     : examManagmentService.showTopics,
                'click #showBtn2'            : examManagmentService.showTopicData,
                'click ._variantsTopicData'     : examManagmentService.showTopicData,
                'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
                'click .delStatus': 'deleteTopic',
                'click .deleteTag1': 'deleteTags',
                'click .deleteDataTag1': 'deleteTag',
                'click td.editable, .current-selected'             : 'showNewSelect',
                'input .multiSelectSearch'   : examManagmentService.multiSelectSearch
            },


            deleteTag: function(e) {
                var $thisEl = this.$el;
                var $target = $thisEl.find(e.target);
                var id = $thisEl.find($target.closest('li')
                    .find('.checkedDataTopics')[0])
                    .data('id');

                e.stopPropagation();
                //$thisEl.find('.productCenterCategory').prop('checked', false)
                $('#checkedProductCategories').empty();

                $thisEl.find('.topicDataCategories[data-id="' + id + '"]')
                    .prop('checked', false);
                $target.closest('li').remove();
                this.selectBatches = [];
                // $thisEl.find('#productCategories').empty();
                //$thisEl.find('.productCategory').prop('checked', false);
                //this.changeCenter(e);
                if (typeof this.useFilter === 'function') {
                    this.useFilter();
                }
            },

            deleteTags: function(e) {
                var $thisEl = this.$el;
                var $target = $thisEl.find(e.target);
                var id = $thisEl.find($target.closest('li')
                    .find('.checkedTopics')[0])
                    .data('id');

                e.stopPropagation();
                //$thisEl.find('.productCenterCategory').prop('checked', false)
                $('#checkedProductCategories').empty();

                $thisEl.find('.topicCategories[data-id="' + id + '"]')
                    .prop('checked', false);
                $target.closest('li').remove();
                this.selectBatches = [];
                // $thisEl.find('#productCategories').empty();
                //$thisEl.find('.productCategory').prop('checked', false);
                //this.changeCenter(e);
                if (typeof this.useFilter === 'function') {
                    this.useFilter();
                }
            },

            getTopicsBySubjects : function(ids, holder){
                var $thisEl = this.$el;
                var self = this;
                //this.resetTopics();
                var TopicDats = [];
                dataService.getData('/vcourse/subtopics/'+ ids[0], {topics: ids}, function (topics) {
                    //var data = topics.data.length > 0 ? topics.data[0].subtopic : null
                    var data = topics.data
                    _.map(data, function(topic){
                        _.map(topic.subtopic, function (topicName) {
                            topicName.name = topicName.name;
                            TopicDats.push(topicName)
                        })
                        self.responseObj['#subtopics'] = TopicDats;
                        self.renderTopics(TopicDats, holder);
                    })

                });


            },

            resetTopics: function(){
                this.$el.find('#topicCategories').empty();
                this.$el.find('#checkedTopics').empty();
            },

            changeTopic : function(e){
                var $thisEl = this.$el;
                var self = this;
                var $categoryContainer =$(e.target).parent().parent().parent().parent().parent().find('#checkedTopics');
                var $target = $(e.target);
                var categoryId = $target.data('id');
                var categoryName = $target.data('value');
                var checkedProductCategory = $(e.target).parent().parent().parent().parent().parent().find('.checkedTopics');
                var idsArray = [];
                if (checkedProductCategory && checkedProductCategory.length) {
                    checkedProductCategory.each(function (key, item) {
                        idsArray.push($(item).data('id'));
                    });
                }

                e.stopPropagation();

                if (idsArray.length && idsArray.indexOf(categoryId) >= 0) {
                    $categoryContainer.find('[data-id=' + categoryId + ']').closest('li').remove();
                } else {
                    $categoryContainer.append('<li><span class="checkedTopics"  data-value="' + categoryName + '" data-id="' + categoryId + '">' + categoryName + '</span><span class="deleteTag1 icon-close3"></span></li>');
                }
                var checkedProductCategory = $thisEl.find('.checkedTopics');
                this.selectsubTopics = []
                if (checkedProductCategory && checkedProductCategory.length) {
                    checkedProductCategory.each(function (key, item) {
                        self.selectsubTopics.push($(item).data('id'));
                    });
                }

                if (typeof this.useFilter === 'function') {
                    this.useFilter();
                }
            },

            changeDTopic : function(e){
                var $thisEl = this.$el;
                var self = this;
                var $categoryContainer =$(e.target).parent().parent().parent().parent().parent().find('#checkedDataTopics');
                var $target = $(e.target);
                var categoryId = $target.data('id');
                var categoryName = $target.data('value');
                var checkedProductCategory = $(e.target).parent().parent().parent().parent().parent().find('.checkedDataTopics');
                var idsArray = [];
                if (checkedProductCategory && checkedProductCategory.length) {
                    checkedProductCategory.each(function (key, item) {
                        idsArray.push($(item).data('id'));
                    });
                }

                e.stopPropagation();

                if (idsArray.length && idsArray.indexOf(categoryId) >= 0) {
                    $categoryContainer.find('[data-id=' + categoryId + ']').closest('li').remove();
                } else {
                    $categoryContainer.append('<li><span class="checkedDataTopics"  data-value="' + categoryName + '" data-id="' + categoryId + '">' + categoryName + '</span><span class="deleteDataTag1 icon-close3"></span></li>');
                }

                var checkedProductCategory = $(e.target).parent().parent().parent().parent().parent().find('.checkedDataTopics');
                this.selectsubTopics = []
                if (checkedProductCategory && checkedProductCategory.length) {
                    checkedProductCategory.each(function (key, item) {
                        self.selectsubTopics.push($(item).data('id'));

                    });
                }
                this.getTopicsBySubjects(self.selectsubTopics, $(e.target).parent().parent().parent().parent().parent())
                if (typeof this.useFilter === 'function') {
                    this.useFilter();
                }
            },

            renderTopics : function(objs, holder){
                var $thisEl = this.$el;
                var self = this;
                self.selectSubTopics = [];
                var $checkedCategoryContainer = holder.parent().parent().find('#checkedTopics');
                var $categoriesBlock = holder.parent().parent().find('#topicBlocks');
                var $categoryContainer =holder.parent().parent().find('#topicCategories');
                var checkedSelectedId;
                var checkedName;

                var checkedProductCategory = holder.closest('td').next('td').find('.checkedTopics');
                if (checkedProductCategory && checkedProductCategory.length) {
                    checkedProductCategory.each(function (key, item) {
                        console.log("holder.closest('td').next('td').find('.checkedDataTopics')", $(item).data('id'))
                        self.selectSubTopics.push({"_id": $(item).data('id'), "name": $(item).text()} );
                    });
                }
                $categoryContainer.empty();

                $categoryContainer.append('<input type="text" id="myTopicInput" class="multiSelectSearch"   placeholder="Search for topics.." title="Type in a topics">')
                _.each(objs, function (category) {

                    checkedName = '';
                    checkedSelectedId = '';

                    if (self.selectSubTopics.indexOf(category._id) >= 0) {
                        $categoryContainer.append('<li><label class="_customCHeckbox"><input checked="checked" type="checkbox" class="checkbox topicCategories" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                        checkedSelectedId = category._id;
                        checkedName = category.name;
                    } else {
                        $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox topicCategories" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                    }

                    if (checkedName) {
                        $checkedCategoryContainer.append('<li><span class="checkedTopics"  data-value="' + checkedName + '" data-id="' + checkedSelectedId + '">' + checkedName + '</span><span class="deleteTag1 icon-close3"></span></li>');
                    }
                });

            },

            renderTopicData : function(objs, holder){
                var $thisEl = this.$el;
                var self = this;
                self.selectTopics = []
                var $checkedCategoryContainer =holder.closest('td').next('td').find('#checkedTopicData');
                var $categoriesBlock = holder.closest('td').next('td').find('#topicDataBlocks');
                var $categoryContainer =holder.closest('td').next('td').find('#topicDataCategories');
                var checkedSelectedId;
                var checkedName;
                var checkedProductCategory = holder.closest('td').next('td').find('.checkedDataTopics');
                if (checkedProductCategory && checkedProductCategory.length) {
                    checkedProductCategory.each(function (key, item) {
                        console.log("holder.closest('td').next('td').find('.checkedDataTopics')", $(item).data('id'))
                        self.selectTopics.push({"_id": $(item).data('id'), "name": $(item).text()} );
                    });
                }
                $categoryContainer.empty();
                $categoryContainer.append('<input type="text" id="myTopicDataInput" class="multiSelectSearch"   placeholder="Search for topics.." title="Type in a topics">')
                _.each(objs, function (category) {

                    checkedName = '';
                    checkedSelectedId = '';

                    if (self.selectTopics.indexOf(category.name) >= 0) {
                        $categoryContainer.append('<li><label class="_customCHeckbox"><input checked="checked" type="checkbox" class="checkbox topicDataCategories" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                        checkedSelectedId = category._id;
                        checkedName = category.name;
                    } else {
                        $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox topicDataCategories" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                    }

                    if (checkedName) {
                        $checkedCategoryContainer.append('<li><span class="checkedTopicData"  data-value="' + checkedName + '" data-id="' + checkedSelectedId + '">' + checkedName + '</span><span class="deleteDataTag1 icon-close3"></span></li>');
                    }
                });

            },

            deleteTopic: function (e) {
                var tr = $(e.target).closest('tr');
                var id = tr.attr('id');
                var answer = confirm('Really DELETE items ?!');
                e.preventDefault();
                e.stopPropagation();
                var self = this;

                if (answer === true) {
                    if(id) {
                        dataService.deleteData('/vbatchSchedule/' + id, {}, function (err) {
                            self.$el.find('tr[id="' + id + '"]').remove();
                        });
                    } else {
                        this.t
                            .row( $(e.target).parents('tr') )
                            .remove()
                            .draw();
                    }

                }
            },

            saveItem: function (e) {

                var thisEl = this.$el;
                var self = this;
                var centerName = thisEl.find('#centerC').attr('data-id');
                var batch = thisEl.find('#batch_CS').attr('data-id');
                var course = thisEl.find('#course_CS').attr('data-id');
                var selectedProducts = $(e.target).closest('tr');
                var selectedLength = selectedProducts.length;
                var targetEl;
                var i;
                var body = [];
                var ids = [];

                if(!centerName){
                    return App.render({
                        type: 'error',
                        message: 'Please Select Center'
                    })
                }



                if(selectedLength === 0){
                    return App.render({
                        type: 'error',
                        message: 'Please add one batch at least'
                    })
                }

                    targetEl = $(selectedProducts);
                    var _id = targetEl.attr('id');
                    if(_id) {
                        ids.push(_id)
                    }
                    var  checkedProductCategory = targetEl.find('.checkedTopics')
                    var  checkedTopicCategory = targetEl.find('.checkedDataTopics')


                this.selectsubTopics = []
                if (checkedProductCategory && checkedProductCategory.length) {
                    checkedProductCategory.each(function (key, item) {
                        self.selectsubTopics.push({"_id": $(item).data('id'), "name": $(item).text()} );
                    });
                }

                this.selectTopics = []
                if (checkedTopicCategory && checkedTopicCategory.length) {
                    checkedTopicCategory.each(function (key, item) {
                        self.selectTopics.push({"_id": $(item).data('id'), "name": $(item).text()} );
                    });
                }

                    var subject = targetEl.find('#subject').attr('data-id');
                    var type = targetEl.find('#type').attr('data-id');
                    var faculty = targetEl.find('#faculty').attr('data-id');
                    var classDate1 = $.trim(targetEl.find('.classDate').val());
                    var classDate = moment(classDate1).format("D MMM, YYYY")
                    var topics = targetEl.find('#topics').attr('data-id');
                    var topicName = targetEl.find('#topics').text();
                    var feedback = targetEl.find('#name').val()
                    var subtopics  = this.selectsubTopics;
                    var classStartTime = this.getTimeForDate(moment(targetEl.find('.timepickerOne').val(), ["h:mm A"]).format("HH:mm").split(':'));
                    var classEndTime = this.getTimeForDate(moment(targetEl.find('.timepickerTwo').val(), ["h:mm A"]).format("HH:mm").split(':'));
                    var start = moment.utc(classStartTime, "HH:mm");
                    var end = moment.utc(classEndTime, "HH:mm");
                    var d = moment.duration(end.diff(start));
                    var classhrs = moment.utc(+d).format('H:mm');
                    var sDate = $.trim(targetEl.find('.timepickerOne').val());
                    var eDate = $.trim(targetEl.find('.timepickerTwo').val());



                if(!type || type == '<%=elem.type ? elem.type: null%>'){
                    return App.render({
                        type: 'error',
                        message: 'Please Select Type'
                    });
                }


                if(!batch){
                        return App.render({
                            type: 'error',
                            message: 'Please Select Batch'
                        });
                    }

                    if(!subject){
                        return App.render({
                            type: 'error',
                            message: 'Please Select Subject'
                        });
                    }

                    if(self.selectTopics.length == 0){
                        return App.render({
                            type: 'error',
                            message: 'Please Select Topic'
                        });
                    }

                    if(!faculty){
                        return App.render({
                            type: 'error',
                            message: 'Please Select Faculty'
                        });
                    }

                    if(!sDate){
                        return App.render({
                            type: 'error',
                            message: 'Please Select Start Time'
                        });
                    }

                    if(!eDate){
                        return App.render({
                            type: 'error',
                            message: 'Please Select End Time'
                        });
                    }

                    body.push({
                        id: _id,
                        center: centerName,
                        type: type,
                        faculty: faculty,
                        classDate: classDate,
                        batch: batch,
                        course: course,
                        subject: subject,
                        topics: topics,
                        classDetail: this.classId,
                        classStartTime: classStartTime,
                        classEndTime: classEndTime,
                        classhrs: classhrs,
                        subtopics: subtopics,
                        feedback: feedback,
                        topicDetails : self.selectTopics
                    });

                this.currentModel.save({ids: ids, data: body}, {
                    wait: true,
                    success: function (model) {
                        //Backbone.history.fragment = '';
                        //Backbone.history.navigate(window.location.hash + '?schedule=schedule', {trigger: true, replace: true});
                        return App.render({
                            type: 'notify',
                            message:CONSTANTS.RESPONSES.CREATE_SUCCESS

                        });
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
                this.renderData();

            },

            getTimeForDate: function(date){
                var hours = date[0] ? date[0] : '';
                var minutes = date[1] ? date[1] : '';

                return moment(new Date()).hours(hours).minutes(minutes).toDate();
            },

            showNewSelect: function (e) {

                var $target = $(e.target);

                e.stopPropagation();

                if ($target.attr('id') === 'selectInput') {
                    return false;
                }

                if (this.selectView) {
                    this.selectView.remove();
                }

                if ($target.hasClass('current-selected')) {

                    this.selectView = new SelectView({
                        e          : e,
                        responseObj: this.responseObj,
                        number     : 12
                    });
                    $target.append(this.selectView.render().el);

                } else {

                    this.selectView = new SelectView({
                        e          : e,
                        responseObj: this.responseObj
                    });

                    $target.append(this.selectView.render().el);

                }

                return false;
            },

            loadCourse: function (id) {
                var self = this;
                if (id !== '') {
                    dataService.getData('/fcourse/center', {centerId: id}, function (courses) {
                        courses = _.map(courses.data, function (course) {
                            course._id = course.course._id
                            course.id = course.course._id
                            course.name = course.course.courseName;
                            return course;
                        });
                        self.courses = courses;
                        self.responseObj['#course_CS'] = courses;
                    });
                } else {
                    self.responseObj['#course_CS'] = [];
                }
            },

            loadClasses: function (id) {
                var self = this;
                if (id !== '') {
                    dataService.getData('/vcourse/class/' + id, {}, function (classes) {
                        if(classes.data) {
                            classes = _.map(classes.data.classDetail, function (classObj) {
                                classObj._id = classObj._id
                                classObj.id = classObj._id
                                classObj.name = classObj.className;
                                return classObj;
                            });
                            self.classes = classes;
                            self.responseObj['#class_CS'] = classes;
                        } else {
                            self.responseObj['#class_CS'] = [];
                        }

                    });
                } else {
                    self.responseObj['#class_CS'] = [];
                }
            },

            loadEmployee: function (id) {
                var self = this;
                if (id !== '') {
                    dataService.getData('/employees/getForDD', {isEmployee: true, department: '5ad4869ea3acc70f28c50620'}, function (employees) {
                        employees = lodash.filter(employees.data, function (v) {
                            if(!_.isUndefined(v.center)){
                                return v.center._id === id;
                            }
                        });
                        employees = _.map(employees, function (employee) {
                            employee.name = employee.name.first + ' ' + employee.name.last;
                            return employee;
                        });
                        self.responseObj['#faculty'] = employees;
                    });
                } else {
                    self.responseObj['#faculty'] = [];
                }
            },

            loadBatches: function(id){
                var self = this;
                dataService.getData('/vbatch/center/course', {a: 'BATCH', count: 10000, centerId: this.centerId, courseId: id}, function (batches) {
                    batches = _.map(batches.data, function (batch) {
                        if(!lodash.isEmpty(batch) && !lodash.isEmpty(batch.course) ) {
                            batch._id = batch._id;
                            batch.name = batch.batchName;
                        }
                        return batch;
                    });
                    self.batches = batches;
                    self.responseObj['#batch_CS'] = batches;
                });
            },

            loadClass: function(id){
                var self = this;
                dataService.getData('/vbatch/center/course', {a: 'BATCH', count: 10000, centerId: this.centerId, courseId: id}, function (batches) {
                    batches = _.map(batches.data, function (batch) {
                        if(!lodash.isEmpty(batch) && !lodash.isEmpty(batch.course) ) {
                            batch._id = batch._id;
                            batch.name = batch.batchName;
                        }
                        return batch;
                    });
                    self.batches = batches;
                    self.responseObj['#batch_CS'] = batches;
                });
            },

            loadSubject: function(){
                var self = this;
                dataService.getData('/vsubject/details/' + this.classId, {category: 'SUBJECT'} , function (subjects) {
                    subjects = _.map(subjects.data, function (subject) {
                        if(!lodash.isEmpty(subject)) {
                            subject._id = subject.subject._id;
                            subject.name = subject.subject.subjectName;
                        }
                        return subject;
                    });
                    self.responseObj['#subject'] = subjects;
                });
            },

            loadType: function(){
                var self = this;
                self.responseObj['#type'] = [{'_id': 'Class', 'name': 'Class'}, {'_id': 'Exam', 'name': 'Exam'}];
            },

            chooseOption: function (e) {
                var $thisEl = this.$el;
                var $target = $(e.target);
                var $td = $target.closest('td');
                var parentUl = $target.parent();
                var $element = $target.closest('a') || parentUl.closest('a');
                var id = $element.attr('id') || parentUl.attr('id');

                var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
                holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

                var centerId = $thisEl.find('#centerC').attr('data-id');
                if(id == 'centerC') {
                    this.centerId = centerId;
                    this.loadCourse(centerId);
                } else if(id == 'course_CS') {
                    this.courseId = $(e.target).attr('id');
                    this.loadBatches($(e.target).attr('id'))
                    this.loadClasses($(e.target).attr('id'))
                } else if(id == 'subject') {
                    $(e.target).find('#topics').text('Select');
                    $(e.target).find('#topics').attr('data-id', '');
                    $(e.target).find('#subtopics').text('Select');
                    $(e.target).find('#subtopics').attr('data-id', '');
                    $(e.target).find('#faculty').text('Select');
                    $(e.target).find('#faculty').attr('data-id', '');
                    this.selectTopic($(e.target).attr('id'),this.courseId, holder);
                } else if(id == 'topics') {
                    this.getTopicsBySubjects($(e.target).attr('id'), holder)
                } else if(id == 'class_CS') {
                    this.classId = $(e.target).attr('id');
                    this.className = $(e.target).text();
                }

            },


            selectTopic: function (sid, cid, holder) {
                var self = this;
                if (sid !== '' && cid !== '') {
                    dataService.getData('/vtopic/subject/course', {subject: sid, course: cid, classId: this.classId}, function (topics) {
                        var topics =  lodash.flatMap(topics.data, ele => lodash(ele.topics).map(topic => ({name : topic.name, _id : topic._id})).value());
                        self.responseObj['#topics'] = topics;
                        self.renderTopicData(topics, holder);
                    });
                } else {
                    self.responseObj['#topics'] = [];
                }
                return false;
            },

            render: function () {
                var $currentEl = this.$el;
                var self = this;
                var $thisEl = this.$el;
                $currentEl.html('');
                var centerId = $thisEl.find('#centerC').attr('data-id');
                var subjectId = $thisEl.find('#subject_CS').attr('data-id');
                var result = [] ;

                $('.ui-dialog ').remove();
                $('#top-bar-deleteBtn').hide();

                dataService.getData('/franchise/', {}, function (centers) {
                    centers = _.map(centers.data, function (center) {
                        center.name = center.centerName;
                        return center;
                    });
                    self.centers = centers;
                    self.responseObj['#centerC'] = centers;
                });

               /* dataService.getData('/vsubject/', {category: 'SUBJECT'} , function (subjects) {
                    subjects = _.map(subjects.data, function (subject) {
                        if(!lodash.isEmpty(subject)) {
                            subject.name = subject.subjectName;
                        }
                        return subject;
                    });
                    self.subjects = subjects;
                    self.responseObj['#subject_CS'] = subjects;
                });

                self.responseObj['#month'] = months;
*/
                dataService.getData('/permission/tabs', {module : CONSTANTS.MID.VBatchesManagement,moduleId: CONSTANTS.MID.BatchSchedule}, function (data) {
                    self.permissionObj = data.data;
                    var className =  (data.data.tab) ? 'active' : '';
                    $('#classSch').addClass(className);
                    $('#classScTab').addClass(className)

                    if(data.data.read) {
                        $('#classSch').removeClass('hide')
                        $('#classScTab').removeClass('hide')
                    } else {
                        $('#classSch').addClass('hide')
                        $('#classScTab').addClass('hide')
                    }
                    if(centerId !== '' && subjectId !== '' ) {
                        dataService.getData('/Vacation/leave', {centerId: centerId, subjectId: subjectId}, function (resultObj) {
                            result = resultObj;
                        });
                    }
                    $currentEl.html(_.template(listTemplate, {
                        data            : '',
                        collection      : result,
                        lodash          : lodash,
                        dataPermission  : data,
                        permissionObj   : self.permissionObj,
                        monthObj        : monthObj,
                        moment          : moment
                    }));
                    setTimeout(function () {
                        common.datatableInitWithoutExport('example5')
                    }, 500)
                });

            },

            getProducts: function (obj) {
                if(obj.data){
                    for(var i = 0; i < obj.data.length; i++){
                        var classDate = obj.data[i].classDate;
                        var classDate1 = moment(classDate).format("D MMM, YYYY");
                        var classStartTime = obj.data[i].classStartTime;
                        var classEndTime = obj.data[i].classEndTime;
                        var time = moment(classStartTime).format('H:mm:ss');
                        var time1 = moment(classEndTime).format('H:mm:ss');

                        this.$el.find('#classDate' + i).datepicker({
                            changeMonth: true,
                            changeYear: true
                        });

                        this.$el.find('#timepickerOne' + i).timepicki({
                            now            : time,
                            showSeconds    : true, //Whether or not to show seconds,
                            secondsInterval: 1, //Change interval for seconds, defaults to 1,
                            minutesInterval: 1
                        });
                        this.$el.find('#timepickerTwo' +  i).timepicki({
                            now            : time1,
                            showSeconds    : true, //Whether or not to show seconds,
                            secondsInterval: 1, //Change interval for seconds, defaults to 1,
                            minutesInterval: 1
                        });

                    }
                } else {
                    this.$el.find('#classDate').datepicker({
                        changeMonth: true,
                        changeYear: true
                    });
                    this.$el.find('#productList').prepend(_.template(BatchItem, {model: {}}));
                    this.$el.find('.timepickerOne').timepicki({
                        showSeconds    : true, //Whether or not to show seconds,
                        secondsInterval: 1, //Change interval for seconds, defaults to 1,
                        minutesInterval: 1
                    });
                    this.$el.find('.timepickerTwo').timepicki({
                        showSeconds    : true, //Whether or not to show seconds,
                        secondsInterval: 1, //Change interval for seconds, defaults to 1,
                        minutesInterval: 1
                    });
                }
            },

            newData: function (e) {
                var index = this.$el.find('.productItem').length;
                e.stopPropagation();
                this.t.row.add( [
                    /*'Class',*/
                    '<div class="_animateSelectBox"> <div class="_newSelectListWrap"> <a id="type"name="type"class="current-selected"data-id="<%=elem.type ? elem.type: null%>"href="javascript:;">Select Type</a> </div> <span class="tips " data-id="subject"></span> </div>',
                    '<div class="_animateSelectBox"> <div class="_newSelectListWrap"> <a id="subject"name="subject"class="current-selected"data-id=""href="javascript:;">Subject Name</a> </div> <span class="tips " data-id="subject"></span>',
                    '<div id="topicDataBlocks" class="_variantsBlock _variantsTopics" style="width:200px;"> <div class="_checkCategoriesWrap"> <ul id="checkedDataTopics" class="_checkCategories"> </ul> <span id="showBtn2" class="_arrow"></span> </div> <ul id="topicDataCategories" class="_categoriesList"> </ul> </div>',
                   '<div id="topicBlocks" class="_variantsBlock _variantsTopics" style="width:200px;"> <div class="_checkCategoriesWrap"> <ul id="checkedTopics" class="_checkCategories"></ul> <span id="showBtn1" class="_arrow"></span> </div> <ul id="topicCategories" class="_categoriesList"></ul> </div>',
                   '<div class="_animateSelectBox"> <div class="_newSelectListWrap"> <a id="faculty"name="faculty"class="current-selected"data-id=""href="javascript:;">Faculty Name</a> </div> <span class="tips " data-id="subject"></span>',
                    '<div class="_animateInputBox "> <input class="_animate extrainfo classDate"type="text"name="classDate"id="classDate' + index + '"value=""readonly placeholder="Class Date"/> </div>',
                    '<div class="_animateinputbox _withtime _withinfo"> <div class="inputdateactionblock" style="position: relative; display: block; padding: 0 20px 0 0; border: none; min-height: 26px; cursor: pointer; border-bottom: 1px solid #c8c8d3; font-size: 13px; color: #999 !important; "> <input maxlength="2"name="time"class="timepickerOne"id="timepickerOne' + index + '" value=""readonly/> </div> <span class="tips " data-id="classStartTime"></span>',
                    '<div class="_animateinputbox _withtime _withinfo"> <div class="inputdateactionblock" style="position: relative; display: block; padding: 0 20px 0 0; border: none; min-height: 26px; cursor: pointer; border-bottom: 1px solid #c8c8d3; font-size: 13px; color: #999 !important; "> <input maxlength="2"name="time"class="timepickerTwo"id="timepickerTwo' + index + '" value=""readonly/> </div> <span class="tips " data-id="classEndTime"></span>',
                    '<div class="_animateInputBox _withInfo"> <input type="text"class="_animate "id="name"required value=""/> <span class="tips icon-info" data-id="name"></span> </div>',
                    '<div class="SaveCancel"><a href="javascript:;" class="icon-checked goToEdit _actionCircleBtn show visibleVisble saveStatus" aria-hidden="true"></a><a href="javascript:;" class="icon-trash goToRemove _actionCircleBtn show visibleVisble delStatus" aria-hidden="true"></a></div>'
                ] ).draw( );

                this.$el.find('#classDate' + index).datepicker({
                    changeMonth: true,
                    changeYear: true
                });
                this.$el.find('#timepickerOne' + index).timepicki({
                    showSeconds    : true, //Whether or not to show seconds,
                    secondsInterval: 1, //Change interval for seconds, defaults to 1,
                    minutesInterval: 1
                });
                this.$el.find('#timepickerTwo' + index).timepicki({
                    showSeconds    : true, //Whether or not to show seconds,
                    secondsInterval: 1, //Change interval for seconds, defaults to 1,
                    minutesInterval: 1
                });

            },

            selectSubTopic: function(subTopic){
                var self = this;
                if (subTopic !== '') {
                    dataService.getData('/vcourse/subtopics/'+ subTopic, {}, function (topics) {
                        var data = topics.data.length > 0 ? topics.data[0].subtopic : null
                        var TopicDats = [];
                        _.map(data, function(topic){
                            topic.name = topic.name;
                            TopicDats.push(topic)
                        })
                        self.responseObj['#subtopics'] = TopicDats;
                    });
                } else {
                    self.responseObj['#subtopics'] = [];
                    $('#subtopics').data('id', '');
                    $('#subtopics').text('Select');
                }
                return false;
            },


            renderData: function () {
                var $currentEl = this.$el;
                var self = this;
                var $thisEl = this.$el;
                var centerId = $thisEl.find('#centerC').attr('data-id');
                var courseId = $thisEl.find('#course_CS').attr('data-id');
                var bId = $thisEl.find('#batch_CS').attr('data-id');
                var center = lodash.filter(this.centers, {'_id': centerId});
                var course = lodash.filter(this.courses, {'_id': courseId});
                var batch = lodash.filter(this.batches, {'_id': bId});
                var classObj = lodash.filter(this.classes, {'_id': this.classId});
                var dataObj = {center: center.length > 0 ? center[0]: {}, course: course.length > 0 ? course[0] : {}, batch: batch.length > 0 ? batch[0] : {}, classObj: classObj.length > 0 ? classObj[0] : {}};
                //self.loadBatches(centerId);
                self.loadEmployee(centerId);
                self.loadSubject();
                self.loadType()

                $('.ui-dialog ').remove();
                $('#top-bar-deleteBtn').hide();

                if (!center.length) {
                    return App.render({
                        type: 'error',
                        message: "Select the center from the list."
                    });
                }

                if (!course.length) {
                    return App.render({
                        type: 'error',
                        message: "Select the course from the list."
                    });
                }
                if (!batch.length) {
                    return App.render({
                        type: 'error',
                        message: "Select the batch from the list."
                    });
                }
                dataService.getData('/permission/tabs', {module : CONSTANTS.MID.VBatchesManagement,moduleId: CONSTANTS.MID.BatchSchedule}, function (data) {
                    self.permissionObj = data.data;
                    dataService.getData('/vsubject/batch', {center: centerId, course: courseId, batch: bId, classId: self.classId}, function (result) {
                        var target = document.getElementById('loading');
                        $(target).fadeIn();
                        $currentEl.html(_.template(listTemplate, {
                            permissionObj: self.permissionObj,
                            data            : dataObj,
                            collection      : result.data,
                            lodash          : lodash,
                            dataPermission  : data,
                            monthObj        : monthObj,
                            moment          : moment
                        }));
                        self.getProducts({ data: result.data });
                        var className = self.permissionObj.create ? '' : 'hide';
                        setTimeout(function () {
                        self.t  =  $('#example5').DataTable( {
                            "destroy": true,
                            'order' : [[1,'desc']],
                            dom: 'lBfrtip',
                            buttons: [
                                {
                                    text: 'New',
                                    className: 'btn btnBlue blue newBtn ' + className,

                                }
                            ]
                        } );
                            $('#loading').hide();
                        }, 500)

                    });
                });

            }

        });

        return ListView;
    });
