define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'views/selectView/selectView',
    'text!templates/VBatchesManagement/batchDetails/offLineSchedule/ListTemplate.html',
    'views/VBatchesManagement/batchDetails/offLineSchedule/EditView',
    'views/VBatchesManagement/batchDetails/offLineSchedule/CreateView',
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
    'collections/OffLineSchedule/filterCollection',
], function ($, _, listViewBase, SelectView, listTemplate,EditView, CreateView, CurrentModel, dataService, async, helpers, lodash, populate, moment, common, CONSTANTS, ga, GA, ContentCollection) {
    'use strict';
    var monthObj;

    var ListView = listViewBase.extend({
        template  : _.template(listTemplate),
        listTemplate     : listTemplate,
        CurrentModel     : CurrentModel,
        changedModels    : {},
        responseObj      : {},
        contentType      : 'OffLineSchedule',
        el        : '#offLineTab',

        initialize: function (options) {
            var self = this;
            this.newCollection = options.newCollection;
            this.deleteCounter = 0;
            this.page = options.collection.currentPage;
            this.collection = options.collection;
            this.schedule = options.schedule;
            console.log('ContentCollection.............',self.contentType);
            self.render()
        },


        events: {
            'click .searchBtn': 'renderData',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click td.editable, .current-selected'             : 'showNewSelect',
            'click .goToEdit'         : 'goToEditDialog',
            'click .goToRemove'       : 'deleteItem',
            'click #top-bar-createBtn': 'create',
            'click .toggleList'       : 'toggleList'
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

        deleteItem: function (e) {
            var self = this;
            var tr = $(e.target).closest('tr');
            var id = tr.attr('data-id');
            var model = this.collection.get(id);
            var answer = confirm('Really DELETE items ?!');

            e.preventDefault();

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.DELETE_SHIPPING_METHOD
            });

            if (answer === true && model) {

                model.destroy({
                    success: function (model) {
                        self.$el.find('tr[data-id="' + model.id + '"]').remove();
                        self.collection.remove(id)
                        self.render()
                    },

                    error: function (model, err) {
                        self.collection = new ContentCollection({});
                        if (err.status === 403) {
                            App.render({
                                type   : 'error',
                                message: 'You do not have permission to perform this action'
                            });
                        } else if (err.status === 401) {
                            App.render({
                                type   : 'error',
                                message: err.responseText
                            });
                        }
                    }
                });
            }
        },

        toggleList: function (e) {
            e.preventDefault();

            this.$el.find('.forToggle').toggle();
        },

        goToEditDialog: function (e) {

            var id = $(e.target).closest('tr').data('id');
            var model = this.collection.getElement(id);
            console.log("model", model.toJSON())
            if (!model) {
                return;
            }

            App.ownContentType = true;

            return new EditView({model: model, collection : this.collection});

           /* var tr = $(e.target).closest('tr');
            var id = tr.attr('data-id');
            var model = this.collection.get(id);

            e.preventDefault();
            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.EDIT_SHIPPING_METHOD
            });

            if (model) {
                return new EditView({model: model, collection: this.collection});
            }*/
        },

        create: function (e) {
            e.preventDefault();

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.CREATE_SHIPPING_METHOD
            });

            return new CreateView({collection: this.collection});
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

            var centerId = $thisEl.find('#center1').attr('data-id');
        },

        render: function () {
            var $currentEl = this.$el;
            var self = this;
            var $thisEl = this.$el;
            $currentEl.html('');
            var centerId = $thisEl.find('#center1').attr('data-id');
            var subjectId = $thisEl.find('#subject_SC').attr('data-id');
            var result = [] ;
            $('.ui-dialog ').remove();
            $('#top-bar-deleteBtn').hide();

            dataService.getData('/permission/tabs', {module : CONSTANTS.MID.VBatchesManagement, moduleId: CONSTANTS.MID.OfflineSchedule}, function (data) {
                self.permissionObj = data.data;
                var className =  (data.data.tab || self.schedule == 'offLineschedule') ? 'active' : '';
                $('#offLineschedule').addClass(className);
                $('#offLineTab').addClass(className)
                if(data.data.read) {
                    $('#offLineschedule').removeClass('hide')
                    $('#offLineTab').removeClass('hide')
                } else {
                    $('#offLineschedule').addClass('hide')
                    $('#offLineTab').addClass('hide')
                }

                $currentEl.html(_.template(listTemplate, {
                    data            : '',
                    collection      : self.collection.toJSON(),
                    lodash          : lodash,
                    dataPermission  : data,
                    monthObj        : monthObj,
                    moment          : moment
                }));
                setTimeout(function () {
                    common.datatableInitWithoutExport('example3')
                }, 500)
            });

        },

        renderData: function () {
            var $currentEl = this.$el;
            var self = this;
            var $thisEl = this.$el;
            var centerId = $thisEl.find('#center1').attr('data-id');
            var subjectId = $thisEl.find('#subject_SC').attr('data-id');
            var center = lodash.filter(this.centers, {'_id': centerId});
            var subject = lodash.filter(this.subjects, {'_id': subjectId});
            var dataObj = {center: center.length > 0 ? center[0]: {}, subject: subject.length > 0 ? subject[0] : {}};
            var facultymonth = $thisEl.find('#month').attr('data-id');
            monthObj = facultymonth;
            var year = 2018;

            $('.ui-dialog ').remove();
            $('#top-bar-deleteBtn').hide();

            if (!center.length) {
                return App.render({
                    type: 'error',
                    message: "Select the center from the list."
                });
            }

            if (!subject.length) {
                return App.render({
                    type: 'error',
                    message: "Select the subject from the list."
                });
            }

            dataService.getData('/permission/tabs', {module : CONSTANTS.MID.VFRANCHISEDETAILS, moduleId: CONSTANTS.MID.VFRANCHISECOURSES}, function (data) {
                dataService.getData('/vsubject/month', {center: centerId, subject: subjectId, month: facultymonth, year: year}, function (result) {
                    $currentEl.html(_.template(listTemplate, {
                        data            : dataObj,
                        collection      : result.data,
                        lodash          : lodash,
                        dataPermission  : data,
                        monthObj        : monthObj,
                        moment          : moment
                    }));
                    setTimeout(function () {
                        common.datatableInitWithoutExport('example2')
                    }, 500)

                });
            });

        }

    });

    return ListView;
});
