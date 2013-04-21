define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Subnote = Backbone.Model.extend({
        urlRoot:"/Enterprise/Subnotes",
        defaults:{
        }
    });

    return Subnote;
});