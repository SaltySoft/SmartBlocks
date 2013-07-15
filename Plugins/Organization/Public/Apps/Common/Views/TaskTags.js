define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/task_tags.html',
    './TaskTagItem',
    'Organization/Apps/Common/Collections/TaskTags',
    'Organization/Apps/Common/Models/TaskTag'
], function ($, _, Backbone, TaskTagsTemplate, TaskTagItem, TaskTagsCollection, TaskTag) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"task_tags_view",
        initialize:function (task) {
            var base = this;
            base.task = task;
        },
        init:function (SmartBlocks, callbacks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.callbacks = callbacks;

            base.search_results = new TaskTagsCollection();

            base.render();
            base.registerEvents();
        },
        render:function () {
            var base = this;

            var template = _.template(TaskTagsTemplate, {});
            base.$el.html(template);

            var task_tags = base.task.get("tags").models;
            base.$el.find(".task_tags_list").find(".task_tag_item").remove();
            for (var k in task_tags) {
                var task_tag_item = new TaskTagItem(task_tags[k]);
                base.$el.find(".task_tags_list").append(task_tag_item.$el);
                task_tag_item.init(base.SmartBlocks, base.callbacks);
            }
        },
        registerEvents:function () {
            var base = this;

            var tag_search_timer = 0;
            base.$el.delegate(".tag_search_input", "keyup", function () {
                var list = base.$el.find(".tag_search_results");
                var elt = $(this);
                clearTimeout(tag_search_timer);
                tag_search_timer = setTimeout(function () {
                    base.search_results.fetch({
                        data:{
                            filter:elt.val()
                        },
                        success:function () {
                            list.css("left", elt.position().left);
                            list.css("top", elt.position().top + 25);
                            list.show();
                            list.html("");
                            for (var k in base.search_results.models) {
                                var tag = base.search_results.models[k];
                                list.append('<li ><a href="javascript:void(0);" class="add_tag_button" data-id="' + tag.get('id') + '">' + tag.get("name") + '</a></li>');
                            }
                        }
                    });
                }, 500);
            });

            base.$el.delegate(".add_tag_button", "click", function () {
                var list = base.$el.find(".tag_search_results");
                list.hide();
                var elt = $(this);
                var id = elt.attr("data-id");
                var tag = base.search_results.get(id);

                if (tag) {
                    base.task.get('tags').add(tag);
                    base.task.trigger("changed");
                    base.task.save({}, {
                        success:function () {
                        }
                    });
                }
            });

            base.$el.delegate(".create_tag_button", "click", function () {
                var tag = new TaskTag({
                    name:base.$el.find(".tag_search_input").val()
                });
                tag.save({}, {
                    success:function () {
                        base.task.get('tags').add(tag);
                        base.task.trigger("changed");
                        base.task.save({}, {
                            success:function () {
                            }
                        });
                    },
                    error:function (o, data) {
                        var response = JSON.parse(data.responseText);
                        base.SmartBlocks.show_message(response.message);
                    }
                });
            });
        }
    });

    return View;
});