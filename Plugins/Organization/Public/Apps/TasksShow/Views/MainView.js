define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main_view.html',
    './Summary',
    './Subtasks',
    './Edition'
], function ($, _, Backbone, main_view_template, SummaryView, SubtasksView, EditionView) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"task_show_main_view",
        initialize:function (task) {
            var base = this;
            base.task = task;
            base.model = task;
        },
        init:function (SmartBlocks, subpage) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.subpage = subpage;
            base.render();
            base.registerEvents();
        },
        render:function () {
            var base = this;

            var template = _.template(main_view_template, {
                task:base.task
            });
            base.$el.html(template);
            base.setSubpage();
        },
        renderSummary:function () {
            var base = this;
            var summary_view = new SummaryView(base.task);
            base.$el.find(".task_subapp_container").html(summary_view.$el);
            base.$el.find(".summary_tab_button").addClass("pure-menu-selected");
            summary_view.init(base.SmartBlocks);
        },
        renderSubtasks:function () {
            var base = this;
            var subtasks_view = new SubtasksView(base.task);
            base.$el.find(".task_subapp_container").html(subtasks_view.$el);
            base.$el.find(".tasks_tab_button").addClass("pure-menu-selected");
            subtasks_view.init(base.SmartBlocks);
        },
        renderEdition:function () {
            var base = this;
            var edition_view = new EditionView(base.task);
            base.$el.find(".task_subapp_container").html(edition_view.$el);
            base.$el.find(".edition_tab_button").addClass("pure-menu-selected");
            edition_view.init(base.SmartBlocks);
        },
        setSubpage:function (subpage) {
            var base = this;
            if (subpage) {
                base.subpage = subpage;
            }
            base.$el.find(".menu_button").removeClass("pure-menu-selected");
            if (base.subpage == "summary" || base.subpage == "") {
                base.renderSummary();
            } else if (base.subpage == "edition") {
                base.renderEdition();
            } else if (base.subpage == "subtasks") {
                base.renderSubtasks();
            } else if (base.subpage == "planning") {
                //base.renderPlanning();
            }
        },
        registerEvents:function () {
            var base = this;
        }
    });

    return View;
});