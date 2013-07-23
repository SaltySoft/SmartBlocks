define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Common/Models/TaskTag'
], function ($, _, Backbone, TaskTag) {
    var Collection = Backbone.Collection.extend({
        model:TaskTag,
        url:"/Organization/TaskTags"
    });

    return Collection;
});