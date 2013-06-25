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
        getName: function () {
            var base = this;
            return base.get("content") ? base.get("content") : "No name";
        },
        getDeadlineName: function () {
            var base = this;
            return base.get("task") ? base.get("task").get("name") : "Not linked with a deadline";
        },
        parse: function (response) {
            var task_array = response.task;
            if (task_array != null) {
                var task = new Task(task_array);
                response.task = task;
            }


            response.start = parseInt(response.start);
            response.duration = parseInt(response.duration);

            return response;
        }
    });

    return PlannedTask;
});