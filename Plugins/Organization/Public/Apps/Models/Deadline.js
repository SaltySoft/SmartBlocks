define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Model = Backbone.Model.extend({
        default: {
            name: "my deadline",
            start: new Date(),
            stop: new Date()
        },
        urlRoot: "/Organization/Deadlines",
        parse: function (response) {
            if (response.tasks) {
                var tasks_collection = new OrgApp.TasksCollection();
                for (var k in response.tasks) {
                    var task = new OrgApp.Task(response.tasks[k]);
                    tasks_collection.add(task);
                }
                response.tasks = tasks_collection;
            }
            return response;
        },
        getStop: function () {
            var base = this;
            var date = new Date();
            date.setTime(base.get("stop"));
            return date;
        },
        setStop: function (date) {
            var base = this;
            base.set("stop", date.getTime());
        },
        getWork: function () {
            var base = this;

            var tasks = base.get("tasks");
            var total = 0;
            var left = 0;
            var done = 0;
            for (var k in tasks.models) {
                var task = tasks.models[k];
                if (task.get("name")) {
                    var task_work = task.getWork();
                    total += task_work.total;
                    left += task_work.left;
                    done += task_work.done;
                }
            }
            var work = {
                total: total,
                left: left,
                done: done
            };
            return work;
        },
        getPlannedTasks: function () {
            var base = this;

            var tasks = base.get("tasks");
            var pt_collection = new OrgApp.PlannedTasksCollection();
            for (var k in tasks.models) {
                var pts = tasks.models[k].get("planned_tasks");
                for (var i in pts.models) {
                    var pt = pts.models[i];
                    pt_collection.add(pt_collection);
                }
            }
            return pt_collection;
        },
        getTasks: function () {
            var base = this;
            var tasks_c = new OrgApp.TasksCollection();
            var self_tasks = base.get("tasks");
            for (var k in self_tasks.models) {
                var task = self_tasks.models[k];
                if (OrgApp.tasks.get(task.get('id')) !== undefined) {
                    tasks_c.add(OrgApp.tasks.get(task.get('id')));
                }
            }
            return tasks_c;
        }
    });

    Model.generateStubs = function (activity) {
        var return_array = [];


        for (var i = 0; i < 10; i++) {
            var now = new Date();
            var start = new Date(now);
            var stop = new Date(now);

            start.setTime(now.getTime() - (Math.random() * 100000));

            stop.setTime(now.getTime() + (Math.random() * 100000));

            var tasks = new OrgApp.TasksCollection();

            for (var j = 0; j < 5; j++) {
                var rand = Math.round(Math.random() * OrgApp.tasks.models.length);
                tasks.add(OrgApp.tasks.at(rand));
            }

            var deadline = new Model({
                name: "Deadline " + i,
                start: start,
                stop: stop,
                activity: activity,
                tasks: tasks
            });

            return_array.push(deadline);

        }

        return return_array;
    };

    return Model;
});