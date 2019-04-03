define([
    'jQuery',
    'Underscore',
    'views/topBarViewBase',
    'views/Filter/dateFilter',
    'text!templates/VStudentLeads/TopBarTemplate.html',
    'views/selectView/selectView',
    'vconstants',
    'dataService',
    'views/VStudentLeads/AssignView',
    'text!templates/VStudentLeads/LeadsLogs.html',
    'common',
    'custom',
    'moment'
], function ($, _, TopBarBase, DateFilterView, ContentTopBarTemplate, SelectView, CONSTANTS, dataService, assignView, leadsLogs, common, Custom, moment) {
    var TopBarView = TopBarBase.extend({
        el         : '#top-bar',
        contentType: 'VStudentLeads',
        contentHeader: 'Leads',
        template   : _.template(ContentTopBarTemplate),
        logsTemplate: _.template(leadsLogs),
        count: 0,

        events: {
            'click #uploadBtn'   : 'clickInput',
            'click #bulkBtn'     : 'clickBulkInput',
            'click #upload'      : 'upload',
            'click a#errLogBtn'   : 'renderLogs',
            'click .current-selected:not(.jobs)'                                      : 'showNewSelect',

        },

        clickInput: function () {
            var self = this;
            var formString = "<form id =  'uploadForm' enctype   =  'multipart/form-data' action='/leads/bulk' method    =  'post'><input style='margin-top: 25px;padding: 10px;' type='file' name='file' /></form>"
            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Edit Company',
                width      : '500',
                buttons    : [
                    {
                        text : 'Upload',
                        class: 'btn blue',
                        click: function (event) {
                            self.upload(event)
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
        },

        clickBulkInput: function () {
            new assignView({
            }).render();
        },

        upload: function (event) {
            var self = this;
            var $el = $(event.target);
            var addFrmAttach = $el.offsetParent().find('#uploadForm')
            var addInptAttach = [];
            var url = '/erp/VStudentLeads';
            addInptAttach = $el.offsetParent().find('#uploadForm').find('input').eq(0)[0].files[0]
            addFrmAttach.ajaxSubmit({
                url        : '/leads/bulk/',
                type       : 'POST',
                processData: false,
                contentType: false,
                data       : [addInptAttach],


                uploadProgress: function (event, position, total, statusComplete) {
                    var statusVal = statusComplete + '%';
                },

                success: function (data) {
                    if(!_.isEmpty(data.data)) {
                        self.renderErrorLogs(data, true);
                    } else {
                        self.hideDialog();
                        Backbone.history.navigate(url, {trigger: true});
                    }
                },

                error: function (xhr) {
                    /* $('.attachContainer').empty();
                     $('.bar .status').empty();
                     if (self) {
                     self.errorNotification(xhr);
                     }*/
                    self.hideDialog();
                    Backbone.history.navigate(url, {trigger: true});
                }
            });
        },

        renderErrorLogs: function (data, isHide) {
            var url = '/erp/VStudentLeads';
            var self = this;
            if(!_.isEmpty(data)) {
                var formString = self.logsTemplate({
                        result: data.data,
                        total: data.total,
                        isHide: isHide
                    }
                );
                common.datatableInitWithoutExport('example');
                self.$el = $(formString).dialog({
                    autoOpen: true,
                    dialogClass: 'edit-dialog',
                    title: 'Error Logs',
                    width: '1000px',
                    /*top: "150px",*/
                    buttons: [{
                        text: 'Close',
                        class: 'btn',
                        click: function () {
                            self.closeDialogWindow(url);
                        }
                    }]
                })
            }
        },


        renderLogs: function(e) {
            e.preventDefault();
            var self  = this;
            dataService.getData(CONSTANTS.URLS.LEADS + 'logs', {}, function(data){
                if(data.data)
                    self.hideDialog();
                self.renderErrorLogs(data, false)
            })
        },

        closeDialogWindow: function(url) {
            this.hideDialog();
            Backbone.history.navigate(url, {trigger: true});
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
            $('.add-group-dialog').remove();
            $('.add-user-dialog').remove();
            $('.crop-images-dialog').remove();
            $('.edit-invoice-dialog').remove();
            $('.edit-companies-dialog').remove();
            $('.create-dialog').remove();
            $('.open-view-dialog').remove();
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

        render: function () {
            var self = this;
            var viewType = Custom.getCurrentVT();
            var filter = Custom.retriveFromCash('VStudentLeads.filter');
            var dateRange;
            var startDate;
            var endDate;
            if (!this.collection) {
                dateRange = filter && filter.date ? filter.date.value : [];

                startDate = new Date(dateRange[0]);
                endDate = new Date(dateRange[1]);
            } else {
                startDate = self.collection.startDate;
                endDate = self.collection.endDate;
            }

            startDate = moment(startDate).format('D MMM, YYYY');
            endDate = moment(endDate).format('D MMM, YYYY');

            $('title').text(this.contentHeader || this.contentType);
            if(this.count == 0) {
                dataService.getData('/permission', {moduleId: CONSTANTS.MID[this.contentType]}, function (data) {
                        self.$el.html(self.template({
                            viewType: viewType,
                            data:  data.data,
                            contentType: self.contentType
                        }));
                            self.dateFilterView = new DateFilterView({
                                contentType: 'VStudentLeads',
                                el         : self.$el.find('#dateFilter')
                            });
                    self.dateFilterView.on('dateChecked', function () {
                        self.trigger('changeDateRange', self.dateFilterView.dateArray);
                    });

                    Custom.cacheToApp('VStudentLeads.filter', self.filter);

                    self.dateFilterView.checkElement('custom', [startDate, endDate]);


                });
            }






            return this;
        },

    });

    return TopBarView;
});
