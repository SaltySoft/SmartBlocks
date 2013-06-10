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
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;
            var popup = $(document.createElement("div"));
            popup.addClass("task_popup");
            var template = _.template(TaskPopupTemplate, {task: base.task});
            popup.html(template);
            base.$el.html(popup);

            $("body").prepend(base.$el);

        },
        saveTask: function () {
            var base = this;
            base.task.set("name", base.$el.find("#form_task_name").val());

//            var due_date = new Date();
//            due_date.setMilliseconds(0);
//            due_date.setSeconds(0);
//            due_date.setMinutes(0);
//            due_date.setHours(0);
//            var due_date_str = base.$el.find("#form_due_date").val();
//            if (due_date_str != "") {
//                var parts = due_date_str.match(/(\d+)/g);
//                due_date.setDate(parts[2]);
//                due_date.setMonth(parts[1] - 1);
//                due_date.setFullYear(parts[0]);
//
//                base.task.set("due_date", due_date.getTime() / 1000);
//                console.log("Task created or edited : ", due_date.getTime() / 1000);
//            }

            base.task.save({}, {
                success: function () {
                    base.SmartBlocks.show_message("Task successfully updated");
                    base.events.trigger("task_updated", base.task);
                    base.hide();
                }
            });
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
        },
        hide: function () {
            var base = this;
            base.$el.remove();
        }
    });

    return TaskPopup;
});