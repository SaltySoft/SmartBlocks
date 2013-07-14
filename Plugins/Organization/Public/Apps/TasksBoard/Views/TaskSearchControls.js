define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/task_search_controls.html'
], function ($, _, Backbone, TaskSearchControlsTemplate) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"task_search_controls",
        initialize:function () {
            var base = this;
            base.parameters = {};
        },
        init:function (SmartBlocks, parent) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.parent = parent;
            base.tasks_tags = base.parent.tasks_tags;

            base.render();
            base.registerEvents();

            base.parent.events.on("tasks_tags_loaded", function () {
                for (var k in base.tasks_tags.models) {
                    var tasks_tag = base.tasks_tags.models[k];
                    '<input type="checkbox" class="search_tags" data-id="' + tasks_tag.get("id") + '" name="' + tasks_tag.get("name") + '" />'

                    base.$el.find(".task_search_tags").append();
                }
            });
        },
        render:function () {
            var base = this;
            var template = _.template(TaskSearchControlsTemplate, {});
            base.$el.html(template);
        },
        registerEvents:function () {
            var base = this;

            base.$el.delegate("form", "submit", function () {
                var form = $(this);
                var array = form.serializeArray();
                base.parameters = {};
                for (var k in array) {
                    base.parameters[array[k].name] = array[k].value;
                }
                base.parent.events.trigger("load_task_list_with_params", base.parameters);
            });
        }
    });

    return View;
});