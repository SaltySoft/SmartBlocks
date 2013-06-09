define([
    'underscore',
    'backbone',
    'Organization/Apps/Tasks/Models/Task'
], function (_, Backbone, Task) {
    var PlannedTask = Backbone.Model.extend({
        urlRoot: "/Organization/PlannedTasks",
        getStart: function () {

            return new Date(this.get("start"));
        },
        setStart: function (date) {
            console.log(date);
            this.set("start", date.getTime());
            console.log(this);
        },
        parse: function (response) {
            var task_array = response.task;

            var task = new Task(task_array);
            response.task = task;

            response.start = parseInt(response.start);
            response.duration = parseInt(response.duration);

            return response;
        }
    });

    return PlannedTask;
});