define([
    'underscore',
    'backbone',
    'Organization/Apps/Tasks/Models/Task'
], function (_, Backbone, Task) {
    var Model = Backbone.Model.extend({
        urlRoot:"/Organization/Subtasks",
        defaults:{
        },
        parse:function (response) {
//            console.log("response", response);
//            if (response.task != null && response.task !== undefined) {
//                var task = new Task(response.task);
//
//                if (task !== undefined)
//                    response.task = task;
//            }

            return response;
        }
    });

    return Model;
});