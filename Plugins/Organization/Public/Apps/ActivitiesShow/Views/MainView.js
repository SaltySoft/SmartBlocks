define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main_view.html',
    'Organization/Apps/Common/Collections/ActivityTypes',
    'Organization/Apps/Common/Models/ActivityType',
    'Organization/Apps/Common/Views/TasksList',
    './TaskPreview',
    'Organization/Apps/Common/Views/TaskPopup',
    'Organization/Apps/Tasks/Models/Task',
    'Organization/Apps/Common/Collections/Activities',
    'Organization/Apps/Common/Views/WorkloadTimeline',
    'Organization/Apps/Daily/Collections/PlannedTasks',
    'text!LoadingTemplate',
    './Edition',
    './Summary',
    './Planning',
    './Tasks',
    './Deadlines'
], function ($, _, Backbone, MainViewTemplate, ActivityTypesCollection, ActivityType, TasksListView, TaskPreview, TaskPopup, Task, ActivitiesCollection, WorkloadTimelineView, PlannedTasksCollection, LoadingTemplate, EditionView, SummaryView, PlanningView, TasksView, DeadlinesView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "activity_show_view",
        initialize: function (model) {
            var base = this;
            base.events = $.extend({}, Backbone.Events);

            base.model = model;
            base.activity = model;
            base.app_name = "activity_show";
        },
        init: function (SmartBlocks, subpage) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            if (subpage)
                base.subpage = subpage;
            base.$el.addClass("loading");
            base.loading_template = _.template(LoadingTemplate, {
            });

            base.$el.html(base.loading_template);

            base.activity_types = new ActivityTypesCollection();
            base.loaded = 0;
            base.activity_types.fetch({
                success: function () {
                    base.loaded++;
                    if (base.loaded == 2) {
                        base.launch();
                    }
                }
            });

            base.activity.fetch({
                success: function () {
                    base.loaded++;
                    if (base.loaded == 2) {
                        base.launch();
                    }
                }
            });
        },
        launch: function () {
            var base = this;
            base.$el.removeClass("loading");
            base.render();
            base.registerEvents();
            base.setSubpage();
        },
        renderSummary: function () {
            var base = this;
            var summary_view = new SummaryView(base.activity);
            base.$el.find(".activity_subapp_container").html(summary_view.$el);
            summary_view.init(base.SmartBlocks);
        },
        renderEdition: function () {
            var base = this;
            var edition_view = new EditionView(base.activity);
            base.$el.find(".activity_subapp_container").html(edition_view.$el);
            edition_view.init(base.SmartBlocks);
        },
        renderTasks: function () {
            var base = this;
            var tasks_view = new TasksView(base.activity);
            base.$el.find(".activity_subapp_container").html(tasks_view.$el);
            tasks_view.init(base.SmartBlocks);
        },
        renderPlanning: function () {
            var base = this;
            var edition_view = new PlanningView(base.activity);
            base.$el.find(".activity_subapp_container").html(edition_view.$el);
            edition_view.init(base.SmartBlocks);
        },
        renderDeadlines: function () {
            var base = this;
            var deadline_view = new DeadlinesView(base.activity);
            base.$el.find(".activity_subapp_container").html(deadline_view.$el);
            deadline_view.init(base.SmartBlocks);
        },
        setSubpage: function (subpage) {
            var base = this;
            if (subpage)
                base.subpage = subpage;
            base.$el.find(".menu_button").removeClass("pure-menu-selected");
            if (base.subpage == "edition") {
                base.renderEdition();
                base.$el.find(".edition_tab_button").addClass("pure-menu-selected");
            } else if (base.subpage == "summary") {
                base.renderSummary();
                base.$el.find(".summary_tab_button").addClass("pure-menu-selected");
            } else if (base.subpage == "planning") {
                base.renderPlanning();
                base.$el.find(".planning_tab_button").addClass("pure-menu-selected");
            } else if (base.subpage == "tasks") {
                base.renderTasks();
                base.$el.find(".tasks_tab_button").addClass("pure-menu-selected");
            } else if (base.subpage == "deadlines") {
                base.renderDeadlines();
                base.$el.find(".deadlines_tab_button").addClass("pure-menu-selected");
            }
        },
        render: function () {
            var base = this;
            var template = _.template(MainViewTemplate, {
                activity: base.activity,
                types: base.activity_types.models
            });

            base.$el.html(template);
            var container_v = base.$el.find(".activity_show");
            base.container_v = container_v;
            container_v.css("border", "2px " + base.activity.get('type').get('color') + " solid");


            base.update();
        },
        update: function () {
            var base = this;
            base.container_v.css("border", "2px " + base.activity.get('type').get('color') + " solid");
            base.$el.find(".name").html(base.activity.get("name"));
            base.$el.find(".description").html(base.activity.get("description"));


            if (base.activity.get("tasks").length > 0) {
                var tasks_list = new TasksListView(base.activity.get("tasks"));
                base.$el.find(".tasks_list_container").html(tasks_list.$el);
                tasks_list.init(base.SmartBlocks, function (task) {
                    var task_preview = new TaskPreview(task);
                    base.$el.find(".task_preview_container").html(task_preview.$el);
                    task_preview.init(base.SmartBlocks);
                });
            }
            else {
                base.$el.find(".tasks_list_container").html("No tasks found.");
            }
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".type_select", "change", function () {
                var value = $(this).val();
                var type = new ActivityType({
                    id: value
                });
                type.fetch({
                    success: function () {
                        base.activity.set("type", type);
                        base.activity.save();
                        base.update();
                    }
                });
            });

            base.$el.delegate(".edit_button", "click", function () {
                base.$el.addClass("edition");
            });

            base.$el.delegate(".edition_cancel_button", "click", function () {
                base.$el.find(".edition_form")[0].reset();
                base.$el.removeClass("edition");
            });

            base.$el.delegate(".edition_save_button", "click", function () {
                var form = base.$el.find(".edition_form");

                var array = form.serializeArray();

                for (var k in array) {
                    base.activity.set(array[k].name, array[k].value);
                    base.activity.save();
                    base.$el.removeClass("edition");
                    base.update();
                }
            });

            base.$el.delegate(".add_task_button", "click", function () {
                var task = new Task();
                var date = new Date();
                date.setHours(23, 59, 59, 0);
                task.setDueDate(date);
                var task_popup = new TaskPopup(task);
                task_popup.init(base.SmartBlocks, function (task) {
                    base.SmartBlocks.startLoading("Saving");
                    base.activity.get('tasks').add(task);
                    base.activity.save({}, {
                        success: function () {
                            base.SmartBlocks.stopLoading();
                            base.update();
                        }
                    });
                });
            });
        }
    });

    return View;
});