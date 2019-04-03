define([
    'Backbone',
    'jQuery',
    'Underscore',
    'Lodash',
    'text!templates/FeedBack/CreateTemplate.html',
    'views/dialogViewBase',
    'views/Products/orderRows/ProductItems',
    'models/FeedBackModel',
    'common',
    'populate',
    'vconstants',
    'views/Assignees/AssigneesView',
    'dataService',
    'helpers/keyValidator',
    'helpers'
], function (Backbone,
             $,
             _,
             lodash,
             CreateTemplate,
             ParentView,
             ProductItemView,
             QuotationModel,
             common,
             populate,
             CONSTANTS,
             AssigneesView,
             dataService,
             keyValidator,
             helpers) {

    var CreateView = ParentView.extend({
        el         : '#content-holder',
        contentType: 'FeedBack',
        template   : _.template(CreateTemplate),
        imageSrc            : '',
        forSales   : true,

        initialize: function (options) {
            if (options) {
                this.visible = options.visible;
            }
            _.bindAll(this, 'render', 'saveItem');
            this.currentModel = new QuotationModel();
            this.responseObj = {};
            this.collection = options.collection;
            this.currencySymbol = '₹';
            this.deletedProducts = [];
            this.render();
        },

        events: {
            'click button.saveItem': 'saveItem',
            'mouseenter .avatar': 'showEdit',
            'mouseleave .avatar': 'hideEdit',
            'click .removeJob'       : 'deleteRow',
        },

        deleteRow: function (e) {
            var target = $(e.target);
            var tr = target.closest('tr');
            var jobId = tr.find('#discountValue').val();
            var product = _.findWhere(this.responseObj['#productsDd'], {_id: jobId});
            if (product) {
                product.selectedElement = false;
            }

            e.stopPropagation();
            e.preventDefault();

            tr.remove();
            var append = "Removed option " + "[" + jobId + "]" + " from the List";

            if (tr.remove() && jobId.length) {
                return App.render({
                    type: 'error',
                    message: append
                });
            }

            if (tr.remove() && !jobId.length) {
                return App.render({
                    type: 'error',
                    message: 'Removed option from the list'
                });
            }
        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        chooseOption: function (e) {
            var target = $(e.target);
            var $target = $(e.target);
            var $thisEl = this.$el;
            var id = target.attr('id');
            e.preventDefault();
            $('.newSelectList').hide();
            target.closest('.current-selected').text(target.text()).attr('data-id', target.attr('id'));

            var holder = $(e.target).parents('._newSelectListWrap').find('.current-selected');
            holder.text($(e.target).text()).attr('data-id', $(e.target).attr('id'));

            return false;
        },


        saveItem: function () {
            var self = this;
            var thisEl = this.$el;

            this.currentModel.save({}, {
                wait   : true,
                success: function (model) {
                    var url = 'erp/' + 'FeedBack';
                    Backbone.history.navigate(url + '/list', {trigger: true});
                },
                error: function (model, xhr) {
                    self.errorNotification(xhr);
                }
            });

        },

        hideDialog: function () {
            $('.edit-dialog').remove();
        },

        render: function () {
            var self = this;
            var $thisEl = this.$el;
            var formString;
            var template;

            this.template = _.template(CreateTemplate);

            formString = this.template({
                model             : this.currentModel.toJSON(),
            });

            $thisEl.html(formString);
            $thisEl.find('#templateDiv').html(template);

            this.delegateEvents(this.events);
            return this;
        }
    });

    return CreateView;
});
