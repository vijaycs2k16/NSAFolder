define([
    'Backbone',
    'Underscore',
    'jQuery',
    'views/dialogViewBase',
    'text!templates/DealTasks/EditTemplate.html',
    'text!templates/selectView/showSelectTemplate.html',
    'views/Notes/NoteView',
    'views/Category/TagView',
    'common',
    'populate',
    'custom',
    'constants',
    'moment',
    'helpers/keyValidator',
    'dataService',
    'views/Notes/AttachView',
    'Lodash',
    'models/DealTasksModel'
], function (Backbone, _, $, ParentView, EditTemplate, showSelectTemplate, NoteView, CategoryView, common, populate, custom, CONSTANTS, moment, keyValidator, dataService, AttachView, Lodash, TaskModel) {

    var EditView = ParentView.extend({
        contentType: 'DealTasks',
        template   : _.template(EditTemplate),
        responseObj: {},

        events: {
            'keypress .time'       : 'keypress',
            'click #projectTopName': 'useProjectFilter',
            'click .removeSelect'  : 'removeSelect',
            'keyup .time'          : 'validateInput',
            'click .icon-attach'   : 'clickInput',
            'change .time'         : 'changeInput',
            'click #workflowsDd'   : 'changeStage'
        },

        clickInput: function () {
            this.$el.find('.input-file .inputAttach').click();
        },

        changeStage: function() {
            var self = this;
            var res = Lodash.filter(self.types, {'_id': $('#taskTypeDd').data('id')});
            if(res.length > 0)
                self.responseObj['#workflowsDd'] = res[0].stages;
        },

        initialize: function (options) {
            _.bindAll(this, 'render', 'saveItem', 'deleteItem');
            this.currentModel = (options.model) || options.collection.getElement();
            this.currentModel.urlRoot = CONSTANTS.URLS.DEALTASKS;
            this.currentModel.on('change:category', this.renderCategory, this);

            this.render();
        },

        keypress: function (e) {
            return keyValidator(e);
        },

        changeInput: function (e) {
            var $target = $(e.target);

            e.preventDefault();

            if ($target.val().length === 1) {
                $target.val('0' + $target.val());
            }
        },

        validateInput: function (e) {
            var $target = $(e.target);
            var maxVal = ($target.attr('id') === 'dueDateHours') ? 23 : 59;

            e.preventDefault();

            if ($target.val() > maxVal) {
                $target.val('' + maxVal);
            }

        },

        removeSelect: function (e) {
            var $target = $(e.target);
            var $div = $target.closest('.selectType');
            $div.find('.showSelect').remove();
            $div.find('a').show();
        },

        useProjectFilter: function (e) {
            var project;
            var filter;

            e.preventDefault();
            project = this.currentModel.get('project')._id;
            filter = {
                project: {
                    key  : 'project._id',
                    type : 'ObjectId',
                    value: [project]
                }
            };

            $('.edit-dialog').remove();

            Backbone.history.navigate('#erp/Tasks/list/p=1/c=100/filter=' + encodeURIComponent(JSON.stringify(filter)), {trigger: true});
        },

        chooseOption: function (e) {
            var $target = $(e.target), self = this;
            self.responseObj['#workflowsDd'] = {};
            var $div = $target.closest('div.selectType');
            var $img = $div.find('.dataImg');
            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            if ($div.length) {
                $img.attr('src', $target.attr('data-img'));
                $div.attr('data-id', $target.attr('id'));
                $div.find('.current-selected').html($target.text());
            } else {
                $target.parents('.dataField').find('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));
            }

            if(holder.attr('id') == 'taskTypeDd' ) {
                $('#workflowsDd').text('Select');
                $('#workflowsDd').attr('data-id', '');
                var res = Lodash.filter(self.types, {'_id': holder.attr('data-id')});
                if(res.length > 0)
                    self.responseObj['#workflowsDd'] = res[0].stages;
            }
        },

        saveItem: function (event) {
            var self = this;
            var viewType;
            var holder;
            var assignedTo;
            var sequence;
            var data;
            var currentWorkflow;
            var currentAssigned;
            var modelJSON = this.currentModel.toJSON();
            var deal = this.$el.find('#dealItem').attr('data-id');
            var company = this.$el.find('#companyItem .selectType').attr('data-id');
            var contact = '';
            var student = this.$el.find('#contactItem').attr('data-id');
            var time = moment($.trim(this.$el.find('#timepickerOne').wickedpicker('time')).split(' '), 'hh:mm:ss A');
            var description = $.trim(this.$el.find('#description').val());
            var dueDate = $.trim(this.$el.find('#dueDate').val());
            var hours = time.get('hours');
            var minutes = time.get('minutes');
            var seconds = time.get('seconds');
            var category = modelJSON.category ? modelJSON.category._id : null;
            var taskType = this.$el.find('#taskTypeDd').attr('data-id');
            var workflow = this.$el.find('#workflowsDd').attr('data-id');
            var taskName = $.trim(this.$el.find('#taskName').val());
            var phoneNumber = $.trim(this.$el.find('#phoneNumber').val());
            var contactPerson = $.trim(this.$el.find('#ContactPerson').val());

            event.preventDefault();

            viewType = custom.getCurrentVT();

            holder = this.$el;
            assignedTo = holder.find('#assignedToDd').data('id');

            sequence = $.trim(holder.find('#sequence').val());

            if (!sequence) {
                sequence = null;
            }

            if (dueDate) {
                dueDate = moment(dueDate).hours(hours).minutes(minutes).seconds(seconds).toDate();
            }

            if (!taskType) {
                return App.render({
                    type   : 'error',
                    message: 'Please Choose Task Type'
                });
            }


            if (!workflow) {
                return App.render({
                    type   : 'error',
                    message: 'Please Choose Stages'
                });
            }

            if (!assignedTo) {
                return App.render({
                    type   : 'error',
                    message: 'Please Choose Assign To'
                });
            }

            if (!description) {
                return App.render({
                    type   : 'error',
                    message: 'Please add Comments'
                });
            }

            workflow = holder.find('#workflowsDd').data('id');

            data = {
                description  : description,
                dueDate      : dueDate,
                sequenceStart: modelJSON.sequence,
                company      : company || null,
                category     : category || null,
                contact      : null,
                student      : student || null ,
                contactDate  : contact ? new Date() : null,
                deal         : deal || null,
                dealDate     : deal ? new Date() : null,
                taskType   : taskType || '',
                taskName: taskName,
                phoneNumber: phoneNumber,
                contactPerson: contactPerson,
                assignedTo: assignedTo || ''
            };

            currentWorkflow = modelJSON.workflow;
            currentAssigned = modelJSON.assignedTo;

            if (currentWorkflow && currentWorkflow._id && (currentWorkflow._id !== workflow)) {
                data.workflow = workflow;
                data.sequence = -1;
                data.workflowStart = modelJSON.workflow._id;
            }

            if (currentAssigned && currentAssigned._id && (currentAssigned._id !== assignedTo)) {
                data.assignedTo = assignedTo;
            }

            this.currentModel.set(data);

            if (this.currentModel.changed.company) {
                data.companyDate = new Date();
            }
            if (this.currentModel.changed.contact) {
                data.contactDate = new Date();
            }
            if (this.currentModel.changed.deal) {
                data.dealDate = new Date();
            }

            this.currentModel.save(this.currentModel.changed, {
                patch  : true,
                success: function (model, res) {
                    var redirectUrl = window.location.hash;
                    self.hideDialog();

                    Backbone.history.fragment = '';
                    Backbone.history.navigate(redirectUrl, {trigger: true});
                    return App.render({
                        type: 'notify',
                        message: "Updated successfully"
                    });

                },

                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });
        },

        renderCategory: function () {
            var notDiv = this.$el.find('#categoryHolder');
            notDiv.empty();

            notDiv.append(
                new CategoryView({
                    model      : this.currentModel,
                    contentType: 'DealTasks',
                    el         : '#categoryHolder'
                }).render().el
            );
        },

        deleteItem: function (event) {
            var self = this;
            var answer;

            event.preventDefault();

            answer = confirm('Really DELETE items ?!');

            if (answer === true) {
                this.currentModel.destroy({
                    success: function (model) {
                        var viewType;
                        var wId;
                        var newTotal;
                        var $totalCount;
                        var redirectUrl = window.location.hash;

                        model = model.toJSON();
                        viewType = custom.getCurrentVT();

                        switch (viewType) {

                            case 'kanban':
                                $('#' + model._id).remove();
                                wId = model.workflow._id;
                                $totalCount = $('td#' + wId + ' .totalCount');

                                newTotal = ($totalCount.html() - 1);
                                $totalCount.html(newTotal);
                                break;

                            default:

                                self.hideDialog();

                                Backbone.history.fragment = '';
                                Backbone.history.navigate(redirectUrl, {trigger: true});
                                break;
                        }
                        self.hideDialog();
                    },

                    error: function (model, xhr) {
                        self.errorNotification(xhr);
                    }
                });
            }

        },

        render: function () {
            var formString = this.template({
                model : this.currentModel.toJSON(),
                moment: moment
            });
            var dueDate = this.currentModel.get('dueDate');
            var time = moment(dueDate).format('H:mm:ss');
            var self = this;
            var notDiv;

            dataService.getData('/permission', {moduleId: CONSTANTS.MID.DealTasks}, function (data) {
                self.$el = $(formString).dialog({
                    dialogClass: 'edit-dialog task-dialog task-edit-dialog',
                    width: 800,
                    title: self.currentModel.toJSON().description,
                    buttons: {
                        save: {
                            text: 'Save',
                            class: data.data.update ? 'btn blue' : 'btn blue hide',
                            click: function (e) {
                                self.saveItem(e);
                                self.gaTrackingEditConfirm();
                            }
                        },

                        cancel: {
                            text: 'Cancel',
                            class: 'btn',
                            click: self.hideDialog
                        },
                        delete: {
                            text: 'Delete',
                            class: data.data.delete ? 'btn' : 'btn hide',
                            click: function (e) {
                                self.deleteItem(e);
                                self.gaTrackingDelete();
                            }
                        }
                    }
                });
                notDiv = self.$el.find('.attach-container');

                self.$el.find('.attachments').append(
                    new AttachView({
                        model      : self.currentModel,
                        contentType: self.contentType,
                        forDoc: true
                    }).render().el
                );
                self.renderAssignees(self.currentModel);

                self.renderCategory();

                var el = $('#taskTypeDd');
                dataService.getData(CONSTANTS.URLS.DEALTASKS_TYPES, {}, function (response) {
                    self.responseObj['#taskTypeDd'] = response.data;
                    self.types = response.data;
                    var res = Lodash.filter(self.types, {'_id': $('#taskTypeDd').data('id')});
                    if(res.length > 0)
                        self.responseObj['#workflowsDd'] = res[0].stages;
                });

                // populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'CRM Tasks'}, 'name', this);
                populate.get2name('#assignedToDd', CONSTANTS.URLS.ASSIGNEES_PERSONSFORDD, {viewType: 'dealtasks'}, self, false);
                //populate.get('#contactDd', CONSTANTS.URLS.COMPANIES, {type: 'Person'}, 'fullName', this, false);
                populate.get('#contactDd', '/vstudents', {"isRegistration":false, count: 10000000}, 'studentName', self, true, true);
                //populate.get('#companyDd', CONSTANTS.URLS.COMPANIES, {type: 'Company'}, 'fullName', this, false);
                populate.get('#dealDd', 'opportunities/getForDd', {}, 'name', self, false);
                // populate.get2name('#taskTypeDd', CONSTANTS.URLS.DEALTASKS_TYPES, {}, this, false);

                self.delegateEvents(this.events);

                self.$el.find('#dueDate').datepicker({dateFormat: 'd M, yy', minDate: new Date()});
                self.$el.find('#timepickerOne').wickedpicker({
                    now            : time,
                    showSeconds    : true, //Whether or not to show seconds,
                    secondsInterval: 1, //Change interval for seconds, defaults to 1,
                    minutesInterval: 1
                });

                return self;
            })

        }

    });
    return EditView;
});
