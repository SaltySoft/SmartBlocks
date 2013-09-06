define([
    'jquery',
    'underscore',
    'backbone',
    '../Models/Deadline'
], function ($, _, Backbone, Deadline) {
    var Collection = Backbone.Collection.extend({
        model: Deadline,
        url: "/Organization/Deadlines",
        comparator: function (deadline) {
            return deadline.get("stop");
        }
    });

    return Collection;
});