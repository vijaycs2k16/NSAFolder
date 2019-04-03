define([
    'Backbone',
    'Underscore',
    './filterCollection',
    'vconstants'
], function (Backbone, _, ParentCollection, CONSTANTS) {
    'use strict';

    var EditableCollection = ParentCollection.extend({

        initialize: function () {
            this.on('change', this.change, this);
        },

        save: function () {
            var self = this;
            var model;
            var models = [];
            var modelObject;
            var newModels = [];
            var i;
            var newModelObj;
            var syncObject = {
                trigger: this.trigger,
                url    : this.url,
                toJSON : function () {
                    return models;
                }
            };

            var saveObject = {
                trigger: this.trigger,
                url    : this.url,
                toJSON : function () {
                    return newModels;
                }
            };

            var options = {
                success: function (response) {
                    self.trigger('saved', response);
                }
            };
            var updatedOptions = {
                success: function () {
                    self.trigger('updated');
                }
            };

            for (i = this.models.length - 1; i >= 0; i--) {
                model = this.models[i];
                if (model && model.id) {
                    if (model.hasChanged() && !_.isEmpty(model.attributes.leave)) {
                        modelObject = model.changed;
                        modelObject._id = model.attributes.leave[0]._id;
                        modelObject.department = model.attributes.department;
                        modelObject.center = model.attributes.center;
                        modelObject.employee = model.attributes._id;
                        models.push(modelObject);
                    } else {
                        if(model.changed.vacArray) {
                            newModelObj = model.changed;
                            newModelObj._id = model.id;
                            newModelObj.center = model.attributes.center;
                            newModelObj.department = model.attributes.department;
                            newModelObj.employee = model.attributes._id;
                            newModels.push(newModelObj);
                        }

                    }
                } else if (model && !model.id) {
                    newModelObj = model.changed;
                    newModelObj._id = model.attributes.leave[0]._id;
                    Backbone.sync('create', saveObject, options);
                }
            }

            if(newModels.length) {
                Backbone.sync('create', saveObject, options);
            }

            if (models.length) {
                Backbone.sync('patch', syncObject, updatedOptions);
            }
        }
    });

    return EditableCollection;
});
