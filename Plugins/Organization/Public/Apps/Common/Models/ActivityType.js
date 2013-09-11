define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var ActivityType = Backbone.Model.extend({
        default: {
        },
        urlRoot: "/Organization/ActivityTypes"
    });
    return ActivityType;
});