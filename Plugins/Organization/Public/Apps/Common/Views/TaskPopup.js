define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Common/Templates/task_popup.html',
    'Organization/Apps/Common/Models/Activity',
    'Organization/Apps/Common/Collections/Activities'
], function ($, _, Backbone, TaskPopupTemplate, Activity, ActivitiesCollection) {
    var TaskPopup = Backbone.View.extend({
        tagName:"div",
        className:"cache task_popup_container",
        initialize:function (task) {
            var base = this;
            base.task = task;
            base.events = _.extend({}, Backbone.Events);
        },
        init:function (SmartBlocks, callback) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.callback = callback;
            base.activities = new ActivitiesCollection();

            if (!base.callback) {
                base.loadActivities();
            }
            else {
                base.render();
            }
            base.registerEvents();
        },
        loadActivities:function () {
            var base = this;
            base.activities.fetch({
                success:function () {
//                    base.events.trigger("loaded_activities");
                    base.render();
                }
            });
        },
        render:function () {
            var base = this;
            var popup = $(document.createElement("div"));
            popup.addClass("task_popup");
            var template = _.template(TaskPopupTemplate, {
                task:base.task,
                activities:base.activities.models,
                activity:base.task.getActivityForUser(base.SmartBlocks.current_user)
            });
            popup.html(template);
            base.$el.html(popup);

            $("body").prepend(base.$el);
            var elt = base.$el.find(".task_type");
            if (base.task.get("due_date")) {
                elt.val(0);
            }
            if (base.task.get('required_time') > 0) {
                base.$el.find("#required_time").val(base.task.get('required_time') / 3600000);
            }

            if (elt.val() == 0) {
                base.$el.find(".for_deadlines").hide();
            } else {
                base.$el.find(".for_deadlines").show();
            }
        },
        saveTask:function () {
            var base = this;
            base.task.set("name", base.$el.find("#form_task_name").val());

            base.task.set("required_time", base.$el.find(".required_time").val() * 3600000);
            if (base.$el.find(".task_type").val() == 1) {
                var date = new Date(base.$el.find("#form_task_date").val());
                date.setHours(base.$el.find(".hour").val());
                date.setMinutes(base.$el.find(".minute").val());
                date.setSeconds(0);
                date.setMilliseconds(0);
                base.task.setDueDate(date);
            } else {
                base.task.set("due_date", undefined);
            }

            base.task.set("description", base.$el.find(".form_description").val());

            if (base.task.get("name") != "") {
                base.task.save({}, {
                    success:function () {
                        base.SmartBlocks.show_message("Task successfully updated");
                        base.events.trigger("task_updated", base.task);
                        base.hide();
                        base.SmartBlocks.events.trigger("org.task_modified", base.task);
                        base.SmartBlocks.events.trigger("org_new_task", base.task);
                        if (base.callback) {
                            base.callback(base.task);
                        }
                        else {
                            if (!base.task.get("parent")) {
                                var activity_id = base.$el.find("#form_task_activity").val();
                                var activity = new Activity({ id:activity_id});
                                activity.fetch({
                                    success:function () {
                                        activity.get('tasks').add(base.task);
                                        activity.save({}, {
                                            success:function () {
                                                console.log("adding task to activity");
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    }
                });
            }
            else {
                alert("You must provide a name");
            }
        },
        registerEvents:function () {
            var base = this;
            base.$el.delegate(".task_popup_close_button", "click", $.proxy(base.hide, base));
            $(document).keyup(function (e) {
                if (e.keyCode == 27) {
                    base.hide();
                }
            });

            base.$el.delegate(".action_button", "click", function () {
                var elt = $(this);
                var action = elt.attr("data-action");
                if (action == 'save')
                    base.saveTask();
                if (action == 'cancel')
                    base.hide();
            });

            base.$el.find("#form_task_date").datepicker({
                dateFormat:'yy-mm-dd'
            });

            var today = base.task.getDueDate();
            var date = (today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate());
            base.$el.find("#form_task_date").val(date);
            base.$el.find(".hour").val(today.getHours());
            base.$el.find(".minute").val(today.getMinutes());

            base.$el.find(".task_type").change(function () {
                var elt = $(this);
                if (elt.val() == 0) {
                    base.$el.find(".for_deadlines").hide();
                } else {
                    base.$el.find(".for_deadlines").show();
                }
            });
        },
        hide:function () {
            var base = this;
            base.$el.remove();
        }
    });

    return TaskPopup;
});