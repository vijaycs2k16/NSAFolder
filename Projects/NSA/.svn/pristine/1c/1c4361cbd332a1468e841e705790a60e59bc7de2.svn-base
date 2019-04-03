define([
    'Backbone',
    'jQuery',
    'Lodash',
    'text!templates/VBatchesManagement/batchDetails/offLineSchedule/CreateTemplate.html',
    'models/VExamScheduleModel',
    'common',
    'populate',
    'Validation',
    'views/selectView/selectView',
    'views/dialogViewBase',
    'helpers/ga',
    'dataService',
    'moment',
    'services/examSchedule',
    'vconstants',
], function (Backbone, $, _, CreateTemplate, VExamScheduleModel, common, populate, Validation, SelectView, DialogViewBase, ga, dataService, moment, examScheduleService, CONSTANTS) {

    var UsersCreateView = DialogViewBase.extend({
        el         : '#content-holder',
        contentType: 'OffLineSchedule',
        template   : _.template(CreateTemplate),
        imageSrc   : '',
        initialize : function (options) {
            options = options || {};

            this.currentModel = new VExamScheduleModel();

            this.collection = options.collection;
            _.bindAll(this, 'saveItem');
            this.responseObj = {};
            this.render();
        },

        events: {
            'mouseenter .avatar'        : 'showEdit',
            'mouseleave .avatar'        : 'hideEdit',
            'click #showBtn'            : examScheduleService.showBatches,
            'click ._varientBatch'     : examScheduleService.showCenters,
            'change .productCategory'   : 'changeBatch',
            'change .productCenterCategory' : 'changeCenter',
            'click .deleteTag '         : examScheduleService.deleteBatch,
            'click #showCenterBtn'      : examScheduleService.showCenters,
            'click ._varientCenter'     : examScheduleService.showCenters,
            'click .deleteCenter'       : 'deleteCenters',
            'click ._enlargedItemMargin' : 'closeMultiselect',
        },

        notHide: function () {
            return false;
        },

        chooseOption: function (e) {
            var thisEl = this.$el;

            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

            var centerId = thisEl.find('#center').attr('data-id');
            var courseId = thisEl.find('#course').attr('data-id');

            if (holder.attr('id') === 'center') {
                this.selectCourse(centerId);
            }
            if (holder.attr('id') === 'course') {
                this.selectBatch(centerId, courseId);
                // this.selectPaperConfig(centerId, courseId);
            }
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

        renderBatches : function(objs){
            var $thisEl = this.$el;
            $thisEl.find('#productCategories').empty();
            $thisEl.find('#checkedProductCategories').empty();
            var $checkedCategoryContainer = $thisEl.find('#checkedProductCategories');
            var $categoriesBlock = $thisEl.find('#variantsCategoriesBlock');
            var $categoryContainer = $thisEl.find('#productCategories');
            var checkedSelectedId;
            var checkedName;

            if($checkedCategoryContainer.length == 1) {
                $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox productCategory" id="2" data-value="ALL" data-id="2"> <span></span></label><label class="_checkboxLabel" for="2">ALL</label></li>');
            }

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
        },

        selectBatch: function (centerId, courseId) {
            var self = this;
            this.$el.find('#batch').text('Select');
            if (centerId !== '' ) {
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

            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    idsArray.push($(item).data('id'));
                });
            }

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

            if(categoryId != '2') {
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

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;
            var data = {}
            data.name = thisEl.find('#name').val();
            data.center = this.selectCenters;
            data.course = this.courseId;
            data.batches = this.selectBatches
            data.config = thisEl.find('#examConfig').attr('data-id');
            data.paperConfig = thisEl.find('#paperConfig').attr('data-id');
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
            if (data.dateBeginAhead > data.dateEnd) {
                return App.render({
                    type   : 'error',
                    message: "Please select a proper date"
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
            }

            if(!data.examMode){
                if (!data.description) {
                    return App.render({
                        type   : 'error',
                        message: "Description field can't be empty"
                    });
                }
            }

            this.currentModel.save(data, {
                wait: true,
                success: function (model) {
                    self.hideDialog();
                    Backbone.history.fragment = '';
                    Backbone.history.navigate(window.location.hash + '?schedule=offLineschedule', {trigger: true, replace: true});
                    return App.render({
                        type: 'notify',
                        message:CONSTANTS.RESPONSES.CREATE_SUCCESS
                    });
                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                },

            });
            this.render();

        },

        render: function () {
            var formString = this.template();
            var self = this;
            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                width      : '600',
                title      : 'Create',
                buttons    : {
                    save: {
                        text : 'Create',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                            self.gaTrackingConfirmEvents();
                        }
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                            ga && ga.trackingEditCancel();
                        }
                    }
                }
            });

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

            dataService.getData('/franchise/', {}, function (centers) {
                centers = _.map(centers.data, function (center) {
                    center.name = center.centerName;
                    return center;
                });
                self.renderCenters(centers);
                self.responseObj['#center'] = centers;
            });

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

        deleteCenters: function(e) {
            var $thisEl = this.$el;
            var $target = $thisEl.find(e.target);
            var id = $thisEl.find($target.closest('li')
                .find('.checkedProductCenter')[0])
                .data('id');

            e.stopPropagation();
            //$thisEl.find('.productCenterCategory').prop('checked', false)
            $('#checkedProductCategories').empty();

            $thisEl.find('.productCenterCategory[data-id="' + id + '"]')
                .prop('checked', false);
            $target.closest('li').remove();
            this.selectBatches = [];
            $thisEl.find('#productCategories').empty();
            $thisEl.find('.productCategory').prop('checked', false);
            this.changeCenter(e);
            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }
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

            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    idsArray.push($(item).data('id'));
                });
            }

            if(categoryId && categoryId != '1') {
                if (idsArray.length && idsArray.indexOf(categoryId) >= 0) {
                    $categoryContainer.find('[data-id=' + categoryId + ']').closest('li').remove();
                } else {
                    $categoryContainer.append('<li><span class="checkedProductCenter"  data-value="' + categoryName + '" data-id="' + categoryId + '">' + categoryName + '</span><span class="deleteCenter icon-close3"></span></li>');
                }
            }



            this.selectCenters = [];
            var checkedProductCategory = $thisEl.find('.checkedProductCenter');
            if (checkedProductCategory && checkedProductCategory.length) {
                checkedProductCategory.each(function (key, item) {
                    self.selectCenters.push($(item).data('id'));
                });
            }

            var paperId = $thisEl.find('#paperConfig').attr('data-id');
            var courseObj = _.filter(this.config, {_id: paperId} );
            this.courseId = courseObj.length > 0 ? courseObj[0].course._id : '';

            this.selectBatch(self.selectCenters, this.courseId);

            if (typeof this.useFilter === 'function') {
                this.useFilter();
            }
        },

        renderCenters : function(objs){
            var $thisEl = this.$el;
            var $checkedCategoryContainer = $thisEl.find('#checkedProductCenter');
            var $categoriesBlock = $thisEl.find('#variantsCenterBlock');
            var $categoryContainer = $thisEl.find('#productCenterCategories');
            var checkedSelectedId;
            var checkedName;
            $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox productCenterCategory" id="1" data-value="ALL" data-id="1"> <span></span></label><label class="_checkboxLabel" for="1">ALL</label></li>');
            _.each(objs, function (category) {
                checkedName = '';
                checkedSelectedId = '';

                if (objs.indexOf(category._id) >= 0) {
                    $categoryContainer.append('<li><label class="_customCHeckbox"><input checked="checked" type="checkbox" class="checkbox productCenterCategory" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                    checkedSelectedId = category._id;
                    checkedName = category.name;
                } else {
                    $categoryContainer.append('<li><label class="_customCHeckbox"><input type="checkbox" class="checkbox productCenterCategory" id="' + category._id + '" data-value="' + category.name + '" data-id="' + category._id + '"> <span></span></label><label class="_checkboxLabel" for="' + category._id + '">' + category.name + '</label></li>');
                }

                if (checkedName) {
                    $checkedCategoryContainer.append('<li><span class="checkedProductCenter"  data-value="' + checkedName + '" data-id="' + checkedSelectedId + '">' + checkedName + '</span><span class="deleteTag icon-close3"></span></li>');
                }
            });
        },
    });

    return UsersCreateView;
});
