define([
    'underscore',
    'backbone'

], function (_, Backbone) {
    var Block = Backbone.Model.extend({
        baseUrl: "/Blocks",
        defaults: {
        }
    });


    return Block;
});