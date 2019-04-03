define([
    'Backbone',
    'Underscore',
    'text!templates/VExamSchedule/form/FormTemplate.html',
    'models/VExamScheduleModel',
    'views/VExamSchedule/EditView'
], function (Backbone, _, FormTemplate, userModel, EditView) {
    var FormView = Backbone.View.extend({
        el: '#content-holder',

        initialize: function (options) {
            this.formModel = new userModel(options.model.get('user'));
            this.formModel.urlRoot = '/VExamSchedule';
        },

        editItem: function () {
            return new EditView({model: this.formModel});
        },

        deleteItems: function () {
            var mid = 39;

            this.formModel.destroy({
                headers: {
                    mid: mid
                },
                success: function () {
                    Backbone.history.navigate('#erp/VExamSchedule/list', {trigger: true});
                },

                error: function (model, res) {
                    if (res.status === 403) {
                        App.render({
                            type   : 'error',
                            message: 'You do not have permission to perform this action'
                        });
                    } else {
                        App.render({
                            type   : 'error',
                            message: JSON.parse(res.responseText).error
                        });
                    }
                }
            });

        },

        render: function () {
            var formModel = this.formModel.toJSON();
            $('#dateFilter').addClass('hide')
            this.$el.html(_.template(FormTemplate, formModel));

            return this;
        }
    });

    return FormView;
});
