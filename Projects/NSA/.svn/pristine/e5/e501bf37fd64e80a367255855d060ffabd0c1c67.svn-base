define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VCSTManagement/cvmDetails/subjecttopics/CreateTemplate.html',
    'text!templates/VCSTManagement/cvmDetails/subjecttopics/MultiTopics.html',
    'text!templates/VCSTManagement/cvmDetails/subjecttopics/MultiTopic.html',
    'models/VSubjectTopicModel',
    'populate',
    'vconstants',
    'helpers/keyValidator',
    'helpers',
    'dataService',
    'services/examSchedule',
    'Lodash'
], function (Backbone, $, _, Parent, template, MultiTopics, MultiTopic, Model, populate, CONSTANTS, keyValidator, helpers, dataService, examScheduleService, lodash) {
    'use strict';

    var EditView = Parent.extend({
        template   : _.template(template),
        contentType: 'shippingMethods',

        initialize : function (options) {
            options = options || {};

            _.bindAll(this, 'render', 'saveItem');

            this.currentModel = new Model();

            this.collection = options.collection;

            this.responseObj = {};

            this.render();
        },

        events: {
            'click .addNewTopic span': 'addNewTopic',
            'click .addProductItem span': 'getProducts',
            'click .removeJob'       : 'deleteRow',
            'keypress #price': 'keypressHandler'
        },

        addNewTopic: function (e) {
            this.$el.find('#addvalue').prepend("<input type='text'>");
        },

        getProducts: function (e) {
            this.$el.find('#productList').append(_.template(MultiTopic, {elem: {}}));
        },

        keypressHandler: function (e) {
            return keyValidator(e, true);
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var $target = $(e.target);
            var $thisEl = this.$el;
            var id = target.attr('id');
            e.preventDefault();
            $('.newSelectList').hide();
            target.closest('.current-selected').text(target.text()).attr('data-id', target.attr('id'));
            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

            var titleID = $thisEl.find('#title').attr('data-id')

            if( id == titleID ){
                this.selectSubject(titleID)
            }

            return false;
        },

        resetClasses: function(){
            this.responseObj['#Class_st'] = [];
            this.responseObj['#subject'] = [];
            this.$el.find('#subject').text('Select Subject');
            this.$el.find('#Class_st').text('Select Class');
        },

        showClasses: function(classes){
            var self = this;
            self.responseObj['#Class_st'] = classes
        },

        selectSubject: function(titleid){
            var self = this;
            var subjects = [];
            var classes = [];
            self.resetClasses();
            dataService.getData('/title/'+ titleid, {}, function (titles) {
                self.titles = titles.data;
                if(self.titles) {

                    subjects = lodash.map( lodash.filter(JSON.parse(JSON.stringify(self.titles)), function(o){ return o.subject != null}), function (subject) {
                        if(subject.subject) {
                            subject._id = subject.subject._id;
                            subject.name = subject.subject.subjectName;
                            return subject;
                        }

                    });
                    classes = lodash.map(JSON.parse(JSON.stringify(self.titles)), function (classObj) {
                        classObj._id = classObj.classDetail._id;
                        classObj.name = classObj.classDetail.className;
                        return classObj;
                    });
                    self.responseObj['#subject'] = lodash.uniqBy(subjects, '_id')
                    self.showClasses(lodash.uniqBy(classes, '_id'))
                }

            })

        },

        saveItem: function () {
            var thisEl = this.$el;
            var self = this;
            //var name = $.trim(thisEl.find('#name').val());
            var price = $.trim(thisEl.find('#price').val());
            var title = thisEl.find('#title').attr('data-id');
            var subject = thisEl.find('#subject').attr('data-id');
            var classDetail = thisEl.find('#Class_st').attr('data-id');
            var products = [];
            var selectedProducts = this.$el.find('.productItem');
            var saveObject;
            var selectedLength = selectedProducts.length;
            var targetEl;
            var productId;
            var adjusted;
            var cost;
            var onHand;
            var productAvailable;
            var i;

            if(!title) {
                return App.render({
                    type: 'error',
                    message: 'please Select title'
                })
            }

            if(!subject) {
                return App.render({
                    type: 'error',
                    message: 'please Select Subject'
                })
            }

            if(!classDetail) {
                return App.render({
                    type: 'error',
                    message: 'please Select Class'
                })
            }

            if (!selectedProducts.length) {
                return App.render({
                    type: 'error',
                    message: "Add One or more Topic Name. Topic Name should't be empty."
                });
            }

            for (i = selectedLength - 1; i >= 0; i--) {
                targetEl = $(selectedProducts[i]);
                productId = $.trim(targetEl.find('.name').val());
                if (productId == '') {
                    return App.render({
                        type: 'error',
                        message: "Topic Name Should should't be empty."
                    });
                }
                productAvailable = targetEl.attr('id');
                products.push({
                    name: productId
                });
            }

            var product =[];
            products.forEach( function(item){
                if(item.name){
                    product.push(item);
                }
            })
            var data = {};

            data.topics = product;
            data.title = title;
            data.subject = subject;
            data.classDetail   = classDetail ;

            dataService.postData('/vSubject/topics', data, function (err, result) {
                if(err) {
                    self.errorNotification(err);
                } else {
                    self.hideDialog();
                    self.collection.add(result);
                }
            })
            return App.render({
                type: 'notify',
                message:CONSTANTS.RESPONSES.CREATE_SUCCESS
            });
        },

        deleteRow: function (e) {
            var target = $(e.target);
            var tr = target.closest('div.productItem');
            e.stopPropagation();
            e.preventDefault();

            tr.remove();
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        hideSelect: function(e) {
            $('.newSelectList').hide();
        },

        render: function () {
            var self = this;
            var formString;

            formString = this.template({
                model           : this.currentModel.toJSON(),
                currencySplitter: helpers.currencySplitter
            });
            this.$el.find('#test').prepend("test value");

            this.$el = $(formString).dialog({
                autoOpen   : true,
                dialogClass: 'edit-dialog',
                title      : 'Create Topic',
                width      : '600px',
                buttons    : [{
                    text : 'Save',
                    class: 'btn blue',
                    click: function () {
                        self.saveItem();
                    }
                }, {
                    text : 'Cancel',
                    class: 'btn',
                    click: function () {
                        self.hideDialog();
                    }
                }]

            });
            dataService.getData('/title/schoolTitle', {}, function (titles) {
                titles = _.map(titles.data, function (title) {
                    title.name = title.titleName;
                    return title;
                });
                self.responseObj['#title'] = titles;
            });

            this.delegateEvents(this.events);

            this.$el.find('#productItemsHolder').html(_.template(MultiTopics));

            return this;
        }
    });

    return EditView;
});
