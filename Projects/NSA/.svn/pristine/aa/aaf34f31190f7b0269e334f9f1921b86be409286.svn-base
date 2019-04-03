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
                url    : CONSTANTS.URLS.VSLEAVE,
                toJSON : function () {
                    return models;
                }
            };

            var saveObject = {
                trigger: this.trigger,
                url    : CONSTANTS.URLS.VSLEAVE,
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
                        modelObject.batch = model.attributes.batch;
                        modelObject.course = model.attributes.course;
                        modelObject.center = model.attributes.center;
                        modelObject.student = model.attributes._id;
                        modelObject.studentPhone = model.attributes.studentPhone;
                        modelObject.studentName = model.attributes.studentName;
                        modelObject.notify = model.attributes.notify;
                        models.push(modelObject);
                    } else {
                        if(model.changed.vacArray) {
                            newModelObj = model.changed;
                            newModelObj._id = model.id;
                            newModelObj.batch = model.attributes.batch;
                            newModelObj.course = model.attributes.course;
                            newModelObj.center = model.attributes.center;
                            newModelObj.student = model.attributes._id;
                            newModelObj.studentPhone = model.attributes.studentPhone;
                            newModelObj.studentName = model.attributes.studentName;
                            newModelObj.notify = model.attributes.notify;
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
