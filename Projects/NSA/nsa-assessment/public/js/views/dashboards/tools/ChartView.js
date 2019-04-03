define([
    'Backbone',
    'jQuery',
    'Underscore',
    'Lodash',
    'text!templates/dashboards/tools/ChartTemplate.html',
    'text!templates/dashboards/tools/TableTemplate.html',
    'text!templates/dashboards/tools/SingleTemplate.html',
    'dataService',
    'constants',
    'async',
    'd3',
    'custom',
    'moment',
    'common',
    'helpers',
    'helpers/d3Helper'
], function (Backbone, $, _, Lodash, template, tableTemplate, singleTemplate, dataService, CONSTANTS, async, d3, custom, moment, common, helpers, d3Helper) {
    'use strict';

    var View = Backbone.View.extend({

        template      : _.template(template),
        tableTemplate : _.template(tableTemplate),
        singleTemplate: _.template(singleTemplate),

        initialize: function (options) {
            this.options = options;
            this.width = this.$el.width();
            this.height = this.$el.height() - 40;
            this.cellsModel = options.cellsModel;
            this.limitCells = options.limitCells;
            this.xPoints = options.xPoints;
            this.yPoints = options.yPoints;
            this.selfEl = options.selfEl;
            this.margin = {
                top   : 10,
                left  : 35,
                bottom: 55,
                right : 40
            };
            this.id = '#' + this.$el.attr('id');
            this.dialogChartWidth = options.width;
            this.dialogChartHeight = options.height;
            this.openView = options.openView;

            this.render();
        },

        events: {
            'click .workflow-sub'     : 'chooseWorkflowDetailes',
            'click .workflow-list li' : 'chooseWorkflowDetailes',
        },

        clearChartHolder: function (svg) {
            var height;
            var width;

            if (this.dialogChartWidth && this.dialogChartHeight) {
                width = this.dialogChartWidth;
                height = this.dialogChartHeight;
            } else {
                width = this.$el.width() + 'px';
                height = parseFloat(this.$el.height()) - parseFloat(this.$el.find('.panel-heading').height()) + 'px';
            }

            this.$el.find('.chartHolder').empty();
            this.$el.find('.chartHolder').html('<svg width="' + width + '" height="' + height + '"></svg>');
        },

        renderLineChart: function (data, xLabel, yLabel, textObj) {
            this.clearChartHolder();
            var options = {};

            if (!data || !data.length) {
                return;
            }

            options.xAxisFiled = xLabel;
            options.yAxisFiled = yLabel;
            options.typeXAxisFiled = typeof data[0][xLabel];
            options.typeYAxisFiled = typeof data[0][yLabel];
            options.data = data;
            options.openView = this.openView;

            options.container = this.$el.closest(this.id).find('.chartHolder');
            options.selector = this.id + ' .chartHolder';
            options.symbol = yLabel === 'sum' ? '$' : '';

            d3Helper.drawLineChart(options);
        },

        renderVerticalBarChart: function (data, xLabel, yLabel, textObj) {
            this.clearChartHolder();
            var self = this;
            var options = {};
            var $svg = d3.select(self.id).select('svg');

            if (!data || !data.length) {
                return;
            }

            options.data = data;
            options.xAxisFiled = xLabel;
            options.yAxisFiled = yLabel;
            options.typeYAxisFiled = typeof data[0][yLabel];
            options.typeXAxisFiled = typeof data[0][xLabel];
            options.container = this.$el.closest(this.id).find('.chartHolder');
            options.selector = this.id + ' .chartHolder';
            options.symbol = yLabel === 'sum' ? '₹' : '';
            options.openView = this.openView;

            d3Helper.drawVerticalChart(options);
        },

        renderHorizontalBarChart: function (data, xLabel, yLabel, textObj) {
            var options = {};

            this.clearChartHolder();

            if (!data || !data.length) {
                return;
            }

            options.data = data;
            options.xAxisFiled = xLabel;
            options.yAxisFiled = yLabel;
            options.typeXAxisFiled = typeof data[0][xLabel];
            options.typeYAxisFiled = typeof data[0][yLabel];
            options.container = this.$el.closest(this.id).find('.chartHolder');
            options.selector = this.id + ' .chartHolder';
            options.symbol = yLabel === 'sum' ? '₹' : '';
            options.openView = this.openView;

            d3Helper.drawHorizontalChart(options);
        },

        renderDonutChart: function (data, valueLabel, nameLabel) {
            this.clearChartHolder();
            var options = {};
            if (!data || !data.length) {
                return;
            }
            options.data = data;
            options.xAxisFiled = nameLabel;
            options.yAxisFiled = valueLabel;
            options.typeXAxisFiled = typeof data[0][nameLabel];
            options.typeYAxisFiled = typeof data[0][valueLabel];
            options.container = this.$el.closest(this.id).find('.chartHolder');
            options.selector = this.id + ' .chartHolder';
            options.symbol = valueLabel === 'sum' ? '₹' : '';
            options.openView = this.openView;

            d3Helper.drawDonutChart(options);
        },

        renderHorizontalBarLayout: function (data, keys, textObj) {
            this.clearChartHolder();
            var options = {};

            if (!data || !data.length) {
                return;
            }

            if (!keys.length || keys.length < 2 || !data.length) {
                return;
            }

            options.data = data;

            options.yAxisFiled = 'source';
            options.typeYAxisFiled = typeof data[0]['source'];
            options.doubleValueXAxisFiled = keys[0];
            options.numericXAxisFiled = keys[1];

            options.container = this.$el.closest(this.id).find('.chartHolder');
            options.selector = this.id + ' .chartHolder';
            options.symbol = options.numericXAxisFiled === 'sum' ? '₹' : '';
            options.openView = this.openView;

            d3Helper.drawHorizontalTwoColorChart(options);
        },

        renderDonutAnimatedChart: function (data, valueLabel, nameLabel) {
            this.clearChartHolder();
            var options = {};

            if (!data || !data.length) {
                return;
            }

            options.data = data;
            options.xAxisFiled = nameLabel;
            options.yAxisFiled = valueLabel;
            options.typeXAxisFiled = typeof data[0][nameLabel];
            options.typeYAxisFiled = typeof data[0][valueLabel];
            options.container = this.$el.closest(this.id).find('.chartHolder');
            options.selector = this.id + ' .chartHolder';
            options.symbol = valueLabel === 'sum' ? '₹' : '';
            options.animated = true;
            options.openView = this.openView;

            d3Helper.drawDonutChart(options);
        },

        renderPieChart: function (data, valueLabel, nameLabel) {
            this.clearChartHolder();
            var options = {};

            if (!data || !data.length) {
                return;
            }

            options.data = data;
            options.xAxisFiled = nameLabel;
            options.yAxisFiled = valueLabel;
            options.typeXAxisFiled = typeof data[0][nameLabel];
            options.typeYAxisFiled = typeof data[0][valueLabel];
            options.container = this.$el.closest(this.id).find('.chartHolder');
            options.selector = this.id + ' .chartHolder';
            options.symbol = valueLabel === 'sum' ? '₹' : '';
            options.openView = this.openView;

            d3Helper.drawPieChart(options);
        },

        renderPieAnimatedChart: function (data, valueLabel, nameLabel) {
            this.clearChartHolder();
            var options = {};

            if (!data || !data.length) {
                return;
            }

            options.data = data;
            options.xAxisFiled = nameLabel;
            options.yAxisFiled = valueLabel;
            options.typeXAxisFiled = typeof data[0][nameLabel];
            options.typeYAxisFiled = typeof data[0][valueLabel];
            options.container = this.$el.closest(this.id).find('.chartHolder');
            options.selector = this.id + ' .chartHolder';
            options.symbol = valueLabel === 'sum' ? '₹' : '';
            options.animated = true;
            options.openView = this.openView;

            d3Helper.drawPieChart(options);
        },

        renderTable: function (response) {
            var $svg = this.$el.closest(this.id);
            var data = response.data;
            var columns = [{
                text : 'Date',
                field: 'invoiceDate'
            }, {
                text    : 'Customer',
                field   : 'supplier',
                subField: 'name'
            }, {
                text    : 'Amount',
                field   : 'paymentInfo',
                subField: 'total'
            }];

            $svg.find('.chartHolder').html(this.tableTemplate({
                columns         : columns,
                data            : data,
                oneRow          : false,
                course          : false,
                notification    : false,
                userDetails     : false,
                empDetails      : false,
                topics          : false,
                assessment      : false,
                topStudents     : false,
                currencySplitter: helpers.currencySplitter,
                moment          : moment
            }));

        },

        renderCourseTables: function (response) {
            var $svg = this.$el.closest(this.id);
            var data = response.data;
            var columns = [{
                text : 'Center',
                field: 'invoiceDate'
            }, {
                text    : 'Courses',
                field   : 'courseCount',
            }, {
                text    : 'Batches',
                field   : 'batchCount',
            }];

            $svg.find('.chartHolder').html(this.tableTemplate({
                columns         : columns,
                data            : data,
                oneRow          : false,
                course          : true,
                notification    : false,
                userDetails     : false,
                empDetails      : false,
                topics          : false,
                currencySplitter: helpers.currencySplitter,
                moment          : moment
            }));

        },

        topicWiseTable: function (response) {
            var $svg = this.$el.closest(this.id);
            var data = response;
            var columns = [{
                text : 'Topic',
                field: '_id'
            }, {
                text    : 'Q.Count',
                field   : 'count',
            }];

            $svg.find('.chartHolder').html(this.tableTemplate({
                columns         : columns,
                data            : data,
                oneRow          : false,
                course          : false,
                notification    : false,
                topics          : false,
                topicData       : true,
                assessment      : false,
                topStudents     : false,
                userDetails     : false,
                empDetails      : false,
                currencySplitter: helpers.currencySplitter,
                moment          : moment
            }));
        },
        examWiseStudentsTable: function (response) {
            var $svg = this.$el.closest(this.id);
            var data = response;
            var columns = [{
                text : 'Exam',
                field: '_id'
            }, {
                text    : 'Total Students',
                field   : 'sum',
            },{
                text    : 'Students Attended',
                field   : 'count',
            }];

            $svg.find('.chartHolder').html(this.tableTemplate({
                columns         : columns,
                data            : data,
                oneRow          : false,
                course          : true,
                notification    : false,
                topics          : false,
                topicData       : false,
                assessment      : false,
                topStudents     : false,
                userDetails     : false,
                empDetails      : false,
                currencySplitter: helpers.currencySplitter,
                moment          : moment
            }));
        },

        studentTodayTopicsDetails: function (response) {
            var $svg = this.$el.closest(this.id);
            var data = response.data;
            var columns = [{
                text : 'Date',
                field: 'invoiceDate'
            }, {
                text    : 'Topic',
                field   : 'courseCount',
            }, {
                text    : 'Start',
                field   : 'batchCount',
            }, {
                text    : 'End',
                field   : 'batchCount',
            }, {
                text    : 'Faculty',
                field   : 'batchCount',
            }];

            $svg.find('.chartHolder').html(this.tableTemplate({
                columns         : columns,
                data            : data,
                oneRow          : false,
                course          : false,
                notification    : false,
                topics          : true,
                assessment      : false,
                topStudents     : false,
                userDetails     : false,
                empDetails      : false,
                currencySplitter: helpers.currencySplitter,
                moment          : moment
            }));

        },

        showTopStudents: function(response){
            var self = this;
            var $svg = this.$el.closest(this.id);
            this.topStudentsRes = response.data;

            $svg.find('.chartHolder').html(this.tableTemplate({
                data            : self.topStudentsRes,
                oneRow          : false,
                course          : false,
                notification    : false,
                topics          : false,
                assessment      : false,
                userDetails     : false,
                topStudents     : true,
                empDetails      : false,
                currencySplitter: helpers.currencySplitter,
                moment          : moment
            }));

            $(".workflow-list").empty();
            this.topStudentsRes.forEach( function (item){
                $(".workflow-list").append('<li data-id="'+ item._id +'"><a href="javascript:;" data-id="'+ item._id +'" title="'+ item.name +'" class="workflow">' + item.name +'</a></li>');
                self.$el.find('.workflow-list li').first().addClass('active');
                self.$el.find('.workflow-list li').first().click();
            })
        },

        chooseWorkflowDetailes: function (e, el) {
            var $target = e ? $(e.target) : el;
            var $thisEl = this.$el;
            var self = this;
            var id;
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            $thisEl.find('.workflow-sub-list>*').remove();
            $thisEl.find('#details').addClass('active').show();
            $thisEl.find('#workflows').empty();
            $thisEl.find('#workflowNames').html('');

            if ($target.hasClass('workflow')) {
                $('.workflow-list .active').removeClass('active');
                $target.parent().addClass('active');
            }
            this.examId = $target.data('id');
            var data = _.find(this.topStudentsRes, {'_id': this.examId});
            console.info('data',data);
            $thisEl.find('#workflows').append('<table class="list stripedList"><thead><tr><th class="text-left">StudentName</th><th class="text-left">Center</th><th class="text-left">Marks</th></tr></thead><tbody id="'+data._id+'"></tbody></table>');
            $thisEl.find('#'+ data._id).empty();
            Lodash.forEach(data.students, function (item, index) {
                $thisEl.find('#'+data._id).append('<tr><td class="text-left">' +item._id.studentName +'</td><td class="text-left">'+ item.studentCenter.centerName +'</td><td class="text-left">' + item.score +'</td></tr>');
            })
        },

        studentAssessmentDetails: function (response) {
            var $svg = this.$el.closest(this.id);
            var data = response.data;
            var columns = [{
                text : 'Exam Name',
                field: 'name'
            }, {
                text    : 'Date',
                field   : 'batchCount',
            }, {
                text    : 'Start Time',
                field   : 'batchCount',
            }, {
                text    : 'End Time',
                field   : 'score',
            }, {
                    text    : 'Mode',
                    field   : 'score',
            },{
                    text    : 'Status',
                    field   : 'score',
            }
            ];

            $svg.find('.chartHolder').html(this.tableTemplate({
                columns         : columns,
                data            : data,
                oneRow          : false,
                course          : false,
                notification    : false,
                topics          : false,
                userDetails     : false,
                empDetails      : false,
                assessment      : true,
                topStudents     : false,
                currencySplitter: helpers.currencySplitter,
                moment          : moment
            }));

        },

        studentHomeworkDetails: function (response) {
            var $svg = this.$el.closest(this.id);
            var data = response.data;
            var columns = [{
                text : 'Date',
                field: 'invoiceDate'
            }, {
                text    : 'Courses',
                field   : 'courseCount',
            }, {
                text    : 'Batches',
                field   : 'batchCount',
            }];

            $svg.find('.chartHolder').html(this.tableTemplate({
                columns         : columns,
                data            : data,
                oneRow          : false,
                course          : false,
                notification    : false,
                topics          : true,
                userDetails     : false,
                empDetails      : false,
                assessment      : false,
                topStudents     : false,
                currencySplitter: helpers.currencySplitter,
                moment          : moment
            }));

        },

        studentNotificationDetails: function (response) {
            var $svg = this.$el.closest(this.id);
            var data = response.data;
            var columns = [{
                text    : 'Title',
                field   : 'smsTemplateTitle'
            }, {
                text    : 'Message',
                field   : 'smsTemplateMsg',
            }, {
                text    : 'Created By',
                field   : 'updatedBy',
            }];

            $svg.find('.chartHolder').html(this.tableTemplate({
                columns         : columns,
                data            : data,
                oneRow          : false,
                course          : false,
                notification    : true,
                topics          : false,
                userDetails     : false,
                empDetails      : false,
                assessment      : false,
                topStudents     : false,
                currencySplitter: helpers.currencySplitter,
                moment          : moment
            }));

        },

        employeeNotificationDetails: function (response) {
            var $svg = this.$el.closest(this.id);
            var data = response.data;
            var columns = [{
                text    : 'title',
                field   : 'smsTemplateTitle'
            }, {
                text    : 'message',
                field   : 'smsTemplateMsg',
            }, {
                text    : 'created By',
                field   : 'updatedBy',
            }];

            $svg.find('.chartHolder').html(this.tableTemplate({
                columns         : columns,
                data            : data,
                oneRow          : false,
                course          : false,
                notification    : true,
                topics          : false,
                userDetails     : false,
                empDetails      : false,
                assessment      : false,
                topStudents     : false,
                currencySplitter: helpers.currencySplitter,
                moment          : moment
            }));

        },


        markEngagedCells: function () {
            var newEngagedCells = [];
            var self = this;

            $('.panel').each(function () {
                var xIndex = self.xPoints.indexOf(parseFloat($(this).attr('data-x')));
                var yIndex = self.yPoints.indexOf(parseFloat($(this).attr('data-y')));
                var panelWidth = parseInt($(this).attr('data-width'), 10);
                var panelHeight = parseInt($(this).attr('data-height'), 10);
                var xIndexVal = xIndex + panelWidth;
                var yIndexVal = yIndex + panelHeight;
                var dataIndex = [];
                var i;
                var j;

                for (i = xIndex; i < xIndexVal; i++) {

                    for (j = yIndex; j < yIndexVal; j++) {
                        dataIndex.push(i + '' + j);
                        newEngagedCells.push(i + '' + j);
                    }
                }

                $(this).attr('data-index', dataIndex);
            });

            this.cellsModel.set({engagedCells: (this.limitCells.slice(0)).concat(newEngagedCells)});
        },

        renderTableOverview: function (response) {
            this.clearChartHolder();
            var $svg = this.$el.closest(this.id);
            var data = response && response.data ? response.data : response;
            var columns = [];
            var totalCount;
            var totalRevenue;
            var totalCountSum = 0;
            var totalRevenueSum = 0;
            var totalStatusCount = 0;
            var secondRow = [];
            var statusObject = {
                allocateStatus: {
                    NOA: 0,
                    ALL: 0,
                    NOT: 0,
                    NOR: 0
                },

                fulfillStatus: {
                    NOA: 0,
                    ALL: 0,
                    NOT: 0,
                    NOR: 0
                },

                shippingStatus: {
                    NOA: 0,
                    ALL: 0,
                    NOT: 0,
                    NOR: 0
                }
            };

            data.forEach(function (el) {
                totalCountSum += el.count;
                totalRevenueSum += el.total;

                if (el.status && el.status.length) {
                    totalStatusCount++;
                    el.status.forEach(function (stat) {
                        statusObject.allocateStatus[stat.allocateStatus] += 1;
                        statusObject.fulfillStatus[stat.fulfillStatus] += 1;
                        statusObject.shippingStatus[stat.shippingStatus] += 1;
                    });
                }

            });

            $svg.find('.chartHolder').html(this.tableTemplate({
                columns         : columns,
                data            : data,
                oneRow          : true,
                userDetails     : false,
                empDetails      : false,
                assessment      : false,
                topStudents     : false,
                currencySplitter: helpers.currencySplitter,
                moment          : moment
            }));

            totalCount = $svg.find('.totalCount');
            totalRevenue = $svg.find('.totalRevenue');

            if (totalStatusCount) {
                secondRow = [{
                    name : 'Allocated',
                    value: statusObject.allocateStatus
                }, {
                    name : 'Fulfilled',
                    value: statusObject.fulfillStatus
                }, {
                    name : 'Shipped',
                    value: statusObject.shippingStatus
                }];

                $svg.find('.allocated').text(helpers.currencySplitter(statusObject.allocateStatus.ALL.toFixed()));
                $svg.find('.fulfilled').text(helpers.currencySplitter(statusObject.fulfillStatus.ALL.toFixed()));
                $svg.find('.shipped').text(helpers.currencySplitter(statusObject.shippingStatus.ALL.toFixed()));

                $svg.find('.status div').removeClass('hidden');
            }

            totalCount.text(helpers.currencySplitter(totalCountSum.toFixed()));
            totalRevenue.text(helpers.currencySplitter(totalRevenueSum.toFixed(2)));

        },


        studentCourseDetails: function (response) {
            this.clearChartHolder();
            var $svg = this.$el.closest(this.id);
            var data = response && response.data ? response.data : response;
            $svg.find('.chartHolder').html(this.tableTemplate({
                data            : data.student,
                oneRow          : false,
                userDetails     : true,
                empDetails      : false,
                currencySplitter: helpers.currencySplitter,
                moment          : moment
            }));

        },

        employeeCourseDetails: function (response) {
            this.clearChartHolder();
            var $svg = this.$el.closest(this.id);
            var data = response && response.data ? response.data : response;
            $svg.find('.chartHolder').html(this.tableTemplate({
                data            : data.relatedEmployee,
                oneRow          : false,
                userDetails     : false,
                empDetails      : true,
                currencySplitter: helpers.currencySplitter,
                moment          : moment
            }));

        },

        renderSingleValue: function (response, title) {
            this.clearChartHolder();
            var $svg = this.$el.closest(this.id);

            if ($svg.width() < 400) {
                ///$svg.width('400px');
                //$svg.height('100px');
                this.$el.attr('data-width', 6);
                // this.$el.attr('data-height', 1);
                this.markEngagedCells();
            }

            $svg.find('.chartHolder').html(this.singleTemplate({
                data: {
                    revenue: response.total,
                    count  : response.count || 0
                },

                title           : title,
                currencySplitter: helpers.currencySplitter
            }));
        },

        setHref: function (href) {
            var ref = '#erp/' + href;
            this.$el.find('#viewAll').attr('href', ref);
        },

        setFilters: function(data, key) {
            var filter = {};
            for(var i = 0; i < key.length; i++){
                filter[key[i]] = {};
                filter[key[i]]['key'] = key[i];
                filter[key[i]]['value'] = Lodash.map(data, key[i]);
            }
            return filter;
        },

        setCustomFilters: function(data, key, customFields) {
            var filter = {};
            for(var i = 0; i < key.length; i++){
                filter[key[i]] = {};
                filter[key[i]]['key'] = customFields[i];
                filter[key[i]]['value'] = Lodash.map(data, customFields[i]);
            }
            return filter;
        },

        setClass: function (cl) {
            this.$el.find('#viewAll').addClass('hide');
        },

        render: function () {
            var height;
            var width;
            var self = this;
            var chartObj;

            if (this.dialogChartWidth && this.dialogChartHeight) {
                width = this.dialogChartWidth;
                height = this.dialogChartHeight;
            } else {
                width = this.$el.width() + 'px';
                height = parseFloat(this.$el.height()) - parseFloat(this.$el.find('.panel-heading').height()) + 'px';
            }

            // this.$el.find('.chartHolder').append(this.template({
            //     width : width,
            //     height: height
            // }));

            chartObj = {

                line: {
                    invoiceByWeek: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {

                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getinvoiceByWeek(filter, true, function (data) {
                            self.renderLineChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Invoice'
                            });
                        });

                        self.setHref('invoice');
                    },

                    purchaseInvoiceByWeek: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getinvoiceByWeek(filter, false, function (data) {
                            self.renderLineChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Purchase Invoice'
                            });
                        });

                        self.setHref('purchaseInvoices');
                    },

                    revenueByFranchise: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByFranchise(filter, false, function (data) {
                            self.renderLineChart(data, '_id', 'sum', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Country'
                            });
                        });

                        self.setHref('VDashboardReports');
                    },
                },

                horizontalBar: {

                    revenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, true, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Sales Manager'
                            });
                        });

                        self.setHref('invoice');
                    },

                    revenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, true, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Country'
                            });
                        });

                        self.setHref('invoice');
                    },

                    revenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, true, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Customer'
                            });
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, false, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Sales Manager'
                            });
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, false, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Country'
                            });
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, false, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Customer'
                            });
                        });

                        self.setHref('invoice');
                    },

                    revenueByFranchise: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByFranchise(filter, false, function (data) {
                            self.renderHorizontalBarChart(data, 'sum', '_id', {
                                xAxisLabel: 'Revenue',
                                yAxisLabel: 'Country'
                            });
                        });

                        self.setHref('VDashboardReports');
                    },
                },

                verticalBar: {
                    invoiceByWeek: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getinvoiceByWeek(filter, true, function (data) {
                            self.renderVerticalBarChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Invoice'
                            });
                        });

                        self.setHref('invoice');
                    },

                    purchaseInvoiceByWeek: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getinvoiceByWeek(filter, false, function (data) {
                            self.renderVerticalBarChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Purchase Invoice'
                            });
                        });

                        self.setHref('purchaseInvoices');
                    },

                    stockAvailableByFranchise: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getStocksAvailable(filter, false, function (data) {
                            self.renderVerticalBarChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Purchase Invoice'
                            });
                        });

                        self.setHref('VDashboardReports');
                    },

                    revenueByFranchise: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByFranchise(filter, false, function (data) {
                            self.renderVerticalBarChart(data, '_id', 'sum', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Purchase Invoice'
                            });
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setFilters(data, ['center']);
                                self.setHref('EnrollMent/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('EnrollMent/list');
                            }
                        });
                    },

                    pendingRevenueByFranchise: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByFranchise(filter, true, function (data) {
                            self.renderVerticalBarChart(data, '_id', 'sum', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Purchase Invoice'
                            });
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setFilters(data, ['center']);
                                self.setHref('EnrollMent/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('EnrollMent/list');
                            }
                        });
                    },

                    hcProfileOpp: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getLeadsByProfile(filter, true, '1524552625000', function (data) {
                            self.renderVerticalBarChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Purchase Invoice'
                            });
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setFilters(data, ['salesPerson']);
                                self.setHref('Opportunities/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('Opportunities/list');
                            }
                        });
                    },

                    hcProfileLeads: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getLeadsByProfile(filter, false, '1524552625000', function (data) {
                            self.renderVerticalBarChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Purchase Invoice'
                            });
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setCustomFilters(data, ['salesPerson'], ['salesPerson._id']);
                                self.setHref('VStudentLeads/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('VStudentLeads/list');
                            }
                        });
                    },

                    LeadsByEmployee: function () {

                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getLeadsByEmployee(filter, function (data) {
                            self.renderVerticalBarChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Purchase Invoice'
                            });
                        });

                        self.setHref('VStudentLeads/list');
                    },

                    hcReportLeads: function () {

                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getHcReport(filter, false, function (data) {
                            self.renderVerticalBarChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Purchase Invoice'
                            });
                        });

                        self.setHref('VStudentLeads/list');
                    },

                    hcReportOpp: function () {

                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getHcReport(filter, true, function (data) {
                            self.renderVerticalBarChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Purchase Invoice'
                            });
                        });

                        self.setHref('Opportunities/kanban');
                    },

                    scProfileOpp: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getLeadsByProfile(filter, true, '1524552351000', function (data) {
                            self.renderVerticalBarChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Purchase Invoice'
                            });
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setFilters(data, ['salesPerson']);
                                self.setHref('Opportunities/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('Opportunities/list');
                            }
                        });
                    },

                    scProfileLeads: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getLeadsByProfile(filter, false, '1524552351000', function (data) {
                            self.renderVerticalBarChart(data, '_id', 'count', {
                                xAxisLabel: 'Week',
                                yAxisLabel: 'Purchase Invoice'
                            });
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setCustomFilters(data, ['salesPerson'], ['salesPerson._id']);
                                self.setHref('VStudentLeads/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('VStudentLeads/list');
                            }
                        });
                    },
                },

                donut: {
                    revenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, true, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    revenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, true, function (data) {
                            self.renderDonutChart(data, 'count', '_id');
                        });

                        self.setHref('invoice');
                    },

                    studentFeeDetails: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getStudentFeeDetails(filter, function (data) {
                            self.renderDonutChart(data.data, 'sum', '_id');
                        });

                        self.setHref('VDashboardReports');
                    },

                    revenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, true, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, false, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, false, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, false, function (data) {
                            self.renderDonutChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    pendingOrdersByFranchise: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getOrdersByFranchise(filter, true, false, function (data) {
                            self.renderDonutChart(data, 'count', '_id');
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setFilters(data, ['center']);
                                self.setHref('order/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('order/list');
                            }
                        });
                    },
                },

                donutAnimated: {
                    revenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, true, function (data) {
                            self.renderDonutAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    revenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, true, function (data) {
                            self.renderDonutAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    revenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, true, function (data) {
                            self.renderDonutAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, false, function (data) {
                            self.renderDonutAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, false, function (data) {
                            self.renderDonutAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, false, function (data) {
                            self.renderDonutAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    }
                },

                pie: {
                    eventVisitForFM: function() {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getTaskByType(filter, 1524552941000, '5adecb1a35751f39a6210391', function (data) {
                            self.renderPieChart(data, 'count', '_id');
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setFilters(data, ['assignedTo']);
                                self.setHref('DealTasks/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('DealTasks/list');
                            }
                        });
                    },
                    houseEventForFM: function() {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getTaskByType(filter, 1524552941000, '5adecb1a35751f39a6210390', function (data) {
                            self.renderPieChart(data, 'count', '_id');
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setFilters(data, ['assignedTo']);
                                self.setHref('DealTasks/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('DealTasks/list');
                            }
                        });
                    },
                    schoolEventForFM: function() {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getTaskByType(filter, 1524552941000, '5adecb1a35751f39a621038f', function (data) {
                            self.renderPieChart(data, 'count', '_id');
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setFilters(data, ['assignedTo']);
                                self.setHref('DealTasks/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('DealTasks/list');
                            }
                        });
                    },
                    eventVisitForTM: function() {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getTaskByType(filter, 1524553113000, '5adecb1a35751f39a6210391', function (data) {
                            self.renderPieChart(data, 'count', '_id');
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setFilters(data, ['assignedTo']);
                                self.setHref('DealTasks/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('DealTasks/list');
                            }
                        });
                    },
                    houseEventForTM: function() {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getTaskByType(filter, 1524553113000, '5adecb1a35751f39a6210390', function (data) {
                            self.renderPieChart(data, 'count', '_id');
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setFilters(data, ['assignedTo']);
                                self.setHref('DealTasks/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('DealTasks/list');
                            }
                        });
                    },
                    schoolEventForTM: function() {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getTaskByType(filter, 1524553113000, '5adecb1a35751f39a621038f', function (data) {
                            self.renderPieChart(data, 'count', '_id');
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setFilters(data, ['assignedTo']);
                                self.setHref('DealTasks/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('DealTasks/list');
                            }
                        });

                    },
                    eventVisitForBDE: function() {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getTaskByType(filter, 1524552846000, '5adecb1a35751f39a6210391', function (data) {
                            self.renderPieChart(data, 'count', '_id');
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setFilters(data, ['assignedTo']);
                                self.setHref('DealTasks/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('DealTasks/list');
                            }
                        });
                    },
                    houseEventForBDE: function() {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getTaskByType(filter, 1524552846000, '5adecb1a35751f39a6210390', function (data) {
                            self.renderPieChart(data, 'count', '_id');
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setFilters(data, ['assignedTo']);
                                self.setHref('DealTasks/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('DealTasks/list');
                            }
                        });
                    },
                    schoolEventForBDE: function() {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getTaskByType(filter, 1524552846000, '5adecb1a35751f39a621038f', function (data) {
                            self.renderPieChart(data, 'count', '_id');
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setFilters(data, ['assignedTo']);
                                self.setHref('DealTasks/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('DealTasks/list');
                            }
                        });
                    },
                    allTasksByPerson: function() {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getAllTasksByPerson(filter, function (data) {
                            self.renderPieChart(data, 'count', '_id');
                            self.setHref('DealTasks/list');
                        });
                    },

                    houseVisitByPerson: function() {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getStagesByType(filter, '5adecb1a35751f39a6210390', function (data) {
                            self.renderPieChart(data, 'count', '_id');
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setFilters(data, ['taskType']);
                                self.setHref('DealTasks/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('DealTasks/list');
                            }
                        });
                    },

                    schoolEventByPerson: function() {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getStagesByType(filter, '5adecb1a35751f39a621038f', function (data) {
                            self.renderPieChart(data, 'count', '_id');
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setFilters(data, ['taskType']);
                                self.setHref('DealTasks/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('DealTasks/list');
                            }
                        });
                    },

                    eventShowByPerson: function() {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getStagesByType(filter, '5adecb1a35751f39a6210391', function (data) {
                            self.renderPieChart(data, 'count', '_id');
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setFilters(data, ['taskType']);
                                self.setHref('DealTasks/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('DealTasks/list');
                            }
                        });
                    },

                    revenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, true, function (data) {
                            self.renderPieChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    revenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, true, function (data) {
                            self.renderPieChart(data, 'sum', '_id');
                        });
                        self.setHref('invoice');
                    },

                    studentAttendance: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getStudentAttendanceDetails(filter, function (data) {
                            var stat = data.stat
                            var obj = []
                            for (var key in stat) {
                                if(key === 'leaveDays' || key === 'workingDays')
                                obj.push({_id: key, sum: stat[key]})
                            }
                            self.renderPieChart(obj, 'sum', '_id');
                        });

                        self.setHref('attendance');
                    },

                    employeeAttendance: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getEmployeeAttendanceDetails(filter, function (data) {
                            var stat = data.stat
                            var obj = []
                            for (var key in stat) {
                                if(key === 'leaveDays' || key === 'workingDays')
                                obj.push({_id: key, sum: stat[key]})
                            }
                            self.renderPieChart(obj, 'sum', '_id');
                        });

                        self.setHref('attendance');
                    },

                    ordersByFranchise: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getOrdersByFranchise(filter, false, false, function (data) {
                            self.renderPieChart(data, 'count', '_id');
                        });

                        self.setHref('VDashboardReports');
                    },

                    revenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, true, function (data) {
                            self.renderPieChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, false, function (data) {
                            self.renderPieChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, false, function (data) {
                            self.renderPieChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, false, function (data) {
                            self.renderPieChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    RegistrationsByFranchise: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRegisterations(filter, false, function (data) {
                            self.renderPieChart(data, 'count', '_id');
                            if(!Lodash.isEmpty(data)) {
                                var options = self.setFilters(data, ['center']);
                                self.setHref('EnrollMent/list/p=1/c=10000/filter=' + JSON.stringify(options));
                            } else {
                                self.setHref('EnrollMent/list');
                            }
                        });
                    },

                    LeadsByStages: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getLeadsByEmp(filter, false, '', function (data) {
                            self.renderPieChart(data, 'count', '_id');
                        });

                        self.setHref('VStudentLeads/list');
                    },

                    hcLeadsByStages: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getLeadsByEmp(filter, false, '1524552625000', function (data) {
                            self.renderPieChart(data, 'count', '_id');
                        });

                        self.setHref('VStudentLeads/list');
                    },

                    scLeadsByStages: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getLeadsByEmp(filter, false, '1524552351000', function (data) {
                            self.renderPieChart(data, 'count', '_id');
                        });

                        self.setHref('VStudentLeads/list');
                    },

                    scOppByStages: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getLeadsByEmp(filter, true, '1524552351000', function (data) {
                            self.renderPieChart(data, 'count', '_id');
                        });

                        self.setHref('Opportunities/kanban');
                    },

                    LeadsByEmployee: function () {

                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getLeadsByEmployee(filter, function (data) {
                            self.renderPieChart(data, 'count', '_id');
                        });

                        self.setHref('VDashboardReports');
                    },

                LeadsRevenue: function () {

                    var _opts = self.options;
                    var filter = {
                        date: {
                            value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                        }
                    };

                    common.getLeadsRevenueByCourse(filter, function (data) {
                        if(!Lodash.isEmpty(data)) {
                            self.renderPieChart(data, 'sum', '_id');
                            var options = self.setCustomFilters(data, ['name'], ['id']);
                            self.setHref('Opportunities/list/p=1/c=10000/filter=' + JSON.stringify(options));
                        } else {
                            self.setHref('Opportunities/list');
                        }
                    });
                },

                    hcOppByStages: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getLeadsByEmp(filter, true, '1524552625000', function (data) {
                            self.renderPieChart(data, 'count', '_id');
                        });

                        self.setHref('Opportunities/kanban');
                    },


                    OppByEmployee: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getLeadsByEmp(filter, true, '', function (data) {
                            self.renderPieChart(data, 'count', '_id');
                        });

                        self.setHref('Opportunities/kanban');
                    },

                    stockAvailableByFranchise: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getStocksAvailable(filter, false, function (data) {
                            self.renderPieChart(data, 'count', '_id');
                        });

                        self.setHref('Products');
                    },

                },

                pieAnimated: {
                    revenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, true, function (data) {
                            self.renderPieAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    revenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, true, function (data) {
                            self.renderPieAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    revenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, true, function (data) {
                            self.renderPieAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    getQuestionsBySubject: function () {
                            var _opts = self.options;
                            var filter = {
                                date: {
                                    value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                                }
                            };

                            common.getQuestionsBySubject(filter, true, function (data) {
                                self.renderPieAnimatedChart(data, 'count', '_id');
                            });

                            self.setHref('VQuestions');
                    },

                    getExamByMode: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getExamByMode(filter, true, function (data) {
                            self.renderPieAnimatedChart(data, 'count', '_id');
                        });

                        self.setHref('VQuestions');
                    },

                    purchaseRevenueBySales: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueBySales(filter, false, function (data) {
                            self.renderPieAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCountry: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCountry(filter, false, function (data) {
                            self.renderPieAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseRevenueByCustomer: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueByCustomer(filter, false, function (data) {
                            self.renderPieAnimatedChart(data, 'sum', '_id');
                        });

                        self.setHref('invoice');
                    },

                    stockAvailableByFranchise: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getStocksAvailable(filter, false, function (data) {
                            self.renderPieAnimatedChart(data, 'count', '_id');
                        });

                        self.setHref('Products');
                    },
                },

                singleValue: {
                    totalPurchaseRevenue: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueForSingle(filter, false, function (data) {
                            self.renderSingleValue(data, 'Purchase Revenue');
                        });

                        self.setHref('purchaseInvoices');
                    },

                    totalSalesRevenue: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getRevenueForSingle(filter, true, function (data) {
                            self.renderSingleValue(data, 'Sales Revenue');
                        });

                        self.setHref('invoice');
                    },

                    totalSalesOrders: function (){
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getTotalOrdersForSingle(filter, true, function (data) {
                            self.renderSingleValue(data, 'Sales Orders');
                        });

                        self.setHref('order');
                    },

                    totalPurchaseOrder: function (){
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getTotalOrdersForSingle(filter, false, function (data) {
                            self.renderSingleValue(data, 'Sales Orders');
                        });

                        self.setHref('purchaseOrders');
                    },

                    totalReceivedOrders: function (){
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getByStatusForSingle(filter, false, true, function (data) {
                            self.renderSingleValue(data, 'Received Orders');
                        });

                        self.setHref('purchaseOrders');
                    },

                    totalPartialReceivedOrders: function (){
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getByStatusForSingle(filter, false, false, function (data) {
                            self.renderSingleValue(data, 'Partial Received Orders');
                        });

                        self.setHref('purchaseOrders');
                    },

                    totalDeliveredPurchaseOrders: function (){
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getByStatusForSingle(filter, true, true, function (data) {
                            self.renderSingleValue(data, 'Delivered Orders');
                        });

                        self.setHref('order');
                    },

                    totalPartialDeliveredPurchasedOrders: function (){
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getByStatusForSingle(filter, true, false, function (data) {
                            self.renderSingleValue(data, 'Partial Delivered Orders');
                        });

                        self.setHref('order');
                    }
                },

                horizontalBarLayout: {
                    leadsBySource: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getLeadsForChart('source', filter, function (data) {
                            var sources = _.uniq(_.pluck(data, 'source'));
                            var newData = [];
                            var j;
                            var i;

                            // for (i = sources.length; i--;) {
                            //     newData.push({
                            //         source: sources[i],
                            //         total : 0,
                            //         isOpp : 0
                            //     });
                            // }

                            // for (i = data.length; i--;) {
                            //
                            //     for (j = newData.length; j--;) {
                            //
                            //         if (newData[j].source === data[i].source) {
                            //
                            //             if (data[i].isOpp) {
                            //                 newData[j].isOpp += data[i].count;
                            //             } else {
                            //                 newData[j].total += data[i].count;
                            //             }
                            //         }
                            //     }
                            // }

                            self.renderHorizontalBarLayout(data, ['isOpp', 'count'], {
                                xAxisLabel: '',
                                yAxisLabel: 'Source'
                            });
                        });

                        self.setHref('Leads');
                    }
                },

                verticalBarLayout: {},

                overview: {
                    totalPurchaseRevenue: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getInvoiceByWorkflows(filter, false, function (data) {
                            self.renderTableOverview(data, '_id');
                        });

                        self.setHref('purchaseInvoices');
                    },

                    totalSalesRevenue: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getInvoiceByWorkflows(filter, true, function (data) {
                            self.renderTableOverview(data, '_id');
                        });

                        self.setHref('invoice');
                    },

                    studentCourseDetails: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.studentCourseDetails(filter, true, function (data) {
                            self.studentCourseDetails(data, '_id');
                        });

                        self.setHref('invoice');
                    },

                    employeeCourseDetails: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.employeeCourseDetails(filter, true, function (data) {
                            self.employeeCourseDetails(data, '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseOrders: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getOrdersByWorkflows(filter, false, function (data) {
                            self.renderTableOverview(data, '_id');
                        });

                        self.setHref('purchaseOrders');
                    },

                    orders: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getOrdersByWorkflows(filter, true, function (data) {
                            self.renderTableOverview(data, '_id');
                        });

                        self.setHref('order');
                    }

                },

                table: {
                    totalPurchaseRevenue: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getInvoices(filter, false, function (data) {
                            self.renderTable(data, '_id');
                        });

                        self.setHref('purchaseInvoices');
                    },

                    getQuestionByTopic: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getQuestionByTopic(filter, false, function (data) {
                            self.topicWiseTable(data, '_id');
                        });

                        self.setHref('VQuestions');
                    },

                    getStudentsByExam: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.geStudentByExam(filter, true, function (data) {
                            self.examWiseStudentsTable(data, '_id');
                        });

                        self.setHref('VQuestions');
                    },

                    getStudentsByOFFExam: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.geStudentByExam(filter, false, function (data) {
                            self.examWiseStudentsTable(data, '_id');
                        });

                        self.setHref('VQuestions');
                    },

                    totalSalesRevenue: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getInvoices(filter, true, function (data) {
                            self.renderTable(data, '_id');
                        });

                        self.setHref('invoice');
                    },

                    pastDuePurchaseInvoices: function () {
                        var _opts = self.options;
                        var filter = {
                            date   : {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            },
                            pastDue: true
                        };

                        common.getInvoices(filter, false, function (data) {
                            self.renderTable(data, '_id');
                        });

                        self.setHref('purchaseInvoices');
                    },

                    pastDueInvoices: function () {
                        var _opts = self.options;
                        var filter = {
                            date   : {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            },
                            pastDue: true
                        };

                        common.getInvoices(filter, true, function (data) {
                            self.renderTable(data, '_id');
                        });

                        self.setHref('invoice');
                    },

                    purchaseOrders: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getOrders(filter, false, function (data) {
                            self.renderTable(data, '_id');
                        });

                        self.setHref('purchaseOrders');
                    },

                    orders: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getOrders(filter, true, function (data) {
                            self.renderTable(data, '_id');
                        });

                        self.setHref('order');
                    },

                    renderCourseTable: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getCoursesByFranchise(filter, true, function (data) {
                            self.renderCourseTables(data, '_id');
                        });

                        self.setHref('VDashboardReports');
                    },

                    studentTodayTopics: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.studentTodayTopics(filter, function (data) {
                            self.studentTodayTopicsDetails(data, '_id');
                        });

                        self.setHref('VBatches');
                    },

                    studentAssessment: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.studentAssessmentDetails(filter, function (data) {
                            self.studentAssessmentDetails(data, '_id');
                        });

                        self.setHref('order');
                    },

                    employeeAssessment: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.employeeAssessmentDetails(filter, function (data) {
                            self.studentAssessmentDetails(data, '_id');
                        });

                        self.setHref('order');
                    },
                    studentHomework: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getCoursesByFranchise(filter, true, function (data) {
                            self.studentHomeworkDetails(data, '_id');
                        });

                        self.setHref('order');
                    },

                    studentNotification: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getStudentNotifications(filter, function (data) {
                            self.studentNotificationDetails(data, '_id');
                        });

                        self.setHref('order');
                    },

                    employeeNotification: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getEmployeeNotifications(filter, function (data) {
                            self.studentNotificationDetails(data, '_id');
                        });

                        self.setHref('order');
                    },

                    employeeTopics: function () {
                        var _opts = self.options;
                        var filter = {
                            date: {
                                value: [new Date(_opts.startDate), new Date(_opts.endDate)]
                            }
                        };

                        common.getEmployeeTopics(filter, function (data) {
                            self.studentTodayTopicsDetails(data, '_id');
                        });

                        self.setHref('order');
                    },

                    topStudents: function () {
                        var _opts = self.options;
                        common.getTopStudents([], function (data) {
                            self.showTopStudents(data, '_id');
                        });

                        self.setHref('order');
                    },
                },


            };
            chartObj[this.options.type][this.options.dataSelect]();
        }
    });

    return View;
});
