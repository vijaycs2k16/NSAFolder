define([
    'Backbone',
    'Lodash',
    'jQuery',
    'views/dialogViewBase',
    'text!templates/VBatchesManagement/batchDetails/offLineSchedule/EditTemplate.html',
    'common',
    'populate',
    'Validation',
    'vconstants',
    'views/selectView/selectView',
    'helpers/ga',
    'services/examSchedule',
    'moment',
    'dataService',
], function (Backbone, _, $, Parent, EditTemplate, common, populate, Validation, CONSTANTS, SelectView, ga, examScheduleSerivce,moment, dataService) {
    var EditView = Parent.extend({
        el             : '#content-holder',
        contentType    : 'OffLineSchedule',
        template       : _.template(EditTemplate),

        initialize: function (options) {
            _.bindAll(this, 'render', 'saveItem');
            if (options.model) {
                this.currentModel = options.model;
            } else {
                this.currentModel = options.collection.getElement();
            }
            this.collection = options.collection;
            this.responseObj = {};
            this.render();
        },

        events: {
            'mouseenter .avatar'                                              : 'showEdit',
            'mouseleave .avatar'                                              : 'hideEdit',
            'click #showBtn'                                                  : examScheduleSerivce.showBatches,
            'click ._varientBatch'                                            : examScheduleSerivce.showBatches,
            'change .productCategory'                                         : 'changeBatch',
            'change .productCenterCategory'                                   : 'changeCenter',
            'click #showCenterBtn'                                            : examScheduleSerivce.showCenters,
            'click ._varientCenter'                                           : examScheduleSerivce.showCenters,
            'click .deleteTag'                                                : 'deleteBatch',
            'click .deleteCenter'                                             : 'deleteCenters',
            'click ._enlargedItemMargin'                                      : 'closeMultiselect',
            'click #online'                                                   : 'showConfig',
            'click #offline'                                                  : 'hideConfig'
        },

        deleteBatch: function (e) {
            var $thisEl = this.$el;
            var $target = $thisEl.find(e.target);
            var id = $thisEl.find($target.closest('li')
                .find('.checkedProductCategory')[0])
                .data('id');

            e.stopPropagation();

            $thisEl.find('.productCategory[data-id="' + id + '"]')
                .prop('checked', false);
            $target.closest('li').remove();

            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }
            this.constructBatch()
        },

        constructBatch: function () {
            var $thisEl = this.$el;
            var self = this;
            this.selectBatches = []
            var checkedProductCategory = $thisEl.find('.checkedProductCategory');

            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    self.selectBatches.push($(item).data('id'));
                });
            }

            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }
        },

        notHide: function () {
            return false;
        },

        closeMultiselect : function(e) {
            var $thisEl = this.$el;
            var $categoriesBlock = $thisEl.find('._variantsBlock');
            e.stopPropagation();
            if (!$categoriesBlock.length) {
                $categoriesBlock = $thisEl.find('._variantsBlock');
            }
            if ($categoriesBlock.hasClass('open')) {
                $categoriesBlock.removeClass('open');
                $categoriesBlock.children('ul').hide();
            }
        },

        chooseOption: function (e) {
            var thisEl = this.$el;

            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

            var centerId = thisEl.find('#center').attr('data-id');
            var courseId = thisEl.find('#course').attr('data-id');
        },
        selectPaperConfig: function (centerId, courseId) {
            var self = this;
            this.$el.find('#paperConfig').text('Select');
            if (centerId !== '' && courseId !=='') {
                dataService.getData('/vassessment/sheet/center/course', {centerId: centerId, courseId: courseId}, function (papers) {
                    self.responseObj['#paperConfig'] = papers.data;
                });
            } else {
                self.responseObj['#paperConfig'] = [];
            }

        },

        selectBatch: function (centerId, courseId) {
            var self = this;
            var $thisEl = this.$el;
            var examMode = $thisEl.find('#online').prop('checked') || false;
            var offLine = $thisEl.find('#offline').prop('checked');
            if(offLine == true){
                courseId = null;
            }
            this.$el.find('#batch').text('Select');
            if (centerId !== '' && courseId !=='') {
                dataService.postData('/vbatch/center/course', {center: centerId, course: courseId}, function (err, batches) {
                    batches = _.map(batches.data, function (batch) {
                        batch.name = batch.batchName + ' - ' + batch.center.centerName;
                        return batch;
                    });
                    self.renderBatches(batches);
                    self.responseObj['#batch'] = batches;
                });
            } else {
                self.responseObj['#batch'] = [];
            }
        },

        selectCourse: function (id) {
            var self = this;
            this.$el.find('#course').text('Select');
            this.$el.find('#batch').text('Select');
            if (id !== '') {
                dataService.getData('/fcourse/center', {centerId: id}, function (courses) {
                    courses = _.map(courses.data, function (course) {
                        course.name = course.course.courseName;
                        course._id = course.course._id;
                        return course;
                    });
                    self.responseObj['#course'] = courses;
                    self.responseObj['#batch'] = [];
                });
            } else {
                self.responseObj['#course'] = [];
                self.responseObj['#batch'] = [];
            }

        },

        changeBatch : function(e){
            var $thisEl = this.$el;
            var self = this;
            var $categoryContainer = $thisEl.find('#checkedProductCategories');
            var $target = $(e.target);
            var categoryId = $target.data('id');
            var categoryName = $target.data('value');
            var idsArray = [];
            var checkedProductCategory = $thisEl.find('.checkedProductCategory');
            var checkedValues = $thisEl.find('.productCategory')
            e.stopPropagation();
            if(categoryId == '2') {
                if($target.is(':checked')) {
                    $thisEl.find('.productCategory').prop('checked', true)
                    $thisEl.find('#checkedProductCategories').empty();
                    checkedValues.each(function (key, item) {
                        if($(item).data('id') != 2) {
                            $categoryContainer.append('<li><span class="checkedProductCategory"  data-value="' + $(item).data('value') + '" data-id="' + $(item).data('id') + '">' + $(item).data('value') + '</span><span class="deleteTag icon-close3"></span></li>');
                        }

                    });
                } else {
                    $thisEl.find('#checkedProductCategories').empty();
                    $thisEl.find('.productCategory').prop('checked', false)
                }

            }

            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    idsArray.push($(item).data('id'));
                });
            }

            if(categoryId != "2") {
                if (idsArray.length && idsArray.indexOf(categoryId) >= 0) {
                    $categoryContainer.find('[data-id=' + categoryId + ']').closest('li').remove();
                } else {
                    $categoryContainer.append('<li><span class="checkedProductCategory"  data-value="' + categoryName + '" data-id="' + categoryId + '">' + categoryName + '</span><span class="deleteTag icon-close3"></span></li>');
                }
            }

            this.selectBatches = []
            var checkedProductCategory = $thisEl.find('.checkedProductCategory');

            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    self.selectBatches.push($(item).data('id'));
                });
            }

            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }
        },

        deleteCenters: function(e) {
            var $thisEl = this.$el;
            var $target = $thisEl.find(e.target);
            var id = $thisEl.find($target.closest('li')
                .find('.checkedProductCenter')[0])
                .data('id');
            e.stopPropagation();
            $('#checkedProductCategories').empty();

            $thisEl.find('.productCenterCategory[data-id="' + id + '"]')
                .prop('checked', false);
            $target.closest('li').remove();
            this.selectBatches = [];
            $thisEl.find('#productCategories').empty();
            this.changeCenter(e);
            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }
        },

        renderBatches : function(objs){
            var $thisEl = this.$el;
            var self = this;
            $thisEl.find('#productCategories').empty();
            $thisEl.find('#checkedProductCategories').empty();
            var $checkedCategoryContainer = $thisEl.find('#checkedProductCategories');
            var $categoriesBlock = $thisEl.find('#variantsCategoriesBlock');
            var $categoryContainer = $thisEl.find('#productCategories');
            var checkedSelectedId;
            var checkedName;
            if($checkedCategoryContainer.length == 1) {
                $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox allClass productCategory" id="2" data-value="ALL" data-id="2"> <span></span></label><label class="_checkboxLabel" for="2">ALL</label></li>');
            }
            var checked = 0;
            _.each(objs, function (category, index) {
                checkedName = '';
                checkedSelectedId = '';

                if (self.selectBatches.indexOf(category._id) >= 0) {
                    checked = checked + 1;
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

            if(self.selectBatches.length == checked) {
                $('.allClass').prop('checked', true)
            }
        },

        renderCenter : function(objs){
            var $thisEl = this.$el;
            var self = this;
            var $checkedCategoryContainer = $thisEl.find('#checkedProductCenter');
            var $categoriesBlock = $thisEl.find('#variantsCenterBlock');
            var $categoryContainer = $thisEl.find('#productCenterCategories');
            var checkedSelectedId;
            var checkedName;
            $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox productCenterCategory" id="1" data-value="ALL" data-id="1"> <span></span></label><label class="_checkboxLabel" for="1">ALL</label></li>');
            _.each(objs, function (category) {
                checkedName = '';
                checkedSelectedId = '';
                if (self.selectCenters.indexOf(category._id) >= 0) {
                    $categoryContainer.append('<li><label class="_customCHeckbox"><input checked="checked" type="checkbox" class="checkbox productCenterCategory" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                    checkedSelectedId = category._id;
                    checkedName = category.name;
                } else {
                    $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox productCenterCategory" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                }

                if (checkedName) {
                    $checkedCategoryContainer.append('<li><span class="checkedProductCenter"  data-value="' + checkedName + '" data-id="' + checkedSelectedId + '">' + checkedName + '</span><span class="deleteCenter icon-close3"></span></li>');
                }
            });
        },

        saveItem: function () {
            console.log('data.............')
            var self = this;
            var thisEl = this.$el;
            var data ={};
            data.name = thisEl.find('#name').val();
            data.center = this.selectCenters;
            data.course = this.courseId
            data.batches = this.selectBatches;
            data.config = thisEl.find('#examConfig').attr('data-id');
            data.paperConfig = thisEl.find('#paperConfig').attr('data-id');
            data.paperConfig1 = $.trim(thisEl.find('#paperConfig').text());
            var classStartDate = $.trim(thisEl.find('#examDate').val());
            var classEndDate = $.trim(thisEl.find('#examEndDate').val());
            data.dateBeginAhead = moment(classStartDate).format("D MMM, YYYY");
            data.dateEnd = moment(classEndDate).format("D MMM, YYYY");
            data.examMode = thisEl.find('#online').prop('checked') || false;
            var offLine = thisEl.find('#offline').prop('checked');
            data.description = $.trim(thisEl.find('#description').val());

            if (!data.name) {
                return App.render({
                    type   : 'error',
                    message: "Paper Name field can't be empty."
                });
            }
            if (!data.dateBeginAhead || data.dateBeginAhead == 'Invalid date') {
                return App.render({
                    type   : 'error',
                    message: "Start Date field can't be empty."
                });
            }
            if (!data.dateEnd || data.dateEnd == 'Invalid date') {
                return App.render({
                    type   : 'error',
                    message: "End Date field can't be empty."
                });
            }

            console.log('data.dateBeginAhead.............',data.dateBeginAhead)
            console.log('data.dateEnd.............',data.dateEnd)
            if (data.dateBeginAhead > data.dateEnd) {
                return App.render({
                    type   : 'error',
                    message: "Please select a proper dates"
                });
            }
            if(!data.center || data.center === 'Select'){
                return App.render({
                    type   : 'error',
                    message: "Please Select Center."
                });
            }

            if(_.isEmpty(data.batches)){
                return App.render({
                    type   : 'error',
                    message: "Please Select Batch."
                });
            }

            if(!data.config || data.config === 'Select'){
                return App.render({
                    type   : 'error',
                    message: "Please Select Exam Configuration."
                });
            };
            if(offLine !== true){
                if(data.paperConfig1 == 'Select')
                {
                    return App.render({
                        type   : 'error',
                        message: "Please Select PaperConfigration"
                    });
                }
            }
            if(offLine !== true){

                var paperConf = thisEl.find('#paperConfig').attr('data-id');
                var courseConf = _.filter(this.config, {_id: paperConf} );
                var courseID = courseConf.length > 0 ? courseConf[0].course : this.currentModel.toJSON().configPaper.course._id;
                data.course = courseID._id
                if(!data.paperConfig || data.paperConfig === 'Select' ){
                    return App.render({
                        type   : 'error',
                        message: "Please Select Paper Configuration."
                    });
                }
            } else {
                data.paperConfig = null
                data.course = null

            }

            if(!data.examMode){
                if (!data.description) {
                    return App.render({
                        type   : 'error',
                        message: "Description field can't be empty"
                    });
                }
            }
            this.currentModel.set(data);
            this.currentModel.urlRoot = '/vassessment/exam/schedule/';
            this.currentModel.save(this.currentModel.changed, {
                put  : true,
                wait   : true,
                success: function (model) {
                    self.hideDialog();
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash + '?schedule=offLineschedule', {trigger: true, replace: true});
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

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        render: function () {
            var self = this;
            var thisEl = this.$el;
            var data = {};

            var formString = this.template({
                model           : this.currentModel.toJSON(),
                moment          : moment
            });

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Exam Configuration',
                width      : '600px',
                buttons    : [{
                    text : 'Save',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem();
                        self.gaTrackingEditConfirm()
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }]

            });
            data.examMode = $('#offline').is(':checked')|| false;

            if(data.examMode){
                //$('.examConfigDiv').addClass('hide');
                $('.paperConfigDiv').addClass('hide');
                $('.counterWrap').removeClass('show')
            }
            else{
            }

            var batches =[]; this.selectBatches =[];
            var centerData =[]; this.selectCenters =[]; this.sCenters =[];
            _.map(this.currentModel.toJSON().batch, function (obj) {
                var batch = {};
                batch.name = obj.batchName;
                batch._id = obj._id;
                self.selectBatches.push(obj._id);
                batches.push(batch);
            });

            _.map(this.currentModel.toJSON().center, function (obj) {
                var center = {};
                center.name = obj.centerName;
                center._id = obj._id;
                self.selectCenters.push(obj._id);
                centerData.push(center);
            });

            this.courseId = this.currentModel.toJSON().paperConfig ? this.currentModel.toJSON().paperConfig.course : null;

            dataService.getData('/franchise/', {}, function (centers) {
                centers = _.map(centers.data, function (center) {
                    center.name = center.centerName;
                    return center;
                });
                self.renderCenter(centers);
                self.responseObj['#center'] = centers;
            });

            this.selectBatch(self.selectCenters, this.courseId);

            this.$el.find('#examDate').datepicker({
                changeMonth: true,
                changeYear: true,
                minDate : new Date()
            });
            this.$el.find('#examEndDate').datepicker({
                changeMonth: true,
                changeYear: true,
                minDate : new Date()
            });
            //populate.get('#center', '/franchise/', {category: 'CENTER'}, 'centerName', this, true);
            populate.get('#examConfig', '/vassessment/examconfig', {}, 'name', this, true);

            dataService.getData('/vassessment/sheet/', {}, function (config) {
                config = _.map(config, function (con) {
                    con.name = con.name + ' - ' + con.course.courseName;
                    return con;
                });
                self.config = config;
                self.responseObj['#paperConfig'] = config;
            });

            return this;
        },

        changeCenter : function(e){
            var $thisEl = this.$el;
            var self = this;
            var $categoryContainer = $thisEl.find('#checkedProductCenter');
            var $target = $(e.target);
            var categoryId = $target.data('id');
            var categoryName = $target.data('value');
            var idsArray = [];
            var checkedProductCategory = $thisEl.find('.checkedProductCenter');
            var checkedValues = $thisEl.find('.productCenterCategory')
            e.stopPropagation();

            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    idsArray.push($(item).data('id'));
                });
            }

            if(categoryId == '1') {
                if($target.is(':checked')) {
                    $thisEl.find('.productCenterCategory').prop('checked', true)
                    $thisEl.find('#checkedProductCenter').empty();
                    checkedValues.each(function (key, item) {
                        if($(item).data('id') != 1) {
                            $categoryContainer.append('<li><span class="checkedProductCenter"  data-value="' + $(item).data('value') + '" data-id="' + $(item).data('id') + '">' + $(item).data('value') + '</span><span class="deleteCenter icon-close3"></span></li>');
                        }

                    });
                } else {
                    $thisEl.find('#checkedProductCenter').empty();
                    $thisEl.find('.productCenterCategory').prop('checked', false)
                }

            }

            if(categoryId && categoryId != "1") {
                if (idsArray.length && idsArray.indexOf(categoryId) >= 0) {
                    $categoryContainer.find('[data-id=' + categoryId + ']').closest('li').remove();
                } else {
                    $categoryContainer.append('<li><span class="checkedProductCenter"  data-value="' + categoryName + '" data-id="' + categoryId + '">' + categoryName + '</span><span class="deleteCenter icon-close3"></span></li>');
                }

            }

            this.selectCenters = []
            var checkedProductCategory = $thisEl.find('.checkedProductCenter');
            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    self.selectCenters.push($(item).data('id'));
                });
            }

            var paperId = $thisEl.find('#paperConfig').attr('data-id');
            var courseObj = _.filter(this.config, {_id: paperId} );
            this.courseId = courseObj.length > 0 ? courseObj[0].course : this.currentModel.toJSON();

            this.selectBatch(self.selectCenters, this.courseId);

            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }
        }

    });



    return EditView;
});
