define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/FeedBack/form/ContentTemplate.html',
    'text!templates/FeedBack/form/ListItemTemplate.html',
    'models/FeedBackModel',
    'views/FeedBack/CreateView',
    'views/FeedBack/form/FormView',
    'vconstants',
    'helpers',
    'collections/FeedBack/filterCollection'
    ], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, QuotationModel, CreateView, FormView, CONSTANTS, helpers, FilterView) {
    'use strict';

    var QuotationsListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        listUrl        : 'erp/FeedBack/list/',
        contentType    : 'FeedBack', // needs in view.prototype.changeLocationHash
        viewType       : 'tform', // needs in view.prototype.changeLocationHash
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        forSales       : false,
        selectedId     : null,
        ContentModel   : QuotationModel,
        FormView       : FormView,
        FilterView     : FilterView,




        renderList: function (users) {
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                users          : users,
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
