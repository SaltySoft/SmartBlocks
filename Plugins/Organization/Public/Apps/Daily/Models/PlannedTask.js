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
        getEnd: function () {
            var start = new Date(this.get("start"));
            var end = new Date();
            end.setTime(start.getTime() + this.get('duration'));
            return end;
        },
        getStop: function () {
            var base = this;
            return base.getEnd();
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
                if (!Task) {
                    Task = require('Organization/Apps/Tasks/Models/Task');
                }
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