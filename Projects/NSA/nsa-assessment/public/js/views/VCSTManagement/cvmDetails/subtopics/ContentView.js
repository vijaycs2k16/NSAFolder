define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/listViewBase',
    'text!templates/VCSTManagement/cvmDetails/subtopics/list/ListTemplate.html',
    'views/VCSTManagement/cvmDetails/subtopics/list/ListItemView',
    'collections/RelatedStatuses/RelatedStatusesCollection',
    'custom',
    'models/VSubTopicModel',
    'vconstants',
    'helpers/ga',
    'constants/googleAnalytics',
    'collections/VSubTopics/filterCollection',
    'dataService',
    'views/selectView/selectView',
    'Lodash'
], function (Backbone, $, _, listViewBase, ListTemplate, ListItemView, RelatedStatusesCollection, Custom, VSubTopicModel, CONSTANTS, ga, GA, subTopicCollection, dataService, SelectView, lodash) {
    'use strict';

    var ContentView = Backbone.View.extend({
        el        : '#subtopicsTab',
        initialize: function (options) {
            this.startTime = options.startTime;
            _.bindAll(this, 'saveStatus', 'render');
            this.relatedStatusesCollection = new RelatedStatusesCollection();
            this.relatedStatusesCollection.bind('reset', _.bind(this.render, this));
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.subTopicCollection = new subTopicCollection();
            this.responseObj  = {}

            //  this.render();
        },

        events: {
            'click .checkbox'                           : 'checked',
            'click .workflow-sub'                       : 'chooseWorkflowDetailes',
            'click .workflow-list li'                   : 'chooseWorkflowDetailes',
            'click  .edit'                              : 'edit',
            'click  .delete'                            : 'deleteItems',
            'click #addNewStatus'                       : 'addNewStatus',
            'click a.cancel'                            : 'cancel',
            'click a.save'                              : 'save',
            'click #saveStatus'                         : 'saveStatus',
            'click #cancelStatus'                       : 'cancelStatus',
            'mouseenter #workflows .row:not(.quickEdit)': 'quickEdit',
            'mouseleave .workflow-sub-list li'          : 'removeEdit',
            'click .newSelectList li:not(.miniStylePagination)': 'chooseOption',
            'click .current-selected'                       : 'showNewSelect',
        },

        save: function (e) {
            var self = this;
            var $thisEl = this.$el;
            var mid = 39;
            var $tr = $(e.target).closest('div.row');
            var name = $tr.find('div.name input').val().trim();
            var status = $tr.find('div.status option:selected').text();
            var $tdName = $tr.find('div.name');
            var id = $tdName.data('id');
            var _id = $tdName.attr('id');
            var sequence = $tdName.data('sequence');
            var model = this.collection.get(id);

            var obj = {
                id: _id,
                _id: id,
                name    : name,
                modifier  : 'add'
            };

            e.preventDefault();

            $thisEl.find('#addNewStatus').show();
            this.collection.url = CONSTANTS.URLS.VSUBTOPIC;

            dataService.postData(CONSTANTS.URLS.VSUBTOPIC, obj,function (err, response) {
                    var $targetParent = $(e.target).parent();

                    $targetParent.siblings().find('span.name').text(obj.name);
                    $targetParent.siblings().find('span').removeClass('hidden').end()
                    .find('input, select, a:contains("Cancel"), a:contains("Save")').remove();
                    $targetParent.find('.edit').removeClass('hidden').end().find('a:contains("Cancel"), a:contains("Save")').remove();
                    $targetParent.find('.delete').removeClass('hidden').end().find('a:contains("Cancel"), a:contains("Save")').remove();
                    $thisEl.find('#addNewStatus').show();
                    self.loadTopics(self.classId, self.subjectId, self.titleId)
            });
            self.subTopicCollection.bind('reset', this.render, self);
        },

        chooseOption: function (e) {
            var self = this;
            var $thisEl = self.$el;
            var $target = $(e.target);
            var id = $target.attr('id');
            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));
            var id = holder.attr('id');
            var classesId = $thisEl.find('#subject').attr('data-id')
            if(id == 'subClass') {
                this.classId = $(e.target).attr('id');
                this.className = $(e.target).text();
                this.loadTitles($(e.target).attr('id'))

            }
            if(id == 'title') {
                this.titleId = $(e.target).attr('id');
                this.titleName = $(e.target).text();
                this.loadSubjects($(e.target).attr('id'), this.classId)
            }
            if( id == 'subject'){
                this.subjectId = $(e.target).attr('id')
                this.subName = $(e.target).text();
                this.loadTopics(this.classId, $(e.target).attr('id'), this.titleId )
            }
        },

        loadSubjects: function(titleId, classId) {
            var self = this;
            var subjects = []
            if(classId != '' && titleId != '') {
                if(self.titles){
                    lodash.map(JSON.parse(JSON.stringify(self.titles)), function (val) {
                       var titleid = val.title ? val.title._id : '';
                       if(titleid === titleId && val.classDetail == classId) {
                           subjects.push({"_id": val.subject._id, name: val.subject.subjectName})
                       }
                   });
                    self.responseObj['#subject'] = subjects;
                }
            }

        },

        resetClasses: function(){
            this.responseObj['#title'] = [];
            this.responseObj['#subject'] = [];
            this.$el.find('#subject').text('Select Subject');
            this.$el.find('#title').text('Select Title');
        },

        loadTitles: function(classId){
            var self = this;
            var titles = []
            self.resetClasses();
            dataService.getData('/title/subTitle/'+ classId, {}, function (elem) {
                self.titles = elem.data;
                if(self.titles){
                    titles = lodash.map(JSON.parse(JSON.stringify(self.titles)), function (el) {
                        el._id = el.title ? el.title._id : '';
                        el.name = el.title ? el.title.titleName : '';
                        return el;
                    });
                    self.responseObj['#title'] = titles;
                }
            });

        },

        loadTopics: function(classId,  subjectId, titleId) {
            var self = this
            if(classId != '') {
                dataService.getData('/subTopics/class',{classDetail:classId ,subject: subjectId , title: titleId}, function (result) {
                    self.subTopicObj = result.data;
                    var workflowsWIds = _.uniq(_.pluck(result.data, 'topicName'), false).sort();
                    self.$el.html(_.template(ListTemplate, {workflowsWIds: result.data, classId: classId, subjectId: subjectId, className: self.className, subName: self.subName, isHide : false, titleId: titleId, titleName : self.titleName}));
                if(self.subTopicObj.length > 0) {
                    self.$el.find('.workflow-sub-list>*').remove();
                    self.$el.find('#details').addClass('active').show();
                    self.$el.find('#workflows').empty();
                    self.$el.find('#workflowNames').html('');
                    if(self.subTopicObj[0].subtopics) {
                        _.each(self.subTopicObj[0].subtopics.subtopic, function (val) {
                            self.$el.find('#workflows').append(new ListItemView({model: val, id: self.subTopicObj[0].subtopics._id}).render().el);
                        }, self);
                    }
                }});
            } else {

            }

        },

        cancel: function (e) {
            var $targetParent = $(e.target).parent();
            var $thisEl = this.$el;
            e.preventDefault();

            $targetParent.siblings().find('span').removeClass('hidden').end()
                .find('input, select, a:contains("Cancel"), a:contains("Save")').remove();
            $targetParent.find('.edit').removeClass('hidden').end().find('a:contains("Cancel"), a:contains("Save")').remove();
            $targetParent.find('.delete').removeClass('hidden').end().find('a:contains("Cancel"), a:contains("Save")').remove();
            $thisEl.find('#addNewStatus').show();
        },

        edit: function (e) {
            var $target;
            var $td;
            var $thisEl = this.$el;
            var text;
            var select;
            var statusText;

            e.preventDefault();
            $thisEl.find('span').removeClass('hidden');
            $thisEl.find('.addnew, .SaveCancel').remove();
            $thisEl.find('.name input, input.nameStatus, select, a:contains("Cancel"), a:contains("Save")').remove();
            $thisEl.find('.edit').removeClass('hidden');
            $thisEl.find('.delete').removeClass('hidden');
            $thisEl.find('#addNewStatus').show();

            $target = $(e.target);
            $td = $target.parent();

            text = '<a href="#">';
            select = $('<select/>');
            $target.closest('div.row').find('span, .edit').addClass('hidden');
            $target.closest('div.row').find('span, .delete').addClass('hidden');
            $td.siblings('.status').append(select);
            statusText = $td.siblings('div.status').text().trim();

            this.relatedStatusesCollection.forEach(function (status) {
                var statusJson = status.toJSON();

                if (statusJson.status === statusText) {
                    select.append($('<option>').text(statusJson.status).attr('selected', 'selected'));
                } else {
                    select.append($('<option>').text(statusJson.status));
                }
            });

            $td.siblings('.name').append(
                $('<input >').val($td.siblings('div.name').text().trim()));
            $td.append(
                $(text).text('Save').addClass('save btn blue slim'),
                $(text).text('Cancel').addClass('cancel btn slim')
            );
        },

        deleteItems: function (e) {
            var mid = 39;
            var self = this;
            var $tr = $(e.target).closest('div.row');
            var $tdName = $tr.find('div.name');
            var subTopicName = $tdName.attr('id')
            var id = $tdName.attr('data-id');
            var model = this.subTopicCollection.get(id);
            var col = this.subTopicCollection.toJSON();
            var answer = confirm('Really DELETE items ?!');

            e.preventDefault();

            if (answer === true) {
                var $tr = $(e.target).closest('div.row');
                var $tdName = $tr.find('div.name');

                var name = $tr.find('div.name span').text().trim();
                var status = $tr.find('div.status option:selected').text();
                var $tdName = $tr.find('div.name');
                var id = $tdName.data('id');
                var _id = $tdName.attr('id');

                var obj = {
                    _id: id,
                    name    : name,
                    modifier  : 'delete'
                };

                e.preventDefault();

                dataService.postData(CONSTANTS.URLS.VSUBTOPIC, obj,function (err, response) {
                     self.loadTopics(self.classId, self.subjectId, self.titleId)
                    $(e.target).parent().parent().remove();
                });
            }

        },

        gotoForm: function (e) {
            var itemIndex = $(e.target).closest('tr').data('index') + 1;

            App.ownContentType = true;
            window.location.hash = '#home/content-Workflows/form/' + itemIndex;
        },

        updateSequence: function (e) {
            var n = $('#workflows .row').length;
            var $thisEl = this.$el;
            var i;

            for (i = 0; i < n; i++) {
                $thisEl.find('#workflows .row').eq(i).find('div.name').attr('data-sequence', n - i - 1);
            }
        },

        chooseWorkflowDetailes: function (e, el) {
            var $target = e ? $(e.target) : el;
            var $thisEl = this.$el;
            var self = this;
            var wId;
            var name;
            var values;

            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            $thisEl.find('.workflow-sub-list>*').remove();
            $thisEl.find('#details').addClass('active').show();
            $thisEl.find('#workflows').empty();
            $thisEl.find('#workflowNames').html('');

            $('#addNewStatus').show();
            if ($target.hasClass('workflow')) {
                wId = $target.text();
                $('.workflow-list .active').removeClass('active');
                $target.parent().addClass('active');
            }
            name = $target.data('id');
            values = [];
           var values = lodash.filter(self.subTopicObj, {'topicId' : name});
            _.each(values, function (value) {
                if(value.subtopics) {
                    _.each(value.subtopics.subtopic, function (val) {
                        $thisEl.find('#workflows').append(new ListItemView({model: val, id: value.subtopics._id}).render().el);
                    }, self);
                }

            }, self);
            this.$('#workflows').sortable({
                containment: 'document',
                stop       : function (event, ui) {
                    var id = ui.item.find('div.name').attr('id');
                    var model = self.collection.get(id);
                    var sequence = 0;

                    self.collection.url = CONSTANTS.URLS.VSUBTOPIC ;

                    if (ui.item.next().hasClass('row')) {
                        sequence = parseInt(ui.item.next().find('div.name').attr('data-sequence'), 10) + 1;
                    }

                    model.save({
                        sequenceStart: parseInt(ui.item.find('div.name').attr('data-sequence'), 10),
                        wId          : model.toJSON().wId,
                        sequence     : sequence
                    }, {
                        patch  : true,
                        success: function (model2) {
                            self.updateSequence();

                            self.collection.add(model2, {merge: true});
                        }
                    });
                }
            });
        },

        showNewSelect: function (e) {
            var self = this
            var $thisEl = self.$el;
            var $target = $(e.target);
            var id = $target.attr('id');
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

        render: function () {
            var self = this;

            dataService.getData('/title/classDetails', {}, function (details) {
                details = _.map(details.data, function (detail) {
                    detail.name = detail.className;
                    return detail;
                });
                self.classDetails = details;
                self.responseObj['#subClass'] = details;
            });

            dataService.getData('/permission/tabs', {module : CONSTANTS.MID.CSTMangement, moduleId: CONSTANTS.MID.VSubTopics}, function (data) {
                var className =  data.data.tab ? 'active' : '';
                $('#subTopics').addClass(className);
                $('#subtopicsTab').addClass(className)
                if(data.data.read) {
                    $('#subTopics').removeClass('hide')
                    $('#subtopicsTab').removeClass('hide')
                } else {
                    $('#subTopics').addClass('hide')
                    $('#subtopicsTab').addClass('hide')
                }

                self.$el.html(_.template(ListTemplate, { collection      : self.collection.toJSON(), workflowsWIds: [], classId : '', subjectId: '', className  : '', subName : '', titleId : '', titleName : '',isHide : true}));

            });
            return this;
        },

        addNewStatus: function (e) {
            var $thisEl = this.$el;
            var $target = $(e.target);
            var text;

            e.preventDefault();

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.CREATE_STATUS_BTN
            });

            $thisEl.find('span').removeClass('hidden');
            $thisEl.find('.name input, select, a:contains("Cancel"), a:contains("Save")').remove();
            $thisEl.find('.edit').removeClass('hidden');
            $thisEl.find('.delete').removeClass('hidden');
            $thisEl.find('#addNewStatus').hide();
            $thisEl.find('#workflows').append('<div class="addnew row"><div><input type="text" class="nameStatus"required/></div>' +
                '<div class="SaveCancel" style="width:384px"><a href="javascript:;" id="saveStatus" class="btn slim blue">Save</a>' +
                '<a  href="javascript:;" id="cancelStatus" class="btn slim ">Cancel</a></div></div>');

            text = '<a href="#">';

            this.relatedStatusesCollection.forEach(function (status) {
                var statusJson = status.toJSON();
                $('#statusesDd').append($('<option>').text(statusJson.status));
            });

        },
        cancelStatus: function (e) {
            e.preventDefault();

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.CANCEL_CREATING
            });

            $('.addnew, .SaveCancel').remove();
            $('#addNewStatus').show();
        },

        saveStatus: function (e) {
            var mid = 39;
            var workflowsModel = new VSubTopicModel();
            var tId = $('.workflow-list li.active').data('id');
            var stId = $('.workflow-list li.active').data('sub');
            var workflowCollection = this.collection.toJSON();
            var self = this;

            var name = $.trim($('.nameStatus').val());

            e.preventDefault();
            var obj = {
                name: name,
                topic: tId,
                title: this.titleId,
                subject: this.subjectId,
                modifier: 'add',
                classDetail: this.classId,
            }
            if(stId != '') {
                obj._id = stId
            }

            ga && ga.event({
                eventCategory: GA.EVENT_CATEGORIES.USER_ACTION,
                eventLabel   : GA.EVENT_LABEL.CONFIRM_CREATING
            });
            dataService.postData(CONSTANTS.URLS.VSUBTOPIC, obj,function (err, response) {
                    $('#workflows').prepend(new ListItemView({model: {name: name}, id: response._id}).render().el);
                    $('.addnew, .SaveCancel').remove();
                    $('#addNewStatus').show();

            });

        },

        quickEdit: function () {
            var n = $('#workflows .row').length;

            if (n === 0) {
                $('a.delete').remove();
            }
        },

        removeEdit: function () {
            $('.edit-holder').remove();
        }
    });

    return ContentView;
});
