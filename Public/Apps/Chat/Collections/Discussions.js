define([
    'underscore',
    'backbone',
    'Models/Discussion'
], function (_, Backbone, Discussion) {
    var DiscussionsCollection = Backbone.Collection.extend({
        model: Discussion,
        url: "/Discussions"
    });

    return DiscussionsCollection;
});