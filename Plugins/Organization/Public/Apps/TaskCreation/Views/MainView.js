define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main_view.html',
    'Organization/Apps/Tasks/Models/Task',
    'Organization/Apps/Tasks/Collections/Tasks',
    'jqueryui'
], function ($, _, Backbone, MainViewTemplate, Task, TasksCollection) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "task_create_view",
        initialize: function () {
            var base = this;
            base.task = new Task();

        },
        init: function (SmartBlocks, activity_id) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            if (activity_id) {
                base.activity = OrgApp.activities.get(activity_id);
            }
            base.render();
            base.registerEvents();

        },
        render: function () {
            var base = this;
            console.log(base.activity);
            var template = _.template(MainViewTemplate, {
                activities: OrgApp.activities.models,
                selected_activity: base.activity
            });
            base.$el.html(template);

            base.$el.find(".deadline_date_input").datepicker();
        },
        registerEvents: function () {
            var base = this;


            base.$el.delegate(".creation_form", "submit", function () {
                var form = $(this);
                var valid = true;
                var name = base.$el.find(".name_input").val();
                base.task.set("description", base.$el.find(".description_input").val());
                if (name != "" && name.match(/^[a-zA-Z\s]+$/i)) {
                    base.task.set("name", name);
                    base.$el.find(".name_field_error").hide();
                } else {
                    valid = false;
                    base.$el.find(".name_field_error").show();
                }
                var type = base.$el.find(".type_input").val();
                if (type > 0) {
                    base.activity = OrgApp.activities.get(type);
                    base.task.set('activity', base.activity);
                    base.$el.find(".type_field_error").hide();
                } else {
                    valid = false;
                    base.$el.find(".type_field_error").show();
                }
                var deadline_check = base.$el.find(".deadline_input");
                base.task.set("required_time", base.$el.find(".needed_time_input").val() * 3600000);
                if (deadline_check.is(":checked")) {
                    var date_ms = Date.parse(base.$el.find(".deadline_date_input").val());
                    var date = new Date();
                    date.setTime(date_ms);
                    var hour = base.$el.find(".deadline_hour_input").val();
                    var minute = base.$el.find(".deadline_minute_input").val();
                    date.setHours(hour, minute, 0, 0);
                    base.task.setDueDate(date);

                }
                if (valid) {

                    base.task.save({}, {
                        success: function () {
                            OrgApp.tasks.add(base.task);
                            OrgApp.goTo("#tasks/" + base.task.get('id'));
                        }
                    });
                }


            });

            base.$el.delegate(".deadline_input", "change", function () {
                var checkbox = base.$el.find(".deadline_input");
                if (checkbox.is(":checked")) {
                    base.$el.find(".deadline_time").show();
                } else {
                    base.$el.find(".deadline_time").hide();
                }
            });

            base.$el.delegate(".cancel_button", "click", function () {
                OrgApp.goTo("#tasks");
            });
        }
    });

    return View;
});