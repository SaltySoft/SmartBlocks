define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main_view.html',
    'Organization/Apps/Common/Views/TasksList',
    'Organization/Apps/Common/Views/PlannedTasksList',
    'Organization/Apps/Tasks/Models/Task',
    'Organization/Apps/Common/Views/TaskPopup',
    './TimeStats',
    'Organization/Apps/Common/Views/TaskTags',
    'Organization/Apps/Common/Views/WorkloadTimeline',
    'Organization/Apps/Common/Views/DeadlineThumbnail'
], function ($, _, Backbone, MainViewTemplate, TasksListView, PlannedTasksListView, Task, TaskPopup, TimeStatsView, TaskTagsView, WorkloadTimelineView, DeadlineThumbnail) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"task_show_main_view loading",
        initialize:function (task) {
            var base = this;
            base.model = task;
            base.task = task;
        },
        init:function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.prerender();
            base.task.fetch({
                success:function () {
                    base.$el.removeClass("loading");
                    base.render();
                    base.update();
                    base.registerEvents();
                }
            });
        },
        prerender:function () {
            var base = this;
            var template = _.template(MainViewTemplate, {});
            base.$el.html(template);
        },
        render:function () {
            var base = this;

            var template = _.template(MainViewTemplate, {});
            base.$el.html(template);
            var workload_timeline_view = new WorkloadTimelineView(base.task.get("planned_tasks"));
            base.$el.find(".workload_timeline_container").html(workload_timeline_view.$el);
            workload_timeline_view.init(base.SmartBlocks, base.task.get("required_time"), base.task.getDueDate(), new Date(base.task.get("creation_date")));
        },
        update:function () {
            var base = this;
            if (base.task.get("completion_date")) {
                base.$el.addClass("completed");
            } else {
                base.$el.removeClass("completed");
            }
            base.$el.find(".name").html(base.task.get("name"));
            base.$el.find(".description").html(base.task.get("description") != "" ? base.task.get("description") : "No description");
            if (base.task.get("parent") !== undefined && base.task.get("parent") !== null) {
                base.$el.find(".parent_task_link").html('Parent task : <a href="#tasks/' + base.task.get("parent").get("id") + '">' + base.task.get("parent").get("name") + '</a>');
            } else {
                if (base.task.get("activity")) {
                    base.$el.find(".parent_task_link").html('Activity: <a href="#activities/' + base.task.get("activity").id + '">' + base.task.get("activity").name + '</a>');
                } else {
                    base.$el.find(".parent_task_link").html("No parent");
                }
            }

            if (base.task.get("children").length > 0) {
                var subtask_list_view = new TasksListView(base.task.get("children"));
                base.$el.find(".subtasks_container").html(subtask_list_view.$el);
                subtask_list_view.init(base.SmartBlocks, function () {
                });
            } else {
                base.$el.find(".subtasks_container").html("No subtasks found.");
            }

//            var planned_tasks_list = new PlannedTasksListView(base.task.get("planned_tasks"));
//            base.$el.find(".planned_tasks_container").html(planned_tasks_list.$el);
//            planned_tasks_list.init(base.SmartBlocks);

//            var time_stats_view = new TimeStatsView(base.task);
//            base.$el.find(".time_stats_container").html(time_stats_view.$el);
//            time_stats_view.init(base.SmartBlocks);

            if (base.task.get("due_date")) {
                var deadline_information_view = new DeadlineThumbnail(base.task);
                base.$el.find(".time_stats_container").html(deadline_information_view.$el);
                deadline_information_view.init(base.SmartBlocks, "inpage");
                base.$el.find(".time_stats_container").removeClass("empty");
            } else {
                base.$el.find(".time_stats_container").addClass("empty");
                base.$el.find(".time_stats_container").html("This task is not a deadline");
            }

            var task_tags_view = new TaskTagsView(base.task);
            base.$el.find(".tags_container").html(task_tags_view.$el);
            task_tags_view.init(base.SmartBlocks, {
                main:function (tag) {
                    alert(tag.get("name"));
                },
                context:[
                    {
                        name:"Remove",
                        callback:function (tag) {
                            base.task.get("tags").remove(tag);
                            base.update();
                            base.task.save();
                        }
                    }
                ]
            });
        },
        registerEvents:function () {
            var base = this;

            base.$el.delegate(".add_task_button", "click", function () {
                var task = new Task();
                task.set("parent", base.task);
                var date = new Date();
                date.setHours(23, 59, 59, 0);
                task.setDueDate(date);
                var task_popup = new TaskPopup(task);
                task_popup.init(base.SmartBlocks, function () {
                    base.task.fetch({
                        success:function () {
                            base.update();
                        }
                    });
                });
            });

            base.task.on("changed", function () {
                base.update();
            });

            base.$el.delegate(".edit_button", "click", function () {
                var task_popup = new TaskPopup(base.task);
                task_popup.init(base.SmartBlocks, function () {
                    base.update();
                });
            });

            base.$el.delegate(".deletion_button", "click", function () {
                if (confirm("Are you sure you want to delete this task ?")) {
                    if (base.task.get("parent")) {
                        var id = base.task.get("parent").get('id');
                    }
                    window.location = id ? "#tasks/" + id : "#tasks";
                    base.task.destroy({
                        success:function () {
                            base.SmartBlocks.show_message("Successfully deleted task");
                        },
                        error:function () {
                            base.SmartBlocks.show_message("Deletion failed");
                        }
                    });
                }
            });

            base.$el.delegate(".completed_button", "click", function () {
                if (base.task.get("completion_date")) {
                    base.task.get("completion_date")
                    base.$el.removeClass("completed");

                    base.task.set("completion_date", null);
                    base.task.save({}, {
                        success:function () {
                            base.SmartBlocks.show_message("Successfully changed task status");

                        },
                        error:function () {
                            base.SmartBlocks.show_message("Could not change task status");
                            base.$el.addClass("completed");
                        }
                    });
                } else {
                    base.task.set("completion_date", new Date().getTime() / 1000);
                    base.task.save({}, {
                        success:function () {
                            base.SmartBlocks.show_message("Successfully changed task status");
                        },
                        error:function () {
                            base.SmartBlocks.show_message("Could not change task status");
                            base.$el.removeClass("completed");
                        }
                    });
                    base.$el.addClass("completed");
                }
            });
        }
    });

    return View;
});