define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/dialogViewBase',
    'text!templates/FeedBack/temps/documentTemp.html',
    'views/NoteEditor/NoteView',
    'dataService',
    'vconstants',
    'helpers',
    'helpers/ga',
], function (Backbone, $, _, ParentView, DocumentTemplate, NoteEditor, dataService, CONSTANTS, helpers, ga) {

    var FormView = ParentView.extend({
        contentType: 'FeedBack',
        imageSrc   : '',
        forSales   : true,
        service    : false,
        templateDoc: _.template(DocumentTemplate),

        initialize: function (options) {
            var modelObj;

            this.currentModel = (options.model) ? options.model : options.collection.getElement();
            this.currentModel.urlRoot = '/FeedBack/text/';
            this.responseObj = {};
            this.editable = options.editable || true;
            modelObj = this.currentModel.toJSON();
        },

        events: {
            'focus .counterEl'                                 : 'checkCount',
            'click #noteArea, #taskArea'                       : 'expandNote',
            'click .cancelNote, #cancelTask'                   : 'cancelNote',
            'click #addNote, .saveNote'                        : 'saveNote',
            'click .contentHolder'                             : 'showButtons',
            'click #addTask'                                   : 'saveTask',
            'click .icon-circle'                               : 'completeTask',
            'click .editDelNote'                               : 'editDelNote',
            'click .icon-attach'                               : 'clickInput',
        },

        checkActiveClass: function (e) {
            var $target = $(e.target);

            if ($target.closest('li').hasClass('activeItem')) {
                return true;
            }

            return false;
        },

        showButtons: function (e) {

            var target = $(e.target);
            var $target = target.closest('.contentHolder');
            var hasClass = $target.hasClass('showButtons');
            var $thisEl = this.$el;

            if (target.closest('.itemCircle').length) {
                return false;
            }

            if ($thisEl.find('.editedNote').length || $thisEl.find('.createHolder').hasClass('active')) {
                return false;
            }

            $thisEl.find('.contentHolder').removeClass('showButtons');
            if (!hasClass) {
                $target.addClass('showButtons');
            }
        },

        reloadPage: function () {
            var url = window.location.hash;

            Backbone.history.fragment = '';
            Backbone.history.navigate(url, {trigger: true});
        },

        render: function () {
            var self = this;
            var $thisEl = this.$el;
            var template;

            console.info('this.currentModel.toJSON()',this.currentModel.toJSON())
                template = this.templateDoc({
                    model           : this.currentModel.toJSON(),
                });
            $thisEl.html(template);

            this.delegateEvents(this.events);
            return this;
        }

    });

    return FormView;
});
