define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Common/Templates/task_popup.html'
], function ($, _, Backbone, TaskPopupTemplate) {
    var TaskPopup = Backbone.View.extend({
        tagName: "div",
        className: "cache task_popup_container",
        initialize: function (task) {
            var base = this;
            base.task = task;
            base.events =_.extend({}, Backbone.Events);
        },
        init: function (SmartBlocks, callback) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.callback = callback;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;
            var popup = $(document.createElement("div"));
            popup.addClass("task_popup");
            var template = _.template(TaskPopupTemplate, {task: base.task, activity: base.task.getActivityForUser(base.SmartBlocks.current_user)});
            popup.html(template);
            base.$el.html(popup);

            $("body").prepend(base.$el);
        },
        saveTask: function () {
            var base = this;
            base.task.set("name", base.$el.find("#form_task_name").val());
            if (base.$el.find(".task_type").val() == 0) {
                base.task.set("required_time", base.$el.find(".required_time").val() * 3600000);
                var date = new Date(base.$el.find("#form_task_date").val());

                date.setHours(base.$el.find(".hour").val());
                date.setMinutes(base.$el.find(".minute").val());
                date.setSeconds(0);
                date.setMilliseconds(0);
                base.task.setDueDate(date);
            } else {
                base.task.set("due_date", undefined);
            }

            if (base.task.get("name") != "") {
                base.task.save({}, {
                    success: function () {
                        base.SmartBlocks.show_message("Task successfully updated");
                        base.events.trigger("task_updated", base.task);
                        base.hide();
                        base.SmartBlocks.events.trigger("org.task_modified", base.task);
                        if (base.callback) {
                            base.callback(base.task);
                        }
                    }
                });
            } else {
                alert("You must provide a name");
            }
        },
        registerEvents: function () {
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
                dateFormat: 'yy-mm-dd'
            });

            var today = base.task.getDueDate();
            var date = (today.getFullYear()+'-'+((today.getMonth()+1) < 10 ? '0' : '')+(today.getMonth()+1)+'-'+(today.getDate() < 10 ? '0' : '')+today.getDate());
            base.$el.find("#form_task_date").val(date);
            base.$el.find(".hour").val(today.getHours());
            base.$el.find(".minute").val(today.getMinutes());

            base.$el.find(".task_type").change(function () {
                var elt = $(this);
                if (elt.val() == 1) {
                    base.$el.find(".for_deadlines").hide();
                } else {
                    base.$el.find(".for_deadlines").show();
                }
            });
        },
        hide: function () {
            var base = this;
            base.$el.remove();
        }
    });

    return TaskPopup;
});