define([
    'Backbone',
    'Underscore',
    'jQuery',
    'text!templates/VStudentLeads/form/FormTemplate.html',
    'text!templates/VStudentLeads/workflowProgress.html',
    'text!templates/VStudentLeads/aboutTemplate.html',
    'views/Editor/NoteView',
    'views/Editor/AttachView',
    'views/Companies/formPropertyView',
    'views/Persons/formProperty/formPropertyView',
    'views/Tags/TagView',
    'views/followers/index',
    'dataService',
    'views/selectView/selectView',
    'populate',
    'vconstants',
    'moment',
    'helpers/ga',
    'constants/googleAnalytics',
    'Lodash'
], function (Backbone, _, $, OpportunitiesFormTemplate, workflowProgress, aboutTemplate, EditorView, AttachView, CompanyFormProperty, ContactFormProperty, TagView, Followers,dataService, SelectView, populate, constants,moment, ga, GA, Lodash) {
    'use strict';

    var FormOpportunitiesView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.formModel = options.model;
            this.formModel.urlRoot = constants.URLS.LEADS;
            this.formModel.on('change:tags', this.saveTags, this);
            _.bindAll(this, 'saveDeal');
            this.responseObj = {};
            this.modelChanged = {};
        },

        events: {
            click                                              : 'hideNewSelect',
            'click #tabList a'                                 : 'switchTab',
            'keyup .editable'                                  : 'setChangeValueToModel',
            'click #cancelBtn'                                 : 'cancelChanges',
            'click #saveBtn'                                   : 'saveChanges',
            'click .tabListItem'                               : 'changeWorkflow',
            'click .current-selected:not(.jobs)'               : 'showNewSelect',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click #convertToOpportunity'                      : 'openDialog',
            'click #moveToAdmin'                               : 'moveToAdmin',
            scroll                                             : 'hideDatepicker'
        },

        hideNewSelect: function () {
            this.$el.find('.newSelectList').hide();

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        openDialog: function (e) {
            e.preventDefault();
            $('#no').click()
            $('#convert-dialog-form').dialog('open');

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.CONVERT_TO_OPPORTUNITY
            });
        },

        moveToAdmin: function (e) {
            var model =  this.formModel ? this.formModel.toJSON() : {};
            if(model) {
                this.saveDeal({salesPerson: model.createdBy.user ? model.createdBy.user.relatedEmployee: null});
            }
            $('.closeBtn').click()

        },

        /*   convertToOpp : function (e){
         e.preventDefault();
         this.saveDeal({
         isOpportunitie : true,
         isConverted    : true,
         convertedDate  : new Date()
         }, 'converted');
         },*/

        setChangeValueToModel: function (e) {
            var $target = $(e.target);
            var property = $target.attr('id').replace('_', '.');
            var value = $target.val();
            var newProperty;

            $target.closest('.propertyFormList').addClass('active');

            if (property === 'social.LI') {
                value = value.replace('linkedin', '[]');
            }

        if(property === 'contactName.first' || property === 'contactName.last' || property === 'phones.phone') {
            if (this.modelChanged.contactName) {
                this.modelChanged['contactName.first'] = this.modelChanged.contactName.first;
                this.modelChanged['contactName.last'] = this.modelChanged.contactName.last;
                delete this.modelChanged.contactName;
            }

            if (this.modelChanged.phones) {
                delete this.modelChanged.phones;
            }
        }


            if (property === 'social.LI' || property === 'social.FB') {
                newProperty = property.slice(-2, property.length);

                if (!this.modelChanged.social) {
                    this.modelChanged.social = {};
                }

                this.modelChanged.social[newProperty] = value;
            } else {
                this.modelChanged[property] = value;
            }

            this.modelChanged[property] = value;
            this.showButtons();
        },

        showButtons: function () {
            this.$el.find('#formBtnBlock').addClass('showButtons');
        },

        hideButtons: function () {
            this.$el.find('#formBtnBlock').removeClass('showButtons');
        },

        saveChanges: function (e) {
            e.preventDefault();
            this.saveDeal(this.modelChanged);
            ga && ga.trackingEditConfirm();
            return App.render({
                type: 'notify',
                message:constants.RESPONSES.EDIT_SUCCESS
            });

        },

        cancelChanges: function (e) {
            e.preventDefault();
            this.modelChanged = {};
            this.renderAbout();

            ga && ga.trackingEditCancel();
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

            this.selectView = new SelectView({
                e          : e,
                responseObj: this.responseObj
            });

            $target.append(this.selectView.render().el);

            return false;
        },

        changeWorkflow: function (e) {
            var $target = $(e.target);
            var $thisEl = this.$el;
            var wId;
            var $tabs = $thisEl.find('#workflowProgress .tabListItem');

            if (!$target.hasClass('tabListItem')) {
                $target = $target.closest('div');
            }
            wId = $target.find('span').attr('data-id');
            $tabs.removeClass('passed');
            $tabs.removeClass('active');
            $target.prevAll().addClass('passed');
            $target.addClass('active');
            if(wId == '528ce779f3f67bc40b00001f') {
                this.editorView.sendSms(e, constants.IN_PROGRESS_TEMPLATE)
            }
            this.saveDeal({workflow: wId});
        },

        chooseOption: function (e) {
            var $target = $(e.target);
            var holder = $target.parents('.inputBox').find('.current-selected');
            var type = $target.closest('a').attr('data-id').replace('_', '.');
            var text = $target.text();
            var id = $target.attr('id');

            holder.text(text);
            this.modelChanged[type] = id;

            if (type === 'salesPerson') {
                this.$el.find('#assignedToDd').text(text).attr('data-id', id);
            }

            if (type === 'assignedBy') {
                this.$el.find('#assignedByDd').text(text).attr('data-id', id);
            }

            if (type === 'customer') {
                this.selectCustomer(id);
            }

            if (type === 'student') {
                this.selectCustomer(id);
            }

            if (type === 'center') {
                this.selectCenter(id);
            }

            if (type === 'course') {
                this.selectCourse(id);
            }


            if (type === 'company') {
                this.selectCompany(id);
            }

            holder.closest('.propertyFormList').addClass('active');
            this.showButtons();
        },

        selectCenter: function (id) {
            var self = this;
            if (id !== '') {
                this.centerId = id;
                dataService.getData('/fcourse/center', {centerId: id}, function (courses) {
                    courses = _.map(courses.data, function (course) {
                        course.name = course.course.courseName;
                        course._id = course.course._id;

                        return course;
                    });
                    self.$el.find('#course_Dd').text('Select');
                    self.responseObj['#course_Dd'] = courses;
                });
            } else {
                self.responseObj['#course_Dd'] = [];
            }

        },

        selectCourse: function (id) {
            var self = this;
            if (id) {
                dataService.getData('/fcourse/center/fee', {center: this.centerId, course: id}, function (courseFees) {
                    if(courseFees.data) {
                        self.courseFee = courseFees.data.centerCourseFees;
                    }
                });
            }
        },

        selectCenterCourse: function (id, createCustomer) {
            var self = this;
            if (id) {
                dataService.getData('/fcourse/center/fee', {center: this.centerId, course: id}, function (courseFees) {
                    if(courseFees.data) {
                        self.courseFee = courseFees.data.centerCourseFees;

                        self.saveDeal({
                            isOpportunitie: true,
                            isConverted   : true,
                            convertedDate : new Date(),
                            createCustomer: createCustomer,
                            fees : self.courseFee || 0
                        }, 'converted');
                    }
                });
            }
        },

        saveDeal: function (changedAttrs, type) {
            var $thisEl = this.$el;
            var self = this;
            var changedAttributesForEvent = ['name', 'source', 'salesPerson','assignedBy', 'workflow'];
            var changedListAttr = _.intersection(Object.keys(changedAttrs), changedAttributesForEvent);
            var sendEvent = !!(changedListAttr.length);

            if (changedAttrs.social && Object.keys(changedAttrs).indexOf('social.FB') >= 0) {
                delete changedAttrs['social.FB'];
            }

            if (changedAttrs.social && Object.keys(changedAttrs).indexOf('social.LI') >= 0) {
                delete changedAttrs['social.LI'];
            }

            if($('#salesPersonDd').text() == $('#assignedByDd').text()){
                return App.render({
                    type: 'error',
                    message: 'AssignedBy and AssignedTo cant be Same'
                });
            }

            this.formModel.save(changedAttrs, {
                patch  : true,
                wait   : true,
                success: function () {
                    if (type === 'formProperty') {
                        Backbone.history.fragment = '';
                        Backbone.history.navigate(window.location.hash, {trigger: true});
                    } else if (type === 'tags') {
                        self.renderTags();
                    } else if (type === 'converted') {
                        Backbone.history.fragment = '';
                        Backbone.history.navigate('erp/Opportunities', {trigger: true});
                    } else {
                        self.editorView.renderTimeline();
                        self.renderAbout();
                        self.modelChanged = {};
                        self.hideButtons();

                        if (sendEvent) {

                            if (changedAttrs.hasOwnProperty('salesPerson')) {
                                changedAttrs.salesPerson = $thisEl.find('#salesPersonDd').text().trim();
                            }

                            if (changedAttrs.hasOwnProperty('assignedBy')) {
                                changedAttrs.assignedBy = $thisEl.find('#assignedByDd').text().trim();
                            }

                            if (changedAttrs.hasOwnProperty('source')) {
                                changedAttrs.source = $thisEl.find('#sourceDd').text().trim();
                            }

                            if (changedAttrs.hasOwnProperty('workflow')) {
                                changedAttrs.workflow = $thisEl.find('.tabListItem.active span').text().trim();
                            }

                            self.trigger('itemChanged', changedAttrs);
                        }
                    }
                },



                error: function (model, response) {
                    if (response) {
                        App.render({
                            type   : 'error',
                            message: response.error
                        });
                    }
                }
            });
        },

        saveTags: function () {
            this.saveDeal(this.formModel.changed, 'tags');
        },

        renderTags: function () {
            var notDiv = this.$el.find('.tags-container');
            notDiv.empty();

            notDiv.append(
                new TagView({
                    model      : this.formModel,
                    contentType: 'Opportunities'
                }).render().el
            );
        },

        selectCompany: function (id) {
            dataService.getData(constants.URLS.CUSTOMERS, {
                id: id
            }, function (response, context) {
                var customer = response;

                context.$el.find('#company').val(customer.name.first);

                context.$el.find('#address_street').val(customer.address.street);
                context.$el.find('#address_city').val(customer.address.city);
                context.$el.find('#address_state').val(customer.address.state);
                context.$el.find('#address_zip').val(customer.address.zip);
                context.$el.find('#address_country').attr('data-id', customer.address.country);
                context.$el.find('#address_country').text(customer.address.country);
                context.$el.find('#tempCompanyField').val(customer.name.first);
                context.modelChanged.address = {
                    street : customer.address.street,
                    city   : customer.address.city,
                    state  : customer.address.state,
                    zip    : customer.address.zip,
                    country: customer.address.country
                };
                context.modelChanged.tempCompanyField = customer.name.first;

            }, this);

        },

        selectCustomer: function (id) {

            dataService.getData(constants.URLS.VSTUDENT + id, {
            }, function (response, context) {
                var student = response;

                context.$el.find('#contactName_first').val(student.studentName);
                context.$el.find('#contactName_last').val(student.lastName);
                context.$el.find('#email').val(student.studentEmail);
                context.$el.find('#phones_phone').val(student.studentPhone);
                context.$el.find('#schoolName').val('');
                context.$el.find('#user_name').val('');
                context.modelChanged.contactName = {
                    first: student.studentName,
                    last : student.lastName
                };
                context.modelChanged.email = student.studentEmail;
                context.modelChanged.phones = {
                    phone: student.studentPhone
                };
            }, this);

        },

        deleteItems: function () {
            var mid = 39;

            this.formModel.destroy({
                headers: {
                    mid: mid
                },
                success: function () {
                    Backbone.history.navigate('#erp/Opportunities/kanban', {trigger: true});
                }
            });

        },

        renderAbout: function () {
            var self = this;
            var $thisEl = this.$el;
            $thisEl.find('.aboutHolder').html(_.template(aboutTemplate, {model: self.formModel.toJSON()}));
            this.renderTags();
            $thisEl.find('#expectedClosing').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                onSelect   : function (dateText) {
                    self.modelChanged['expectedClosing'] = new Date(dateText);
                    self.showButtons();
                }
            });
            $thisEl.find('#followDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                onSelect   : function (dateText) {
                    self.modelChanged['followDate'] = new Date(dateText);
                    self.showButtons();
                }
            });

            $thisEl.find('#dateBirth').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                onSelect   : function (dateText) {
                    self.modelChanged['dateBirth'] = new Date(dateText);
                    self.showButtons();
                }
            });
        },

        hideDatepicker: function () {
            var $datepickers = this.$el.find('#expectedClosing, #dateBirth, #followDate');

            if ($datepickers.datepicker("widget").is(":visible")) {
                $datepickers.datepicker('hide');
            }
        },

        render: function () {
            var formModel = this.formModel.toJSON();
            var self = this;
            var that = this;
            var $thisEl = this.$el;

            $thisEl.html(_.template(OpportunitiesFormTemplate, {model: formModel}));
            this.centerId =  formModel.center ? formModel.center._id : null  ;
            this.courseId = formModel.course ? formModel.course._id : null;

            dataService.getData('/workflows/', {id: 'Leads'}, function (response) {
                self.responseObj = {workflows: response.data};
                $thisEl.find('#workflowProgress').append(_.template(workflowProgress, {
                    workflows: self.responseObj.workflows,
                    workflow : formModel.workflow
                }));
            });

            dataService.getData('/employees/getAssignees', {isEmployee: true, viewType: 'leads'}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee;
                });

                self.responseObj['#salesPersonDd'] = employees;
            });

            dataService.getData('/employees/getAssignees', {isEmployee: true, viewType: 'leads', profileId: 1524552625000}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee;
                });

                self.responseObj['#assignedByDd'] = employees;
            });

            populate.get('#studentDd', '/vstudents', {}, 'studentName', this, true, true);
            populate.get('#center_Dd', '/franchise/', {}, 'centerName', this, true, true);
            dataService.getData('/customers', {type: 'Company'}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.fullName;

                    return employee;
                });

                self.responseObj['#companyDd'] = employees;
            });

            dataService.getData('/countries/getForDD', {}, function (countries) {

                self.responseObj['#address_country'] = countries.data;
            });
            this.renderTags();

            this.editorView = new EditorView({
                model      : this.formModel,
                contentType: 'Opportunities'
            });

            $thisEl.find('.notes').append(
                this.editorView.render().el
            );

            $('#convert-dialog-form').dialog({
                autoOpen: false,
                height  : 150,
                width   : 350,
                modal   : true,
                title   : 'Convert to opportunity',
                buttons : {
                    save: {
                        text : 'Create opportunity',
                        class: 'btn blue',
                        click: function () {
                            var createCustomer = ($('#createCustomerOrNot input:checked').val()) ? true : false;
                            if(!that.courseFee && that.courseId) {
                                that.selectCenterCourse(that.courseId, createCustomer)
                            } else {
                                that.saveDeal({
                                    isOpportunitie: true,
                                    isConverted   : true,
                                    convertedDate : new Date(),
                                    createCustomer: createCustomer,
                                    fees : that.courseFee || 0
                                }, 'converted');

                            }

                        }
                    },

                    cancel: {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            $(this).dialog('close');
                        }
                    }
                },

                close: function () {
                    $(this).dialog('close');
                }
            }, this);

            $thisEl.find('#expectedClosing').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                onSelect   : function (dateText) {
                    self.modelChanged.expectedClosing = new Date(dateText);
                    $(this).closest('.propertyFormList').addClass('active');
                    self.showButtons();
                }

            });
            $thisEl.find('#followDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                onSelect   : function (dateText) {
                    self.modelChanged.followDate = new Date(dateText);
                    $(this).closest('.propertyFormList').addClass('active');
                    self.showButtons();
                }

            });

            $thisEl.find('#dateBirth').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                yearRange  : '-100y:c+nn',
                maxDate    : '-18y',
                minDate    : null,
                onSelect   : function (dateText) {
                    self.modelChanged.dateBirth = new Date(dateText);
                    $(this).closest('.propertyFormList').addClass('active');
                    self.showButtons();
                }

            });

            dataService.getData('/leads/priority', {}, function (priorities) {
                priorities = _.map(priorities.data, function (priority) {
                    priority.name = priority.priority;

                    return priority;
                });
                self.responseObj['#priorityDd'] = priorities;
            });
            populate.get('#sourceDd', '/employees/sources', {}, 'name', this);

            $thisEl.find('.attachments').append(
                new AttachView({
                    model      : this.formModel,
                    contentType: 'Opportunities',
                    noteView   : this.editorView
                }).render().el
            );

            $thisEl.find('.followers').append(
                new Followers({
                    model         : this.formModel,
                    collectionName: 'leads'
                }).render().el
            );

            return this;
        }
    });

    return FormOpportunitiesView;
});
