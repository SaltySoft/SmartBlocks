define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/edition.html',
    'jqueryui'
], function ($, _, Backbone, edition_template) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "task_edition",
        initialize: function (task) {
            var base = this;
            base.task = task;
            base.model = task;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;
            var start_date = new Date();
            start_date.setTime(base.task.get("creation_date"));
            var template = _.template(edition_template, {
                task: base.task,
                due_date: base.task.getDueDate(),
                start_date: start_date,
                activities: OrgApp.activities.models
            });
            base.$el.html(template);

            base.$el.find(".due_date_input").datepicker();
            base.$el.find(".start_date_input").datepicker();


        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".edition_form", "submit", function () {
                var valid = true;

                //name edition
                var name_input = base.$el.find(".name_input");
                if (name_input.val() != "") {
                    base.task.set("name", name_input.val());
                } else {
                    name_input.val(base.task.get("name"));
                    valid = false;
                }

                //description edition
                var description_input = base.$el.find(".description_input");
                base.task.set("description", description_input.val());

                //due date edition
                var duedate_input = base.$el.find(".due_date_input");
                var date = new Date(Date.parse(duedate_input.val()));
                console.log(date);
                if (date) {
                    date.setHours(base.$el.find(".due_hour_input").val(), base.$el.find(".due_minute_input").val(), 0, 0);
                    base.task.setDueDate(date);
                }

                //start date edition
                var startdate_input = base.$el.find(".start_date_input");
                var date = new Date(Date.parse(startdate_input.val()));
                if (date) {
                    base.task.set("creation_date", date.getTime());
                }


                if (valid) {
                    base.task.save({}, {
                        success: function () {
                            base.SmartBlocks.show_message("Successfully saved changes");
                        }
                    });
                } else {
                    console.log("stop");
                }

            });
        }
    });

    return View;
});