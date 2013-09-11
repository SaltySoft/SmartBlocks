define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Model = Backbone.Model.extend({
        urlRoot:"/Organization/TaskTags",
        defaults:{
        },
        parse:function (response) {
            return response;
        }
    });

    return Model;
});