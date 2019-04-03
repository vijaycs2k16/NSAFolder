define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/tformViewBase',
    'text!templates/VStudentLeads/form/ContentTemplate.html',
    'text!templates/VStudentLeads/form/ListItemTemplate.html',
    'models/LeadsModel',
    'views/VStudentLeads/form/FormView',
    'views/VStudentLeads/CreateView',
    'views/VStudentLeads/list/ListItemView',
    'views/Filter/filterView',
    'common',
    'constants'
], function (Backbone, $, _, TFormBaseView, ContentTemplate, ListItemTemplate, LeadsModel, FormView, CreateView, ListItemView, FilterView, common, CONSTANTS) {
    'use strict';

    var OpportunitiesListView = TFormBaseView.extend({
        listTemplate   : _.template(ListItemTemplate),
        contentTemplate: _.template(ContentTemplate),
        CreateView     : CreateView,
        ListItemView   : ListItemView,
        listUrl        : 'erp/VStudentLeads/list/',
        contentType    : 'VStudentLeads', // needs in view.prototype.changeLocationHash
        viewType       : 'tform', // needs in view.prototype.changeLocationHash
        hasPagination  : true,
        hasAlphabet    : false,
        formView       : null,
        selectedId     : null,
        ContentModel   : LeadsModel,
        FormView       : FormView,

        renderList: function(leads){
            var $thisEl = this.$el;
            var $listHolder = $thisEl.find('#listContent');

            $listHolder.append(this.listTemplate({
                leads: leads
            }));
        }
    });

    return OpportunitiesListView;
});