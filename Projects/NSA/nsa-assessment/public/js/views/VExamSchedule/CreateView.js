define([
    'Backbone',
    'jQuery',
    'Lodash',
    'text!templates/VExamSchedule/CreateTemplate.html',
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
        contentType: 'VExamSchedule',
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
            'click #online'            : 'showConfig',
            'click #offline'            : 'hideConfig'
        },

        showConfig : function(e) {
           // $('.examConfigDiv').removeClass('hide');
            $('.counterWrap').hide();
            $('.paperConfigDiv').removeClass('hide');
        },

        hideConfig : function(e) {
            //$('.examConfigDiv').addClass('hide');
            $('.paperConfigDiv').addClass('hide');
            $('.counterWrap').show();
        },



        notHide: function () {
            return false;
        },

        chooseOption: function (e) {
            var thisEl = this.$el;
            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            if (holder.attr('id') === 'paperConfig') {
                this.$el.find('.productCenterCategory').prop('checked', false)
                this.$el.find('#checkedProductCenter').empty();
                this.$el.find('#checkedProductCategories').empty();
                var paperId = holder.attr('data-id');
                var courseObj = _.filter(this.config, {_id: paperId} );
                if(courseObj) {
                    this.$el.find('#courses').val(_.map(courseObj[0].course, 'courseName').toString());
                    var classId = courseObj[0].classDetail._id;
                    this.classId = classId;
                }
            }


            var centerId = thisEl.find('#center').attr('data-id');
            var courseId = thisEl.find('#course').attr('data-id');

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

        saveItem: function () {
            var self = this;
            var thisEl = this.$el;
            var data = {}
            data.name = thisEl.find('#name').val();
            data.config = thisEl.find('#examConfig').attr('data-id');
            data.paperConfig = thisEl.find('#paperConfig').attr('data-id');
            data.examMode = thisEl.find('#online').prop('checked') || false;
            var offLine = thisEl.find('#offline').prop('checked');
            var schedule = 'createSchedule';
            data.schedule = schedule;
            data.classId = this.classId;

            if (!data.name) {
                return App.render({
                    type   : 'error',
                    message: "Name field can't be empty."
                });
            }


            if(!data.config || data.config === 'Select'){
                return App.render({
                    type   : 'error',
                    message: "Please Select Exam Configuration."
                });
            }

            if(offLine !== true){
                if(!data.paperConfig || data.paperConfig === 'Select'){
                    return App.render({
                        type   : 'error',
                        message: "Please Select Question Configuration."
                    });
                }
            } else {
                data.paperConfig = null
            }

            this.currentModel.save(data, {
                wait: true,
                success: function (model) {
                    Backbone.history.loadUrl(Backbone.history.getFragment());
                    self.hideDialog();
                    return App.render({
                        type: 'notify',
                        message:CONSTANTS.RESPONSES.CREATE_SUCCESS
                    });
                },

                error: function (model, xhr) {
                    return App.render({
                        type: 'error',
                        message: xhr.responseJSON.error
                    });
                }

            });

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

            $('.counterWrap').hide();

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


            populate.get('#examConfig', '/vassessment/examconfig', {}, 'name', this, true);

            dataService.getData('/vassessment/sheet/', {}, function (config) {
                config = _.map(config, function (con) {
                    con.name = con.name;
                    return con;
                });
                self.config = config;
                self.responseObj['#paperConfig'] = config;
            });

            return this;
        },

    });

    return UsersCreateView;
});
