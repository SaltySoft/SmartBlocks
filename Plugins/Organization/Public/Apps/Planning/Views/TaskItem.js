define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/task_item.html'
], function ($, _, Backbone, TaskItemTemplate) {
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