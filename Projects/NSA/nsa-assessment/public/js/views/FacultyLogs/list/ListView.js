define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'views/selectView/selectView',
    'text!templates/FacultyLogs/list/ListTemplate.html',
    'models/vTransactionsModel',
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
    'views/FacultyLogs/list/EditView',
    'views/FacultyLogs/list/ViewDialog'
], function ($, _, listViewBase, SelectView, listTemplate, CurrentModel, dataService, async, helpers, lodash, populate, moment, common, CONSTANTS, ga, GA, EditView, ViewDialog) {
    'use strict';

    var ListView = listViewBase.extend({
        listTemplate     : listTemplate,
        CurrentModel     : CurrentModel,
        contentType      : 'VSLeaveReports',
        changedModels    : {},
        responseObj      : {},

        initialize: function (options) {
            $(document).off('click');

            this.render();
        },

        events: {
            'click .searchBtn': 'renderData',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click td.editable, .current-selected'             : 'showNewSelect',
            'click .goToEdit'         : 'goToEditDialog',
            'click .goToView'         : 'goToViewDialog'
        },

        goToEditDialog: function (e) {
            var tr = $(e.target).closest('tr');
            var facultyName = tr[0].outerText;
            var id = tr.attr('data-id');
            var self = this;
            var $thisEl = this.$el;
            var centerId = $thisEl.find('#center').attr('data-id');
            var cName = $('#center').text();
            var depId = $thisEl.find('#department').attr('data-id');
            var departmentName = $('#department').text();

            e.preventDefault();
            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.DELETE_PRICE_LISTS
            });

            new EditView({center: {_id: centerId, centerName: cName, depId: depId, depName: departmentName, facultyName:facultyName, facultyId: id}, collection: self.collection});
        },

        goToViewDialog: function (e) {
            var tr = $(e.target).closest('tr');
            var facultyName = tr[0].outerText;
            var id = tr.attr('data-id');
            var self = this;
            var $thisEl = this.$el;
            var centerId = $thisEl.find('#center').attr('data-id');
            var cName = $('#center').text();
            var depId = $thisEl.find('#department').attr('data-id');
            var departmentName = $('#department').text();

            e.preventDefault();
            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.DELETE_PRICE_LISTS
            });

            new ViewDialog({center: {_id: centerId, centerName: cName, depId: depId, depName: departmentName, facultyName:facultyName, facultyId: id}, collection: self.collection});
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

        chooseOption: function (e) {
            var $thisEl = this.$el;
            var $target = $(e.target);
            var $td = $target.closest('td');
            var parentUl = $target.parent();
            var $element = $target.closest('a') || parentUl.closest('a');
            var id = $element.attr('id') || parentUl.attr('id');

            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

            var centerId = $thisEl.find('#center').attr('data-id');

            if (holder.attr('id') === 'center') {
                this.selectDepartment(centerId);
            }

        },

        selectDepartment: function (id) {
            var self = this;
            this.$el.find('#listTable').html('');
            if (id !== '') {
                dataService.getData(CONSTANTS.URLS.DEPARTMENTS_FORDD, {centerId: id}, function (departments) {
                    departments = _.map(departments, function (department) {
                        department.name = departments.data[0].name;
                        department._id = departments.data[0]._id;

                        return department;
                    });
                    self.departments = departments;
                    self.responseObj['#department'] = departments;
                });
            } else {
                self.responseObj['#department'] = [];
            }
        },

        render: function () {
            var $currentEl = this.$el;
            var self = this;
            var $thisEl = this.$el;
            $currentEl.html('');
            var centerId = $thisEl.find('#center').attr('data-id');
            var departmentsId = $thisEl.find('#department').attr('data-id');
            var result = [] ;

            $('.ui-dialog ').remove();
            $('#top-bar-deleteBtn').hide();

            dataService.getData('/franchise/', {}, function (centers) {
                centers = _.map(centers.data, function (center) {
                    center.name = center.centerName;
                    return center;
                });
                self.centers = centers;
                self.responseObj['#center'] = centers;
            });

            dataService.getData('/permission/tabs', {module : CONSTANTS.MID.VFRANCHISEDETAILS, moduleId: CONSTANTS.MID.VFRANCHISECOURSES}, function (data) {
                if(centerId !== '' && departmentsId !== '' ) {
                    dataService.getData('/Vacation/leave', {centerId: centerId, departmentsId: departmentsId}, function (employees) {
                        employees = _.map(employees, function (employee) {

                            employee.name = employee.name.first + ' ' + employee.name.last;

                            return employee;
                        });
                        result = employees;
                    });
                }
                    $currentEl.html(_.template(listTemplate, {
                        data            : '',
                        collection      : result,
                        lodash          : lodash,
                        dataPermission  : data
                    }));
                    setTimeout(function () {
                        common.datatableInitWithoutExport('example1')
                    }, 500)
            });

        },

        renderData: function () {
            var $currentEl = this.$el;
            var self = this;
            var $thisEl = this.$el;
            var centerId = $thisEl.find('#center').attr('data-id');
            var departmentsId = $thisEl.find('#department').attr('data-id');
            var center = lodash.filter(this.centers, {'_id': centerId});
            var department = lodash.filter(this.departments, {'_id': departmentsId});
            var dataObj = {center: center.length > 0 ? center[0]: {}, department: department.length > 0 ? department[0] : {}};

            $('.ui-dialog ').remove();
            $('#top-bar-deleteBtn').hide();

            if (!center.length) {
                return App.render({
                    type: 'error',
                    message: "Select the center from the list."
                });
            }

            if (!department.length) {
                return App.render({
                    type: 'error',
                    message: "Select the department from the list."
                });
            }

            dataService.getData('/permission/tabs', {module : CONSTANTS.MID.VFRANCHISEDETAILS, moduleId: CONSTANTS.MID.VFRANCHISECOURSES}, function (data) {
                dataService.getData('/Vacation/leave', {centerId: centerId, departmentsId: departmentsId}, function (employees) {
                    employees = _.map(employees, function (employee) {

                        employee.name = employee.name.first + ' ' + employee.name.last;

                        return employee;
                });
                $currentEl.html(_.template(listTemplate, {
                    data            : dataObj,
                    collection      : employees,
                    lodash          : lodash,
                    dataPermission  : data
                }));
                setTimeout(function () {
                    common.datatableInitWithoutExport('example1')
                }, 500)
                });
            });

        }

    });

    return ListView;
});
