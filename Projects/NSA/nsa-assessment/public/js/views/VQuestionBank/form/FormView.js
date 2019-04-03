define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/VAssessment/questionBank/form/FormTemplate.html',
    'text!templates/VAssessment/questionBank/temps/documentTemp.html',
    'views/NoteEditor/NoteView',
    'dataService',
    'vconstants',
    'helpers',
    'helpers/ga',
], function (Backbone, $, _, ParentView, EditTemplate, DocumentTemplate, NoteEditor, dataService, CONSTANTS, helpers, ga) {

    var FormView = ParentView.extend({
        contentType: 'VQuestionBank',
        imageSrc   : '',
        template   : _.template(EditTemplate),
        service    : false,
        templateDoc: _.template(DocumentTemplate),

        initialize: function (options) {
            var modelObj;

            this.currentModel = (options.model) ? options.model : options.collection.getElement();
            this.currentModel.urlRoot = '/vassessment/questions/';
            this.responseObj = {};
            this.editable = options.editable || true;
            modelObj = this.currentModel.toJSON();
        },

        deleteRow: function (e) {
            var target = $(e.target);
            var tr = target.closest('tr');
            var jobId = tr.find('#discountValue').val();
            var product = _.findWhere(this.responseObj['#productsDd'], {_id: jobId});
            if (product) {
                product.selectedElement = false;
            }

            e.stopPropagation();
            e.preventDefault();

            tr.remove();
            var append = "Removed option " + "[" + jobId + "]" + " from the List";

            if (tr.remove() && jobId.length) {
                return App.render({
                    type: 'error',
                    message: append
                });
            }

            if (tr.remove() && !jobId.length) {
                return App.render({
                    type: 'error',
                    message: 'Removed option from the list'
                });
            }
        },


        checkActiveClass: function (e) {
            var $target = $(e.target);

            if ($target.closest('li').hasClass('activeItem')) {
                return true;
            }

            return false;
        },


        reloadPage: function () {
            var url = window.location.hash;

            Backbone.history.fragment = '';
            Backbone.history.navigate(url, {trigger: true});
        },

        render: function () {
            var self = this;
            var $thisEl = this.$el;
            var formString;
            var productItemContainer;
            var buttons;
            var template;
            var timeLine;
            this.template = _.template(EditTemplate);
            var subjectTopicID = self.currentModel.toJSON().subTopic
            var topicId = self.currentModel.toJSON().topic
            if(subjectTopicID != null || subjectTopicID == ''){
                dataService.getData('/title/subtopics/'+ topicId, {}, function (topics) {
                    var data = topics.data.length > 0 ? topics.data[0].subtopic : null
                    var subTopicName =  _.filter(data, function(subtopic){ return subjectTopicID ==  subtopic._id})
                    self.subTtopic = subTopicName;

                });
            }
            else {
                self.subTtopic = []
            }
            setTimeout(function () {
                $('#printPdf').addClass('hide')
                $('#top-bar-deleteBtn').addClass('hide')
                $('#dateFilter').addClass('hide')
                var centerData =[]; self.selectCourses =[];
                formString = self.template({
                    model             : self.currentModel.toJSON(),
                    subTtopic         : self.subTtopic
                });

                $thisEl.html(formString);

                template = self.templateDoc({
                    model           : self.currentModel.toJSON(),
                    subTtopic    : self.subTtopic
                });

                        $thisEl.find('#templateDiv').html(template);
                        self.delegateEvents(self.events);
                        return self;
            }, 300)

        }

    });

    return FormView;
});
