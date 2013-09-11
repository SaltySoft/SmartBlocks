define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Common/Models/ActivityType'
], function ($, _, Backbone, ActivityType) {
    var Collection = Backbone.Collection.extend({
        model: ActivityType,
        url: "/Organization/ActivityTypes"
    });

    return Collection;
});