define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/task_item.html',
    'Organization/Apps/Common/Organization'
], function ($, _, Backbone, TaskItemTemplate, Organization) {
    var TaskItem = Backbone.View.extend({
        tagName: "div",
        className: "planning_task_item",
        initialize: function (model) {
            var base = this;
            base.task = model;
            base.model = model;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.children_shown = false;
            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(TaskItemTemplate, {
                task: base.task
            });

            base.$el.html(template);
            base.clockUpdate();
            var interval = setInterval(function() {
                if (base.$el.height() > 0)
                    base.clockUpdate();
                else
                    clearInterval(interval);
            }, 500);

            base.update();
            var eventObject = {
                title: base.task.get("name"),
                task_id: base.task.get("id")
            };
            base.$el.data('eventObject', eventObject);

            base.$el.draggable({
                revert: true,
                "handle": ".handle"
            });


        },
        update: function () {
            var base = this;
            base.$el.find(".name").html(base.task.get("name"));

            var subtasks = base.task.get("children").models;
            var list = base.$el.find(".children_container");
            if (subtasks.length > 0) {
                for (var k in subtasks) {
                    var taske = subtasks[k];
                    var sub_taskitem = new TaskItem(taske);
                    list.prepend(sub_taskitem.$el);
                    sub_taskitem.init(base.SmartBlocks);
                }
                base.$el.addClass("parent");
            }

            base.$el.find(" > div > .type").css("background-color", (base.task.get("activity") != null) ? base.task.get("activity").type.color : "gray");

        },
        clockUpdate: function () {
            var base = this;
            var now = new Date();
            var date = base.task.getDueDate();

            if (base.task.get("due_date")) {

                if (date < now) {

                    base.$el.addClass("overdue");

                    var display = " ";
                    var milliseconds = now.getTime() - date.getTime();

                    var days = milliseconds / ( 24 * 3600 * 1000);
                    if (days >= 1) {
                        display += Math.floor(days) + "d ";
                    }

                    var hours = (days - Math.floor(days)) * 24;
                    if (hours >= 1 && days <= 3)
                        display += Math.floor(hours) + " h ";

                    var minutes = (hours - Math.floor(hours)) * 60;
                    if (milliseconds < 1000 * 3600 * 24 && milliseconds > 60000)
                        display += Math.floor(minutes) + " m ";

                    var seconds = (minutes - Math.floor(minutes)) * 60;
                    if (milliseconds < 1000 * 3600 * 0.5 && milliseconds < 60000) {
                        display += Math.floor(seconds) + " s ";
                    }
                    display += " late";


                } else {
                    base.$el.removeClass("overdue");

                    var display = "";
                    var milliseconds = date.getTime() - now.getTime();

                    var days = milliseconds / ( 24 * 3600 * 1000);
                    if (days >= 1) {
                        display += Math.floor(days) + "d ";
                    }

                    var hours = (days - Math.floor(days)) * 24;
                    if (hours >= 1 && days <= 3)
                        display += Math.floor(hours) + " h ";

                    var minutes = (hours - Math.floor(hours)) * 60;
                    if (milliseconds < 1000 * 3600 * 24)
                        display += Math.floor(minutes) + " m ";

                    var seconds = (minutes - Math.floor(minutes)) * 60;
                    if (milliseconds < 1000 * 3600 * 5) {
                        display += Math.floor(seconds) + " s ";
                    }

                }


                base.$el.find(" > div > .timeleft").html(display);
            } else {
                base.$el.find(" > div > .timeleft").html("");
            }
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".children_button", "click", function (e) {
                e.stopPropagation();
                if (!base.$el.hasClass("expanded")) {
                    $(".planning_task_item").hide();

                    base.$el.show();
                    base.$el.find(".planning_task_item").show();
                    base.$el.parents(".planning_task_item").show();


                    base.$el.addClass("expanded");
                    base.children_shown = true;
                } else {

                    if (base.$el.hasClass("expanded")) {
                        base.$el.removeClass("expanded");
                        base.$el.find(".planning_task_item").removeClass("expanded");
                    }
                    if ($(".expanded").length == 0) {
                        $(".planning_task_item").show();
                        base.children_shown = false;
                    }


                }


            });
        }
    });

    return TaskItem;
});