/*
define([
    'Backbone',
    'jQuery',
    'Underscore',
    'views/VQuestionBank/form/EditView'
], function (Backbone, $, _, ParentView) {

    var EditView = ParentView.extend({
        contentType: 'VQuestionBank',
        imageSrc   : '',

        initialize: function (options) {
            var modelObj;

            if (options) {
                this.visible = options.visible;
            }

            this.eventChannel = options.eventChannel;

            this.currentModel = (options.model) ? options.model : options.collection.getElement();
           // this.currentModel.urlRoot = '/VjjjjQuestionBank';
            this.responseObj = {};
            this.warehouse = this.currentModel.get('warehouse');
            this.editable = options.editable || true;
            this.eventChannel = options.eventChannel || null;
            this.balanceVissible = false;
            modelObj = this.currentModel.toJSON();
            this.onlyView = (modelObj.workflow && modelObj.workflow.status === 'Done');

            this.render();
        }
    });

    return EditView;
});
*/
