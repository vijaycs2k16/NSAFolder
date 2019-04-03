define([
    'Backbone',
    'jQuery',
    'Underscore',
    'text!templates/VLeave/list/ListHeader.html',
    'text!templates/VLeave/list/cancelEdit.html',
    'text!templates/VLeave/list/ListTotal.html',
    'views/selectView/selectView',
    'views/VLeave/CreateView',
    'views/VLeave/list/ListItemView',
    'models/VStudentLeave',
    'collections/VLeave/filterCollection',
    'collections/VLeave/editCollection',
    'common',
    'dataService',
    'vconstants',
    'async',
    'moment',
    'views/guideTours/guideNotificationView',
    'populate',
    'Lodash'
], function (Backbone, $, _, listTemplate, cancelEdit, listTotal, SelectView, CreateView, ListItemView, VacationModel, vacationCollection, EditCollection, common, dataService, CONSTANTS, async, moment, GuideNotify, populate, Lodash) {
    'use strict';

    var VacationListView = Backbone.View.extend({
        el                : '#content-holder',
        defaultItemsNumber: null,
        listLength        : null,
        filter            : null,
        sort              : null,
        newCollection     : null,
        page              : null, // if reload page, and in url is valid page
        contentType       : CONSTANTS.VLEAVE, // needs in view.prototype.changeLocationHash
        viewType          : 'list', // needs in view.prototype.changeLocationHash
        changedModels     : {},
        holidayId         : null,
        editCollection    : null,
        responseObj       : {},
        monthElement      : null,
        yearElement       : null,

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            this.filter = options.filter || {};
            this.sort = options.sort || {};
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.page;
            this.render();
            this.contentCollection = vacationCollection;
        },

        events: {
            'click .icon-trash'                                : 'deleteItemPressed',
            'click td.editable, .current-selected'             : 'showNewSelect',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click .oe_sortable'                               : 'goSort',
            'change .editable '                                : 'setEditable',
            click                                              : 'hideNewSelect'
        },

        hideNewSelect: function () {
            var editingDates = this.$el.find('.editing');

            editingDates.each(function () {
                $(this).parent().text($(this).val());
                $(this).remove();
            });

            this.$el.find('.newSelectList').hide();

            if (this.selectView) {
                this.selectView.remove();
            }
        },

        deleteItemPressed: function (e) {
            var target = $(e.target);
            var tr = target.closest('tr');
            var modelId = tr.attr('data-id');

            e.stopPropagation();
            e.preventDefault();

            this.deleteItem(modelId);
        },

        savedNewModel: function (modelObject) {
            var savedRow = this.$listTable.find('#false');
            var modelId;

            modelObject = modelObject.success;

            if (modelObject) {
                modelId = modelObject._id;
                savedRow.attr('data-id', modelId);
                savedRow.removeAttr('id');
            }

            this.changedModels = {};

            $(savedRow).find('.edited').removeClass('edited');

            this.hideSaveCancelBtns();
            this.resetCollection(modelObject);
        },

        bindingEventsToEditedCollection: function (context) {
            if (context.editCollection) {
                context.editCollection.unbind();
            }
            context.editCollection = new EditCollection(context.collection);
            context.editCollection.on('saved', context.savedNewModel, context);
            context.editCollection.on('updated', context.updatedOptions, context);
        },

        resetCollection: function (model) {
            var id;
            var collection = new EditCollection(this.collection);
            if (model && model._id) {
                model = new VacationModel(model);
                collection.add(model);
            } else {
                for (id in this.changedModels) {
                    model = this.editCollection.get(id);
                    model.set(this.changedModels[id]);
                }
                collection.set(this.editCollection.models, {remove: false});
            }
            this.bindingEventsToEditedCollection(this);
        },

        updatedOptions: function () {
            var savedRow = this.$listTable.find('#false');
            var editedEl = savedRow.find('.editing');
            var editedCol = editedEl.closest('td');
            this.hideSaveCancelBtns();

            editedCol.text(editedEl.val());
            editedEl.remove();

            this.changedModels = {};

            this.resetCollection();
        },

        hideSaveCancelBtns: function () {
            var createBtnEl = $('#top-bar-createBtn');
            var saveBtnEl = $('#top-bar-saveBtn');
            var cancelBtnEl = $('#top-bar-deleteBtn');

            this.changed = false;

            saveBtnEl.hide();
            cancelBtnEl.hide();
            createBtnEl.show();

            return false;
        },

        saveItem: function () {
            var model;
            var newElements = this.$el.find('#false');
            var errors = this.$el.find('.errorContent')
            var id
            var notify = {}
            notify.sms = this.$el.find('#sms').prop('checked') || false;
            this.editCollection.notify = notify;
            if (errors.length) {
                return false;
            }
            this.editCollection.on('saved', this.savedNewModel, this);
            this.editCollection.on('updated', this.updatedOptions, this);

            if (newElements && _.isEmpty(this.changedModels)) {
                App.render({
                    type   : 'error',
                    message: 'Please choose employee or cancel changes'
                });
                return false;
            }
            for (id in this.changedModels) {
                model = this.editCollection.get(id);
                model.attributes.notify = this.editCollection.notify
                model.changed = this.changedModels[id];
                model.changed.year = this.yearElement.text();
                model.changed.month = this.monthElement.attr('data-content');

                if (!model.id && !model.changed.vacArray) {
                    this.deleteItem(id);
                }
            }
            this.editCollection.save();
            this.resetCollection();

            return App.render({
                type: 'notify',
                message:CONSTANTS.RESPONSES.EDIT_SUCCESS
            });
        },

        setChangedValueToModel: function () {
            var editedElement = this.$listTable.find('.editing');
            var editedCol;
            var editedElementRowId;
            var editedElementContent;
            var editedElementValue;
            var editVacationModel;

            if (editedElement.length) {
                editedCol = editedElement.closest('td');
                editedElementRowId = editedElement.closest('tr').data('id');
                editedElementContent = editedCol.data('content');
                editedElementValue = editedElement.val();

                editVacationModel = this.editCollection.get(editedElementRowId);

                if (!this.changedModels[editedElementRowId]) {
                    if (!editVacationModel.id) {
                        this.changedModels[editedElementRowId] = editVacationModel.attributes;
                    } else {
                        this.changedModels[editedElementRowId] = {};
                    }
                }

                this.changedModels[editedElementRowId][editedElementContent] = editedElementValue;

                editedCol.text(editedElementValue);
                editedCol.removeClass('errorContent');
                editedElement.remove();
            }
        },

        selectCourse: function (id) {
            var self = this;
            this.$el.find('#course').text('Select Course');
            this.$el.find('#batch').text('Select Batch');
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

        selectBatch: function (centerId, courseId) {
            var self = this;
            this.$el.find('#batch').text('Select Batch');
            this.$el.find('#listTable').html('');
            if (centerId !== '' && courseId !=='') {
                dataService.getData('/vbatch/center/course', {centerId: centerId, courseId: courseId}, function (batches) {
                    batches = _.map(batches.data, function (batch) {
                        batch.name = batch.batchName;

                        return batch;
                    });
                    self.responseObj['#batch'] = batches;
                });
            } else {
                self.responseObj['#batch'] = [];
            }

        },

        vacationTypeForDD: function (content) {
            var array = ['Clear', 'Vacation', 'Medical', 'Sick', 'Education'];
            var firstChar;

            array = _.map(array, function (element) {
                element = {
                    name: element
                };
                firstChar = element.name.charAt(0);
                if (firstChar !== 'C') {
                    element._id = firstChar;
                } else {
                    element._id = '';
                }

                return element;
            });
            content.responseObj['#vacType'] = array;
        },

        monthForDD: function (content) {
            var array = [];
            var i;

            for (i = 0; i < 12; i++) {
                array.push({
                    _id : moment().month(i).format('M'),
                    name: moment().month(i).format('MMMM')
                });
            }

            content.responseObj['#monthSelect'] = array;

        },

        yearForDD: function (content) {
            dataService.getData('/Vacation/getYears', {}, function (response, context) {
                content.responseObj['#yearSelect'] = response;
            }, content);
        },

        filterStudentsForDD: function (content) {
            var self = this;
            var $thisEl = this.$el;
            var centerId = $thisEl.find('#center').attr('data-id');
            var courseId = $thisEl.find('#course').attr('data-id');
            var batchId = $thisEl.find('#batch').attr('data-id');
            var monthElement = $thisEl.find('#monthSelect').attr('data-content');
            var yearElement = $thisEl.find('#yearSelect').attr('data-content');
            if(centerId !== '' && courseId !== '' && batchId !== '') {
                dataService.getData('/vstudents/leave', { centerId: centerId, courseId: courseId, batchId: batchId, month:monthElement, year:yearElement}, function (data) {
                        content.responseObj['#employee'] = data;
                        self.collection = data;
                        self.renderUi();
                        self.renderTable(data);
                    });
            }

        },

        /* hideInput: function (e) {
         var target = $(e.target);

         target.hide();
         },*/

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
                // $target.find('input').show();

            }

            return false;
        },

        setEditable: function (td) {

            if (!td.parents) {
                td = $(td.target).closest('td');
            }

            td.addClass('edited');

            if (this.isEditRows()) {
                this.setChangedValue();
            }

            return false;
        },

        setChangedValue: function () {
            if (!this.changed) {
                this.changed = true;
                this.showSaveCancelBtns();
            }
        },

        isEditRows: function () {
            var edited = this.$listTable.find('.edited');

            this.edited = edited;

            return !!edited.length;
        },

        showSaveCancelBtns: function () {
            var createBtnEl = $('#top-bar-createBtn');
            var saveBtnEl = $('#top-bar-saveBtn');
            var cancelBtnEl = $('#top-bar-deleteBtn');

            if (!this.changed) {
                createBtnEl.hide();
            }
            saveBtnEl.show();
            cancelBtnEl.show();

            return false;
        },

        goSort: function (e) {
            var target = $(e.target).closest('th');
            var currentParrentSortClass = target.attr('class');
            var sortClass = currentParrentSortClass.split(' ')[1];
            var dataSort = target.attr('data-sort').split('.');
            var sortConst = 1;
            var collection;

            collection = this.collection.toJSON();

            if (!sortClass) {
                target.addClass('sortUp');
                sortClass = 'sortUp';
            }

            switch (sortClass) {
                case 'sortDn':
                    target.parent().find('th').removeClass('sortDn').removeClass('sortUp');
                    target.removeClass('sortDn').addClass('sortUp');
                    sortConst = 1;
                    break;
                case 'sortUp':
                    target.parent().find('th').removeClass('sortDn').removeClass('sortUp');
                    target.removeClass('sortUp').addClass('sortDn');
                    sortConst = -1;
                    break;
                // skip default;
            }

            this.collection.sortByOrder(dataSort[0], dataSort[1], sortConst);

            this.renderTable(collection);
        },

        renderTable: function (collection) {
            var self = this;
            var itemView;
            var listTotalEl;
            collection.forEach(function (document) {
                document = self.getVacDaysCount(document, document.leave);
                return document;
            });


            this.$el.find('#listTable').html('');
            itemView = new ListItemView({
                collection: collection
            });
            this.$el.append(itemView.render());

            listTotalEl = this.$el.find('#listTotal');

            listTotalEl.html('');
            listTotalEl.append(_.template(listTotal, {array: this.getTotal(collection)}));
        },

        renderdSubHeader: function ($currentEl) {
            var subHeaderContainer;
            var month;
            var year;
            var columnContainer;
            var width;
            var date;
            var daysInMonth;
            var dateDay;
            var daysRow = '';
            var daysNumRow = '';
            var i;

            subHeaderContainer = $currentEl.find('.subHeaderHolder');

            month = this.monthElement.attr('data-content');
            year = this.yearElement.text();

            date = moment([year, month - 1, 1]);
            daysInMonth = date.daysInMonth();
            dateDay = date;

            for (i = 1; i <= daysInMonth; i++) {
                daysRow += '<th>' + dateDay.format('ddd') + '</th>';
                daysNumRow += '<th>' + i + '</th>';
                dateDay = date.add(1, 'd');
            }

            daysRow = '<tr class="subHeaderHolder borders">' + daysRow + '</tr>';

            daysNumRow = '<tr class="subHeaderHolder borders"><th class="oe_sortable" data-sort="employee.name">Student Name</th>' +
                 daysNumRow + '<th>Total Days</th></tr>';

            this.daysCount = daysInMonth;

            columnContainer = $('#columnForDays');
            width = 80 / daysInMonth;

            columnContainer.html('');

            for (i = daysInMonth; i > 0; i--) {
                columnContainer.append('<col width="' + width + '%">');
            }

            $(subHeaderContainer[0]).attr('colspan', daysInMonth - 12);
            $(subHeaderContainer[1]).replaceWith(daysRow);
            $(subHeaderContainer[2]).replaceWith(daysNumRow);
        },

        /* nextSelect: function (e) {
         this.showNewSelect(e, false, true);
         },

         prevSelect: function (e) {
         this.showNewSelect(e, true, false);
         },*/

        /* showNewSelect: function (e, prev, next) {
         e.stopPropagation();
         populate.showSelect(e, prev, next, this);

         return false;
         },
         */

        changedDataOptions: function () {
            var $thisEl = this.$el;
            var self = this;
            var month = this.monthElement.attr('data-content');
            var year = this.yearElement.attr('data-content');
            var centerId = $thisEl.find('#center').attr('data-id');
            var courseId = $thisEl.find('#course').attr('data-id');
            var batchId = $thisEl.find('#batch').attr('data-id');

            var searchObject = {
                month: month,
                year : year,
                centerId: centerId,
                courseId: courseId,
                batchId: batchId
            };

            this.changedModels = {};
             dataService.getData('/vstudents/leave', searchObject, function (data) {
                 self.collection = data;
                 self.renderUi();
                 self.renderTable(data);
             });
            //var collection = new EditCollection(this.collection);
            //collection.getFirstPage(searchObject);
        },

        checkEmptyArray: function (array) {
            array = _.compact(array);

            return !array.length;
        },

        chooseOption: function (e) {

            var $thisEl = this.$el;
            var target = $(e.target);
            var closestTD = target.closest('td');
            var targetElement = closestTD.length ? closestTD : target.closest('th').find('a');
            var tr = target.closest('tr');
            var tdTotalDays = $(tr).find('.totalDays');
            var modelId = tr.attr('data-id');
            var id = target.attr('id');
            var attr = targetElement.attr('id') || targetElement.data('content');
            var elementType = '#' + attr;
            var element = _.find(this.responseObj[elementType], function (el) {
                return el._id === id;
            });
            // ToDo refactor
            var delHTML = '<span title="Delete" class="icon-trash"></span>';

            var editVacationModel;
            var employee;
            var changedAttr;
            var dayIndex;
            var dayTotalElement;

            //  var findEmployee;

            e.preventDefault();
            if (modelId) {
                editVacationModel = this.editCollection.get(modelId);

                if (!this.changedModels[modelId]) {
                    if (!editVacationModel.id) {
                        this.changedModels[modelId] = editVacationModel.attributes;
                    } else {
                        this.changedModels[modelId] = {};
                    }
                }

                changedAttr = this.changedModels[modelId];
            }

            if (elementType === '#monthSelect' || elementType === '#yearSelect') {
                targetElement.text(target.text());

                targetElement.attr('data-content', target.attr('id'));
                if (elementType === '#monthSelect') {
                    this.monthElement = targetElement;
                } else {
                    this.yearElement = targetElement;
                }
                this.startTime = new Date();
                this.changedDataOptions();
                this.renderdSubHeader(this.$el);
            }

            if (elementType === '#employee') {

                tr.find('[data-content="employee"]').html(delHTML + element.name);

                employee = element._id;

                changedAttr.employee = employee;

                closestTD.removeClass('errorContent');
            }

            function checkDay(element, selectedClass) {
                var className;
                var employeesCount = dayTotalElement.text() === '' ? 0 : parseInt(dayTotalElement.text(), 10);
                var vacDaysCount = tdTotalDays.text().trim() === '' ? 0 : parseInt(tdTotalDays.text(), 10);

                if (element.hasClass('V')) {
                    className = 'V';
                } else if (element.hasClass('P')) {
                    className = 'P';
                } else if (element.hasClass('S')) {
                    className = 'S';
                } else if (element.hasClass('E')) {
                    className = 'E';
                }

                if (className) {
                    if (className !== selectedClass) {
                        element.toggleClass(className);

                        if (selectedClass === '') {
                            element.attr('class', 'editable');
                            vacDaysCount -= 1;
                            employeesCount -= 1;
                        } else {
                            element.toggleClass(selectedClass);
                            element.addClass('selectedType');
                        }
                    }
                } else {
                    if (selectedClass !== '') {
                        element.toggleClass(selectedClass);
                        element.addClass('selectedType');
                        vacDaysCount += 1;
                        employeesCount += 1;
                    }
                }

                tdTotalDays.text(vacDaysCount);
                !employeesCount ? dayTotalElement.text('') : dayTotalElement.text(employeesCount);
            }

            if (elementType === '#vacType') {
                dayIndex = targetElement.attr('data-dayID');
                dayTotalElement = $('#day' + dayIndex);

                targetElement.text(element._id);

                if (changedAttr && !changedAttr.vacArray) {
                    changedAttr.vacArray = _.clone(editVacationModel.toJSON().vacArray);
                    if (!changedAttr.vacArray) {
                        changedAttr.vacArray = new Array(this.daysCount);
                    }
                }

                if (targetElement.text() === '') {
                    if (!this.checkEmptyArray(changedAttr.vacArray)) {
                        checkDay(targetElement, element._id);
                        delete(changedAttr.vacArray[dayIndex]);
                        if (this.checkEmptyArray(changedAttr.vacArray)) {
                            this.deleteItem(modelId);
                        }
                    }
                } else {
                    checkDay(targetElement, element._id);
                    changedAttr.vacArray[dayIndex] = targetElement.text();
                }
            }

            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

            var centerId = $thisEl.find('#center').attr('data-id');
            var courseId = $thisEl.find('#course').attr('data-id');

            if (holder.attr('id') === 'center') {
                this.selectCourse(centerId);
            }
            if (holder.attr('id') === 'course') {
                this.changedModels = {}
                this.selectBatch(centerId, courseId);
            }
            if (holder.attr('id') === 'batch') {
                this.filterStudentsForDD(this);
            }

            this.hideNewSelect();
            this.setEditable(targetElement);

            return false;
        },

        getTotal: function (collection) {
            var self = this;
            var totalArray = new Array(this.daysCount);

            async.each(collection, function (document) {
                var i;

                for (i = self.daysCount - 1; i >= 0; i--) {
                    if(document) {
                        if(document.vacArray) {
                            if (document.vacArray[i]) {
                                totalArray[i] = totalArray[i] ? totalArray[i] += 1 : 1;
                            }
                        }
                    }
                }

            });

            return totalArray;
        },

        render: function () {
            var self = this;
            var $currentEl = this.$el;
            var collection;

            var year = this.startTime.getFullYear();
            var month = {};

            var listTotalEl;

            $('.ui-dialog ').remove();

            month.number = this.startTime.getMonth() + 1;
            month.name = moment(this.startTime).format('MMMM');

            $currentEl.html('');
            $currentEl.append(_.template(listTemplate, {options: {month: month, year: year}}));

            this.monthElement = $currentEl.find('#monthSelect');
            this.yearElement = $currentEl.find('#yearSelect');

            this.renderdSubHeader($currentEl);

            collection = this.collection;

            this.renderTable(collection);

            this.vacationTypeForDD(this);
            this.monthForDD(this);
            this.yearForDD(this);

            setTimeout(function () {
                self.bindingEventsToEditedCollection(self);

                self.$listTable = $('#listTable');
            }, 10);

            $currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');

            /*populate.get('#center', '/franchise/', {category: 'CENTER'}, 'centerName', this, true,{});*/

            dataService.getData('/franchise/', {category: 'CENTER'}, function (center) {
                center = _.map(center.data, function (center) {
                    center.name = center.centerName;
                    return center;
                });
                if(App.currentUser.profile._id === 1522230115000) {
                    center = Lodash.filter(center, function(v){ return v._id === App.currentUser.centerId });
                    $('#center').attr('data-id', center[0]._id);
                    $('#center').text(center[0].centerName);
                    var centerId = $('#center').attr('data-id');
                    self.selectCourse(centerId);
                } else {
                    self.responseObj['#center'] = center;
                }
            });


            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }
        },


        renderUi: function () {
            var self = this;
            var $currentEl = this.$el;
            var collection;

            var year = this.startTime.getFullYear();
            var month = {};

            var listTotalEl;

            $('.ui-dialog ').remove();

            month.number = this.startTime.getMonth() + 1;
            month.name = moment(this.startTime).format('MMMM');

            //$currentEl.html('');
            //$currentEl.append(_.template(listTemplate, {options: {month: month, year: year}}));

            this.monthElement = $currentEl.find('#monthSelect');
            this.yearElement = $currentEl.find('#yearSelect');

            this.renderdSubHeader($currentEl);

            collection = this.collection;

            this.renderTable(collection);

            this.vacationTypeForDD(this);
            this.monthForDD(this);
            this.yearForDD(this);

            setTimeout(function () {
                self.bindingEventsToEditedCollection(self);

                self.$listTable = $('#listTable');
            }, 10);

            //$currentEl.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');

            populate.get('#center', '/franchise/', {category: 'CENTER'}, 'centerName', this, true);

            if (App.guide) {
                if (App.notifyView) {
                    App.notifyView.undelegateEvents();
                    App.notifyView.stopListening();
                }
                App.notifyView = new GuideNotify({e: null, data: App.guide});
            }
        },

        showMoreContent: function (newModels) {
            var holder = this.$el;
            var collection = newModels.toJSON();

            this.editCollection = new EditCollection(collection);

            this.renderTable(collection);

            this.filterStudentsForDD(this);
            this.hideSaveCancelBtns();

            holder.find('#timeRecivingDataFromServer').remove();
            holder.append('<div id="timeRecivingDataFromServer">Created in ' + (new Date() - this.startTime) + ' ms</div>');
        },

        createItem: function () {
            var startData = {
                daysCount : this.daysCount,
                employee  : {},
                department: {},
                month     : this.monthElement.attr('data-content'),
                year      : this.yearElement.text()
            };

            var model = new VacationModel(startData);

            startData.cid = model.cid;

            if (!this.isNewRow()) {
                this.showSaveCancelBtns();
                this.editCollection.add(model);

                return new CreateView(startData);
            }
        },

        isNewRow: function () {
            var newRow = $('#false');

            return !!newRow.length;
        },

        deleteItemsRender: function (/* deleteCounter, deletePage*/) {
            this.renderTable(this.collection.toJSON());

            this.editCollection.reset(this.collection.models);
            this.hideSaveCancelBtns();
        },

        deleteItems: function () {
            var newElements;
            var id;

            if (this.changed) {
                this.cancelChanges();
            } else {
                newElements = this.$el.find('#false');
                id = newElements.data('id');

                if (id) {
                    this.editCollection.remove(id);
                }

                newElements.remove();
                this.hideSaveCancelBtns();
            }
        },

        deleteItem: function (id) {
            var self = this;
            var model;
            var mid = 39;

            var answer = confirm('Vacation is empty. Do you want to delete it?');

            if (answer === true) {
                if (id.length < 24) {
                    this.editCollection.remove(id);
                    delete this.changedModels[id];
                    self.deleteItemsRender(1, 1);
                } else {
                    model = this.collection.get(id);
                    model.destroy({
                        headers: {
                            mid: mid
                        },
                        wait   : true,
                        success: function () {
                            delete self.changedModels[id];
                            self.deleteItemsRender(1, 1);
                        },

                        error: function (model, res) {
                            if (res.status === 403) {
                                App.render({
                                    type   : 'error',
                                    message: 'You do not have permission to perform this action'
                                });
                            }
                            self.deleteItemsRender(1, 1);

                        }
                    });
                }
            }

        },

        getVacDaysCount: function (model, objs) {
            if (Array.isArray(objs) && !_.isEmpty(objs)) {
                var array = objs ? _.compact(objs[0].vacArray) : null;
                model.vacArray = objs ? objs[0].vacArray : null;
                model.countVacationDays = array ? array.length : null;
            } else {
                model.daysCount = this.daysCount;
                model.month = this.monthElement.attr('data-content');
                model.year = this.yearElement.text();
            }
            return model;
        },

        cancelChanges: function () {
            var self = this;
            var edited = this.edited;
            var collection = this.collection;
            var listTotalEl;

            async.each(edited, function (el, cb) {
                var tr = $(el).closest('tr');
                var id = tr.data('id');
                var template = _.template(cancelEdit);
                var model;

                if (!id) {
                    return cb('Empty id');
                }
                if (id.length < 24) {
                    tr.remove();
                    model = self.changedModels;

                    if (model) {
                        delete model[id];
                    }

                    return cb();
                }

                model = collection.get(id);
                model = self.getVacDaysCount(model.toJSON());
                tr.replaceWith(template({vacation: model}));
                cb();
            }, function (err) {
                if (!err) {
                    self.bindingEventsToEditedCollection(self);
                    self.hideSaveCancelBtns();
                }
            });

            listTotalEl = this.$el.find('#listTotal');

            listTotalEl.html('');
            listTotalEl.append(_.template(listTotal, {array: this.getTotal(this.collection.toJSON())}));
        }


    });

    return VacationListView;
});
