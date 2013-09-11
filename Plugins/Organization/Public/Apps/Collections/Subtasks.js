define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Models/Subtask'
], function ($, _, Backbone, Subtask) {
    var Collection = Backbone.Collection.extend({
        model:Subtask,
        url:"/Organization/Subtasks"
    });

    return Collection;
});