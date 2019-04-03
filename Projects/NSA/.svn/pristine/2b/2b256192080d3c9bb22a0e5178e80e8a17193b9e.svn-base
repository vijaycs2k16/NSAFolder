define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/BundleMove/form/ContentTemplate.html',
    'text!templates/BundleMove/form/ListItemTemplate.html',
    'models/bundleMoveModel',
    'text!templates/BundleMove/form/FormTemplate.html',
    'views/BundleMove/CreateView',
    'views/BundleMove/list/ListItemView',
    'views/Filter/filterView',
    'helpers',
    'common',
    'vconstants',
    'moment'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, MoveModel, formTemplate, CreateView, ListItemView, FilterView, helpers, common, CONSTANTS, moment) {
    'use strict';

    var BundleMoveView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        listUrl        : 'erp/BundleMove/list/',
        contentType    : CONSTANTS.BUNDLEMOVE,
        viewType       : 'tform',
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        ContentModel   : MoveModel,
        forSales       : true,

        renderList     : function (collection) {
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');
            this.listCollections = collection;
            $listHolder.append(this.listTemplate({
                moment            : moment,
                collection        : collection
            }));
        },

        renderFormView: function (modelId, cb) {
            var $thisEl = this.$el;
            var self = this;
            var model;
            var data;

            model = new this.ContentModel({
                _id      : modelId
            });

            model.fetch({
                success: function (model) {
                    if (self.formView) {
                        self.formView.undelegateEvents();
                    }

                    var currentModelObj = self.listCollections ? self.listCollections.filter(function (o) { return o._id == model.id }) : {};
                    self.$el.find('#formContent').html(_.template(formTemplate, {model : currentModelObj[0], moment: moment}));

                    self.selectedId = model.id;

                },

                error: function () {
                    App.render({
                        type   : 'error',
                        message: 'Server error'
                    });
                }
            });
        }
    });

    return BundleMoveView;
});