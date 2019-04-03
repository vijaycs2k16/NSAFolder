define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/VAssessment/questionBank/form/ContentTemplate.html',
    'text!templates/VAssessment/questionBank/form/ListItemTemplate.html',
    'models/VQuestionBank',
    'views/VQuestionBank/CreateView',
    'views/VQuestionBank/form/FormView',
    'views/VQuestionBank/form/EditView',
    'vconstants',
    'helpers',
    'collections/VQuestionBank/filterCollection'
    ], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, QuotationModel, CreateView, FormView, EditView, CONSTANTS, helpers, FilterView) {
    'use strict';

    var QuotationsListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        EditView       : EditView,
        listUrl        : 'erp/VQuestionBank/list/',
        contentType    : CONSTANTS.VQUESTIONBANK, // needs in view.prototype.changeLocationHash
        viewType       : 'tform', // needs in view.prototype.changeLocationHash
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        ContentModel   : QuotationModel,
        FormView       : FormView,
        FilterView     : FilterView,


        renderList: function (orders) {
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                orders          : orders,
                currencyClass   : helpers.currencyClass,
                currencySplitter: helpers.currencySplitter
            }));
        },

        renderFormView: function (modelId, cb) {
            var $thisEl = this.$el;
            var self = this;
            var model = this.collection;
            self.currentModel = model.get(modelId);
            self.formView = new self.FormView({model: model.get(modelId), el: '#formContent'});
            self.formView.render();

            $thisEl.find('#listContent .selected').removeClass('selected');
            $thisEl.find('tr[data-id="' + modelId + '"]').addClass('selected');
            self.selectedId = model.get(modelId).id;
        }
    });

    return QuotationsListView;
});
