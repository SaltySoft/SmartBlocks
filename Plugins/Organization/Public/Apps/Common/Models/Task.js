define([
    'underscore',
    'backbone',
    'Organization/Apps/Common/Models/TaskTag',
    'Organization/Apps/Common/Collections/TaskTags'
], function (_, Backbone, TaskTag, TaskTagsCollection) {
    var Task = Backbone.Model.extend({
        urlRoot:"/Organization/Tasks",
        defaults: {
            "model_type" : "Task"
        },
        parse:function (response) {
            var tags = response.tags;
            var tags_collection = new TaskTagsCollection();
            for (var k in tags) {
                var tag = new TaskTag(tags[k]);
                tags_collection.add(tag);
            }
            response.tags = tags_collection;

            return response;
        },
        getDueDate:function () {
            return new Date(this.get("due_date") * 1000);
        },
        setDueDate:function (date) {
            this.set("due_date", date.getTime() / 1000);
        }
    });

    return Task;
});