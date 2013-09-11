define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Subnote = Backbone.Model.extend({
        urlRoot:"/Meetings/Subnotes",
        defaults:{
        }
    });

    return Subnote;
});