define([
    'Backbone',
    'models/FilterModel'
], function (Backbone, FilterModel) {
    'use strict';

    var FilterCollection = Backbone.Collection.extend({
        model: FilterModel,

        initialize: function (models, options) {
            if (models && models.length) {
                models.forEach(function (el) { // quick fix for filters
                    var i;
                    if (!el.name) {
                        i = models.indexOf(el);

                        return i > -1 ? models.splice(i, 1) : [];
                    }
                });
            }

            this.sortName = options ? options.key : 'name';
            this.sortOrder = options ? options.order : 1;
        }
    });
    return FilterCollection;
});