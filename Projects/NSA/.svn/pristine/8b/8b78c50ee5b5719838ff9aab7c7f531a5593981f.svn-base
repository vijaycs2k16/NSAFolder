define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'views/selectView/selectView',
    'text!templates/VCourseReports/list/ListTemplate.html',
    'models/vTransactionsModel',
    'collections/VCourseReports/filterCollection',
    'collections/VCourseReports/editCollection',
    'dataService',
    'async',
    'helpers',
    'Lodash',
    'common'
], function ($, _, listViewBase, SelectView, listTemplate, CurrentModel, contentCollection, EditCollection, dataService, async, helpers, lodash, common) {
    'use strict';

    var ListView = listViewBase.extend({
        listTemplate     : listTemplate,
        CurrentModel     : CurrentModel,
        contentCollection: contentCollection,
        contentType      : 'VCourseReports',
        changedModels    : {},
        responseObj      : {},

        initialize: function (options) {
            $(document).off('click');

            this.startTime = options.startTime;
            this.collection = options.collection;
            this.parrentContentId = options.collection.parrentContentId;
            this.sort = options.sort;
            this.filter = options.filter;
            this.page = options.collection.currentPage;
            this.contentCollection = contentCollection;

            this.render();
        },

        events: {
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click td.editable, .current-selected'             : 'showNewSelect'
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
            var academicId = $thisEl.find('#academic').attr('data-id');
            this.render(academicId)

            if (holder.attr('id') === 'academicYear') {
                //this.selectacademicYear(academicId);
            }
        },

        selectacademicYear: function (id) {
            var self = this;
            self.$el.find('#academic').text('Select');
        },


        render: function (id) {
            var $currentEl;
            var itemView;
            var self = this;
            var template;

            $('.ui-dialog ').remove();

            $('#top-bar-deleteBtn').hide();

            $currentEl = this.$el;

            $currentEl.html('');

            dataService.getData('/vregister/years', {}, function (academics) {
                academics = _.map(academics.data, function (academic) {
                    academic.name = academic.year;
                    academic._id = academic.year;

                    return academic;
                });
                self.academic = academics;
                self.responseObj['#academic'] = academics;
            });

            dataService.getData('vtransactions/reports', {id: id ? id : '2018-2019'}, function (result) {
                $currentEl.html(_.template(listTemplate, {
                    collection      : result,
                    _           : _,
                    lodash      : lodash,
                    data        : id,
                    acObj       : self.academic
                }));
                common.datatableInit('report')
            })


        }

    });

    return ListView;
});
