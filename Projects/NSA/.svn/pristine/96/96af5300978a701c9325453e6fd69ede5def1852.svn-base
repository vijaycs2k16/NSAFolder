define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/VStudentLeads/CreateTemplate.html',
    'views/dialogViewBase',
    'models/LeadsModel',
    'common',
    'populate',
    'dataService',
    'views/Notes/AttachView',
    'vconstants',
    'moment'
], function (Backbone, $, _, CreateTemplate, ParentView, LeadModel, common, populate, dataService, AttachView, CONSTANTS, moment) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'VStudentLeads',
        template   : _.template(CreateTemplate),

        initialize: function () {
            _.bindAll(this, 'saveItem', 'render');
            this.model = new LeadModel();
            this.responseObj = {};

            this.render();
        },

        events: {
            'change #workflowNames': 'changeWorkflows',
            'click .icon-attach'   : 'clickInput'
        },

        clickInput: function () {
            this.$el.find('.input-file .inputAttach').click();
        },

        selectCompany: function (id) {
            if (id !== '') {
                dataService.getData(CONSTANTS.URLS.CUSTOMERS, {
                    id: id
                }, function (response, context) {
                    var customer = response;
                    context.$el.find('#company').val(customer.name.first);
                    context.$el.find('#street').val(customer.address.street);
                    context.$el.find('#city').val(customer.address.city);
                    context.$el.find('#state').val(customer.address.state);
                    context.$el.find('#zip').val(customer.address.zip);
                    context.$el.find('#country').attr('data-id', customer.address.country);
                    context.$el.find('#country').text(customer.address.country);

                }, this);
            } else {
                this.$el.find('#street').val('');
                this.$el.find('#city').val('');
                this.$el.find('#state').val('');
                this.$el.find('#zip').val('');
                this.$el.find('#country').val('');
                this.$el.find('#company').val('');
            }

        },

        selectCenter: function (id) {
            var self = this;
            if (id !== '') {
                dataService.getData('/fcourse/center', {centerId: id}, function (courses) {
                    courses = _.map(courses.data, function (course) {
                        course.name = course.course.courseName;
                        course._id = course.course._id;

                        return course;
                    });
                    self.$el.find('#courseDd').text('Select').attr('data-id', "");
                    self.responseObj['#courseDd'] = courses;
                });
            } else {
                self.responseObj['#courseDd'] = [];
            }

        },

        selectCustomer: function (id) {
            if (id !== '') {
                dataService.getData(CONSTANTS.URLS.VSTUDENT + id, {
                }, function (response, context) {
                    var customer = response;
                        context.$el.find('#studentName').val(customer.studentName);
                        context.$el.find('#lastName').val(customer.studentName);
                        context.$el.find('#studentEmail').val(customer.studentEmail);
                        //context.$el.find('#userName').val(customer.userName);
                        context.$el.find('#userPhone').val(customer.studentPhone);
                        context.$el.find('#courseDd').attr('data-id', customer.course ?  customer.course._id : null);
                        context.$el.find('#courseDd').text(customer.course ?  customer.course.courseName : '');
                        context.$el.find('#centerDd').text(customer.center ? customer.center.centerName: '');
                        context.$el.find('#centerDd').attr('data-id', customer.center ? customer.center._id : '');
                }, this);
            } else {
                this.$el.find('#studentName').val('');
                this.$el.find('#lastName').val('');
                this.$el.find('#studentEmail').val('');
                this.$el.find('#userName').val('');
            }

        },

        chooseOption: function (e) {
            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            if (holder.attr('id') === 'studentDd') {
                this.selectCustomer($(e.target).attr('id'));
            }
            if (holder.attr('id') === 'companyDd') {
                this.selectCompany($(e.target).attr('id'));
            }
            if (holder.attr('id') === 'centerDd') {
                this.selectCenter($(e.target).attr('id'));
            }
        },

        changeWorkflows: function () {
            var name = this.$('#workflowNames option:selected').val();
            var value = this.workflowsCollection.findWhere({name: name}).toJSON().value;
            // $('#selectWorkflow').html(_.template(selectTemplate, { workflows: this.getWorkflowValue(value) }));
        },

        saveItem: function () {
            var $thisEl = this.$el;
            var afterPage = '';
            var location = window.location.hash;
            var pageSplited = location.split('/p=')[1];
            var self = this;
            var mid = 24;
            var name = $.trim($thisEl.find('#name').val());
            var idCustomer = $thisEl.find('#studentDd').attr('data-id');
            var address = {};
            var salesPersonId = $thisEl.find('#salesPerson').attr('data-id');
            var expectedClosing = $thisEl.find('#expectedClosingDate').val();
            var followupDate = $thisEl.find('#followupDate').val();
            var dateBirth = $thisEl.find('#dateBirthOnCreate').val();
            var salesTeamId = $thisEl.find('#salesTeam option:selected').val();
            var first = $.trim($thisEl.find('#studentName').val());
            var schoolName = $.trim($thisEl.find('#schoolName').val());
            var last = $.trim($thisEl.find('#lastName').val());
            var tempCompany = $.trim($thisEl.find('#company').val());
            var jobPosition = $.trim($thisEl.find('#jobPosition').val());
            var company = $thisEl.find('#companyDd').attr('data-id');
            var center = $thisEl.find('#centerDd').attr('data-id');
            var course = $thisEl.find('#courseDd').attr('data-id');

            var contactName = {
                first: first,
                last : last
            };
                var email = $.trim($thisEl.find('#studentEmail').val());
            var func = $.trim($thisEl.find('#func').val());
            var phone = $.trim($thisEl.find('#userPhone').val());
            var userName = $.trim($thisEl.find('#userName').val());

            var fax = $.trim($thisEl.find('#fax').val());
            var phones = {
                phone : phone,
                fax   : fax
            };
            var workflow = $thisEl.find('#workflowsDd').attr('data-id');
            var priority = $thisEl.find('#priorityDd').attr('data-id');
            var internalNotes = $.trim($thisEl.find('#internalNotes').val());
            var active = ($thisEl.find('#active').is(':checked'));
            var optout = ($thisEl.find('#optout').is(':checked'));
            var reffered = $.trim($thisEl.find('#reffered').val());
            var skype = $.trim($thisEl.find('#skype').val());
            var LI = $.trim($thisEl.find('#LI').val());
            var FB = $.trim($thisEl.find('#FB').val());

            var source = $thisEl.find('#sourceDd').attr('data-id');

            var usersId = [];
            var groupsId = [];
            var notes = [];
            var note;

            var whoCanRW = $thisEl.find("[name='whoCanRW']:checked").val();
            if (internalNotes) {
                note = {
                    title: '',
                    note : internalNotes
                };
                notes.push(note);
            }

            if (pageSplited) {
                afterPage = pageSplited.split('/')[1];
                location = location.split('/p=')[0] + '/p=1' + '/' + afterPage;
            }
            $thisEl.find('._animateInputBox').find('.address').each(function () {
                var el = $(this);
                address[el.attr('name')] = $.trim(el.val() || el.text());
            });
            $thisEl.find('.groupsAndUser tr').each(function () {
                if ($(this).data('type') === 'targetUsers') {
                    usersId.push($(this).attr('data-id'));
                }
                if ($(this).data('type') === 'targetGroups') {
                    groupsId.push($(this).attr('data-id'));
                }

            });
            this.model.save({
                name  : name,
                skype : skype,
                social: {
                    LI: LI.replace('linkedin', '[]'),
                    FB: FB
                },

                jobPosition     : jobPosition,
                dateBirth       : dateBirth,
                company         : company || null,
                campaign        : $('#campaignDd').attr('data-id'),
                source          : source,
                customer        : null,
                student         : idCustomer  || null,
                address         : address,
                salesPerson     : salesPersonId || null,
                expectedClosing : expectedClosing,
                followDate      : followupDate || Date.now(),
                salesTeam       : salesTeamId,
                contactName     : contactName,
                email           : email,
                func            : func,
                phones          : phones,
                fax             : fax,
                priority        : priority,
                notes           : notes,
                active          : active,
                optout          : optout,
                reffered        : reffered,
                workflow        : workflow,
                tempCompanyField: tempCompany,
                course: course != "" ? course: null,
                center: center != "" ? center : null,
                userName: userName,
                schoolName: schoolName,
                groups          : {
                    owner: self.$el.find('#allUsersSelect').attr('data-id') || null,
                    users: usersId,
                    group: groupsId
                },

                whoCanRW: whoCanRW
            }, {
                wait   : true,
                headers: {
                    mid: mid
                },

                success: function (model) {
                    var currentModel = model.changed;

                    self.attachView.sendToServer(null, currentModel);
                    /*self.hideDialog();
                     Backbone.history.fragment = '';
                     Backbone.history.navigate(location, {trigger: true});*/
                    // Backbone.history.navigate('erp/users', { trigger: true });
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

        render: function () {
            var self = this;
            var formString = this.template();
            var notDiv;

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Company',
                width      : '500',
                buttons    : [
                    {
                        text : 'Create',
                        class: 'btn blue',
                        click: function () {
                            self.saveItem();
                            self.gaTrackingConfirmEvents();
                        }
                    },

                    {
                        text : 'Cancel',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }
                ]

            });

            this.renderAssignees(this.model);

            notDiv = this.$el.find('.attach-container');

            this.attachView = new AttachView({
                model      : this.model,
                contentType: self.contentType,
                isCreate   : true
            });
            notDiv.append(this.attachView.render().el);

            dataService.getData('/leads/priority', {}, function (priorities) {
                priorities = _.map(priorities.data, function (priority) {
                    priority.name = priority.priority;

                    return priority;
                });
                self.responseObj['#priorityDd'] = priorities;
            });
            populate.getWorkflow('#workflowsDd', '#workflowNamesDd', CONSTANTS.URLS.WORKFLOWS_FORDD, {id: 'Leads'}, 'name', this, true);
            populate.get('#studentDd', '/vstudents', {"isRegistration":false, count: 10000}, 'studentName', this, true, true);
            populate.get('#centerDd', '/franchise/', {count: 10000}, 'centerName', this, this, true);
            populate.get2name('#companyDd', CONSTANTS.URLS.CUSTOMERS, {type: 'Company'}, this, true, true);
            populate.get('#country', CONSTANTS.URLS.COUNTRIES, {}, 'name', this, true);
            populate.get('#sourceDd', '/employees/sources', {}, 'name', this, true, true);
            populate.get('#campaignDd', '/Campaigns', {}, 'name', this, true, true);
            dataService.getData('/employees/getAssignees', {isEmployee: true, viewType: 'leads'}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee;
                });

                self.responseObj['#salesPerson'] = employees;
            });

            this.$el.find('#dateBirthOnCreate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                yearRange  : '-100y:c+nn',
                maxDate    : '-18y',
                minDate    : null
            });

            this.$el.find('#expectedClosingDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                minDate    : 0
            });

            this.$el.find('#followupDate').datepicker({
                dateFormat : 'd M, yy',
                changeMonth: true,
                changeYear : true,
                minDate    : 0
            });

            this.delegateEvents(this.events);

            return this;
        }

    });
    return CreateView;
});
