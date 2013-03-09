define([
    'underscore',
    'backbone',
    'Models/Job'
], function (_, Backbone, Job) {
    var JobsCollection = Backbone.Collection.extend({
        model: Job,
        url: "/Jobs"
    });

    return JobsCollection;
});