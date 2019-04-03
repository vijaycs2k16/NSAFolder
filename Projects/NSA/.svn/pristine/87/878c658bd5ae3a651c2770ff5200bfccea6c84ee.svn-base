define([
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'views/selectView/selectView',
    'text!templates/EnrollMent/list/cancelEdit.html',
    'text!templates/EnrollMent/list/ListHeader.html',
    'text!templates/EnrollMent/list/ListTemplate.html',
    'views/EnrollMent/list/ListItemView',
    'views/EnrollMent/CreateView',
    'views/EnrollMent/Registration/EditView',
    'models/EnrollMentModel',
    'collections/EnrollMent/filterCollection',
    'collections/EnrollMent/editCollection',
    'dataService',
    'async',
    'Backbone',
    'common',
    'vconstants',
    'Lodash',
    'text!templates/EnrollMent/ConfirmationTemplate.html'
], function ($, _, listViewBase, SelectView, cancelEdit, listHeaderTemplate, listTemplate, ListItemView, CreateView, EditView, CurrentModel, contentCollection, EditCollection, dataService, async, Backbone, common, CONSTANTS, Lodash, Confirmation) {
    'use strict';

    var ListView = listViewBase.extend({
        listTemplate     : listTemplate,
        CurrentModel     : CurrentModel,
        editCollection   : EditCollection,
        contentCollection: contentCollection,
        contentType      : 'EnrollMent',
        cancelEdit       : cancelEdit,
        ConfirmationTemplate: _.template(Confirmation),

        initialize: function (options) {
            this.startTime = options.startTime;
            this.collection = options.collection;
            _.bind(this.collection.showMoreAlphabet, this.collection);
            this.allAlphabeticArray = common.buildAllAphabeticArray(this.contentType);
            this.filter = options.filter;

            this.contentCollection = contentCollection;
            this.defaultItemsNumber = this.collection.namberToShow || 100;
            this.page = options.collection.currentPage;
            listViewBase.prototype.initialize.call(this, options);
        },

        events: {
            'click a.goToRemove'  : 'wholeDelete',
            'click a.goToEdit'  : 'gotoForm',
            'change #stages' : 'changeStages',
            'click .approve' : 'changeApproveStatus',
            'click .shipped' : 'renderConfirmBox',
            'click .return-product' : 'returnProduct'
        },

        wholeDelete: function(e) {
            var self = this;
            var row = $(e.target).closest('tr');
            var id = row.data('id');
            var currentRow = this.collection.toJSON() ?  Lodash.filter(self.collection.toJSON(), {_id: id}) : [];
            if(!_.isEmpty(currentRow)) {
                var order = currentRow[0].order;
                var shippingStatus = (order && order.status) ? order.status.shippingStatus : 'NOT';
                var filterGoodsObj = currentRow[0].goodsNote ? currentRow[0].goodsNote.filter(function(obj){ return obj._type === 'stockReturns' }) : [];
                if(shippingStatus === 'ALL' && _.isEmpty(filterGoodsObj)) {
                    if(confirm('Are you sure want to delete registration with Shipped Product ?')) {
                        self.returnProduct(e, true);
                        self.deleteRow(e, true);
                    } else {
                        return false;
                    }
                } else {
                    self.deleteRow(e, false);
                }
            } else {
                return false;
            }
        },

        returnProduct: function(e, cond) {
            var self = this;
            var row = $(e.target).closest('tr');
            var id = row.data('id');
            var currentRow = this.collection.toJSON() ?  Lodash.filter(self.collection.toJSON(), {_id: id}) : [];
            if(!Lodash.isEmpty(currentRow)) {
                var body = {}, orderData = [], pullGoodsOutNote = {};
                body.description = '';
                body.releaseDate = new Date();
                if(currentRow[0].order){
                    body.order = currentRow[0].order._id;
                    if(currentRow[0].goodsNote) {
                        var filterGoodsObj = currentRow[0].goodsNote ? currentRow[0].goodsNote.filter(function(obj){ return obj._type === 'GoodsOutNote' }) : [];
                        if(!_.isEmpty(filterGoodsObj)) {
                            body.journalEntrySources = filterGoodsObj[0].journalEntrySources;
                            var goodsId = filterGoodsObj[0]._id;
                            pullGoodsOutNote[goodsId] = true;
                            body.pullGoodsOutNotes = pullGoodsOutNote;
                            if(currentRow[0].orderRows) {
                                var bookData = currentRow[0].orderRows ? currentRow[0].orderRows.filter(function (o) { return o.product === currentRow[0].course.product }) : [];
                                if(!_.isEmpty(bookData)) {
                                    orderData.push({
                                        goodsOutNote: filterGoodsObj[0]._id,
                                        orderRowId: bookData[0]._id,
                                        product: bookData[0].product,
                                        quantity: bookData[0].quantity,
                                        warehouse: bookData[0].warehouse
                                    });
                                    body.orderRows = orderData;
                                    var option = cond ? cond : confirm('Are you sure want to return the product ?');
                                    if(option) {
                                        dataService.postData('/goodsInNotes/return', body, function (err, resp) {
                                            if(err) {
                                                return App.render({
                                                    type: 'error',
                                                    message: 'Something went Wrong'
                                                })
                                            } else {
                                                return App.render({
                                                    type: 'notify',
                                                    message: 'Returned Successfully'
                                                })
                                            }
                                        });
                                    } else {
                                        return false;
                                    }
                                } else {
                                    return false;
                                }
                            } else {
                                return false;
                            }
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
            self.refreshPage();
        },

        checked : function(e) {
            var checked = $(e.target).prop('checked');
            if(checked){
                $('#top-bar-deleteBtn').show();
                $('#top-bar-Register').hide();
            }else {
                $('#top-bar-deleteBtn').hide();
                $('#top-bar-Register').show()
            }
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        renderProducts: function (data, e) {
            var checked = $(e.target).prop('checked');
            var $checkedInputs;
            var $thisEl = this.$el;
            var $table = $thisEl.find('#currencyTable');
            $checkedInputs = $table.find('input:checked');
            var self = this;
            var row = $(e.target).closest('tr');
            var ids = row.data('id');
            var dataArr = Lodash.filter(self.collection.toJSON(), {_id: ids});
            _.forEach(dataArr[0].orderRows, function (val, index) {
                    _.forEach(dataArr[0].goodsNote, function (value, ins) {
                        var shipObj = Lodash.filter(value.orderRows, {product: val.product});
                        if(shipObj.length > 0 ){
                            val.status = value.status;
                        }
                    })

            });

            if(!Lodash.isEmpty(data)) {
                var formString = self.ConfirmationTemplate({
                        result    : data.data[0],
                        orderRows : dataArr[0].orderRows,
                        lodash    : Lodash
                    }
                );
                if ($(".edit-dialog").hasClass('ui-widget-content')) {
                    $('.edit-dialog').remove()
                }

                common.datatableInitWithoutExport('example5');
                self.$el = $(formString).dialog({
                    autoOpen: true,
                    dialogClass: 'edit-dialog',
                    title: 'Conformation',
                    width: '700px',
                    /*top: "150px",*/
                    buttons    : [{
                        text : 'Save',
                        class: 'btn blue',
                        click: function () {
                            self.changeShippedStatus(e);
                        }
                    }, {
                        text : 'Close',
                        class: 'btn',
                        click: function () {
                            self.hideDialog();
                        }
                    }]
                })
            }
        },

        renderConfirmBox: function(e) {
            e.preventDefault();
            var self  = this;
            var tr = $(e.target).closest('tr');
            var id = tr.attr('data-id');
            var model = this.collection.get(id);
            var cid = model.toJSON().course._id;
            dataService.getData(CONSTANTS.URLS.VCOURSE + '/getForDd', {_id: cid}, function(data){
                if(data)
                    self.renderProducts(data, e)
            })
        },

        changeShippedStatus: function (e) {
            var self = this;
            var $thisEl = this.$el;
            var $table = $thisEl.find('#currencyTable');
            var $checkedInputs;
            var id = [];
            $checkedInputs = $table.find('input:checked');
            var row = $(e.target).closest('tr');
            var ids = row.data('id');
            var val = row.data('value');
            var status = row.data('status');
            var ispaid = row.data('ispaid');
            var data = {};

            if(ids) {
                if(confirm('Are you sure want to mark as shipped ?')){
                    var obj = {
                        status: status,
                        id: ids,
                        regId: val
                    };
                    if(ispaid === 0 && status){
                        obj.status = false;
                    }
                    var dataArr = Lodash.filter(self.collection.toJSON(), {_id: ids});
                    var orderRows = [];
                    if(dataArr) {
                        $.each($checkedInputs, function () {
                            var $el = $(this);
                            var dataProd = Lodash.filter(dataArr[0].orderRows, {product: $el.val()});
                            orderRows.push({"orderRowId": dataProd[0]._id, "quantity": dataProd[0].quantity, "product": dataProd[0].product})
                        });
                        data.orderRows = orderRows;
                        data.order = dataArr[0].order._id;
                        data.name = dataArr[0].order.name;
                        data.checked = $checkedInputs;
                        var warehouse = {};
                        warehouse._id = dataArr[0].warehouse ? dataArr[0].warehouse._id : null;
                        warehouse.name = dataArr[0].warehouse ? dataArr[0].warehouse.name : null;
                        data.warehouse = warehouse;
                        data['status.shipped'] = true;
                        data.shippingMethod = null;
                        data.shippingCost = 0;
                    }
                    dataService.postData('goodsOutNotes/', data, function (err, res) {
                        if(err) {
                            self.errorNotification(err);
                        } else {
                            return App.render({
                                type   : 'notify',
                                message: 'Updated Successfully'
                            });

                        }
                    });
                } else {
                    return false;
                }
                self.refreshPage();
            }
        },

        refreshPage: function() {

            Backbone.history.fragment = '';
            Backbone.history.navigate(window.location.hash, {trigger: true});
        },

        changeStages: function (e) {
            var $thisEl = this.$el;
            var $target = $thisEl.find(e.target);
            var studentId = $(e.target).closest('tr').data('stud');
            var selectedStatus = $target.find('option:selected').data('value');
            var selectedVal = $target.val();
            var self = this;
            var obj = {
                stage: {
                    id: selectedStatus,
                    value: selectedVal
                }
            };
            if(confirm('Are you sure want to change the status ?')) {
                dataService.patchData('/vregister/stage/' + studentId, obj, function (err) {
                    if (err) {
                        self.errorNotification(err);
                    } else {
                        return App.render({
                            type: 'notify',
                            message: 'Updated Successfully'
                        })
                    }
                });
            } else {
                self.refreshPage();
                return false;
            }
            self.refreshPage();
        },

        changeApproveStatus: function (e) {
            var selectedVal = $(e.target).data('value');
            var studentId = $(e.target).closest('tr').data('stud');
            var self = this;
            var obj = {
                approveStatus: selectedVal
            };

            if(confirm('Are you sure want to approve the Student ?')) {
                dataService.putData('/vregister/approve/' + studentId, obj, function (err) {
                    if (err) {
                        self.errorNotification(err);
                    } else {
                        return App.render({
                            type: 'notify',
                            message: 'Updated Successfully'
                        })
                    }
                });
            } else {
                self.refreshPage();
                return false;
            }
            self.refreshPage();
        },


        gotoForm: function (e) {
            var id = $(e.target).closest('tr').data('id');
            if(id) {
                var url = '/erp/registrationForm/' + id;
                Backbone.history.navigate(url, {trigger: true});
            }
        },

        deleteRow: function(e, cond) {
            var row = $(e.target).closest('tr');
            var id = row.data('id');
            var val = row.data('value');
            var status = row.data('status');
            var ispaid = row.data('ispaid');
            var self = this;
            var studentId = row.data('stud');
            if(id) {
                var option = cond ? cond : confirm('Are you want to delete the User ?');
                if(option){
                    var obj = {
                        status: status,
                        id: id,
                        regId: val,
                        studentId: studentId
                    };
                    if(ispaid === 0 && status){
                        obj.status = false;
                    }
                    dataService.deleteData('vregister/', obj, function (err, res) {
                        if(err) {
                            self.errorNotification(err);
                        } else {
                            return App.render({
                                type   : 'notify',
                                message: 'Deleted Successfully'
                            });
                        }
                    });
                } else {
                    return false;
                }
            }
            self.refreshPage();
        },

        changeDateRange: function (dateArray) {
            var itemsNumber = $('#itemsNumber').text();
            var searchObject;

            if (!this.filter) {
                this.filter = {};
            }

            this.filter.date = {
                value: dateArray
            };

            searchObject = {
                page  : 1,
                count  : 10000,
                filter: this.filter
            };

            this.collection.getFirstPage(searchObject);

            this.changeLocationHash(1, itemsNumber, this.filter);

            App.filtersObject.filter = this.filter;

            //custom.cacheToApp('journalEntry.filter', this.filter);
        },

        render: function () {
            var $currentEl;
            var itemView;
            var self = this;
            var stages = CONSTANTS.STAGES_TYPE;
            $('.ui-dialog ').remove();
            $('#top-bar-deleteBtn').hide();
            $currentEl = this.$el;
            $currentEl.html(_.template(listTemplate, {
                collection      : this.collection.toJSON(),
                stages          : stages,
                Lodash          : Lodash
            }));
            common.datatableInit('report')
        }

    });

    return ListView;
});