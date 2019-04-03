define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VStudentLeads/AssignTemplate.html',
    'views/selectView/selectView',
    'populate',
    'helpers/keyValidator',
    'helpers',
    'moment',
    'dataService',
    'constants',
    'views/VStudentLeads/list/ListView'
], function (Backbone, $, _, Parent, AssignTemplate, SelectView, populate, keyValidator, helpers, moment, dataService, CONSTANTS, LeadsListView) {
    'use strict';

    var AssignView = Parent.extend({
        template: _.template(AssignTemplate),


        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        chooseOption: function (e) {
            var $target = $(e.target);

            $('.newSelectList').hide();

            $target.closest('.current-selected').text($target.text()).attr('data-id', $target.attr('id'));

        },

        bulkAssign : function() {
            var self = this;
            var table = $('#listTable').find('input:checked');
            var selectedLeads = [], obj = {};
            var teacher = $('#selAssignee').attr('data-id') || $($('._assignForm').find('#selAssignee')[1]).attr('data-id');
            $.each(table, function(){
                selectedLeads.push($(this).val());
            });

            obj.leads = selectedLeads;
            obj.salesPersonId = teacher;
            dataService.patchData(CONSTANTS.URLS.ASSIGN_VIEW,
                obj,
                function (err, result) {
                    if(err){
                        App.render({
                            type   : 'error',
                            message: 'Unable to Update Assignee'
                        });
                    } else {
                        App.render({
                            type   : 'notify',
                            message: 'Updated Successfully'
                        });
                        self.hideDialog();
                        Backbone.history.navigate('erp/VStudentLeads',{trigger: true})
                    }
                },
                CONSTANTS.LEADS
            );
        },

        render: function () {
            this.responseObj = {};
            var self = this;
            var formString = this.template(
            );

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Bank Account',
                width      : '500px',
                buttons    : [{
                    text : 'Save',
                    class: 'btn blue',
                    click: function () {
                        self.bulkAssign();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }]

            });

            dataService.getData('/employees/getAssignees', {isEmployee: true, viewType: 'leads'}, function (employees) {
                employees = _.map(employees.data, function (employee) {
                    employee.name = employee.name.first + ' ' + employee.name.last;

                    return employee;
                });
                self.responseObj['#selAssignee'] = employees;
            });

            this.delegateEvents(this.events);

            return this;
        }
    });

    return AssignView;
});


