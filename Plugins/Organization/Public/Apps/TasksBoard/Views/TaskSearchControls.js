define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/task_search_controls.html',
    'Organization/Apps/Common/Views/TaskTags'
], function ($, _, Backbone, TaskSearchControlsTemplate, TaskTagsView) {
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
            base.all_tasks_tags = base.parent.tasks_tags;
            base.tasks_tags = undefined;

            base.render();
            base.registerEvents();

            base.parent.events.on("tasks_tags_loaded", function () {
                base.update();
            });
        },
        render:function () {
            var base = this;
            var template = _.template(TaskSearchControlsTemplate, {
                tasks_tags:base.all_tasks_tags.models
            });
            base.$el.html(template);
        },
        update:function () {
            var base = this;
            var task_tags_view = new TaskTagsView(undefined);
            base.task_tags_view = task_tags_view;
            base.task_tags_view.setTags(base.tasks_tags);
            base.$el.find(".tags_container").html(base.task_tags_view.$el);
            base.task_tags_view.init(base.SmartBlocks, {
                main:function (tag) {
                    alert(tag.get("name"));
                },
                context:[
                    {
                        name:"Remove",
                        callback:function (tag) {
                            base.tasks_tags = base.task_tags_view.getTags();
                            base.tasks_tags.remove(tag);
                            base.update();
                        }
                    }
                ]
            });
        },
        registerEvents:function () {
            var base = this;

            //            var timer = 0;
//            base.$el.delegate(".tag_search_input", "keyup", function () {
//                clearTimeout(timer);
//                timer = setTimeout(function () {
//
//                }, 500);
//            });
//
//            base.tasks_tags.on("")

            base.$el.delegate("form", "submit", function () {
                var form = $(this);
                var array = form.serializeArray();
                base.parameters = {};
                for (var k in array) {
                    base.parameters[array[k].name] = array[k].value;
                }

                var selected_tags = base.task_tags_view.getTags();
                var selected_tags_models = selected_tags.models;
                var tags_str = "";
                for (var k in selected_tags_models) {
                    if (tags_str != "")
                        tags_str += ",";
                    tags_str += selected_tags_models[k].get('id');
                }
                base.parameters['tags_str'] = tags_str;
                base.parent.events.trigger("load_task_list_with_params", base.parameters);
            });
        }
    });

    return View;
});