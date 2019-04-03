define([
    'collections/parent',
    'models/VSubTopicModel'
], function (Parent, Model) {
        'use strict';

        var subTopicCollection = Parent.extend({
            model: Model,
            url  : function () {
                var mid = 39;
                var url = '/subTopics'+ this.type;

                return url;
            },

            initialize: function (options) {
                // change check options.id
                if (options && options.id) {
                    this.type = options.id;
                } else {
                    this.type = '';
                }

                this.fetch({
                    type   : 'GET',
                    reset  : true,
                    success: this.fetchSuccess,
                    error  : this.fetchError
                });
            }
        });

        return subTopicCollection;
    });
