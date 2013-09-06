define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/main.html',
    './Tasks'
], function ($, _, Backbone, main_template, TasksView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "deadline_show",
        initialize: function (deadline) {
            var base = this;
            base.deadline = deadline;
            base.model = deadline;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(main_template, {
                deadline: base.deadline
            });
            base.$el.html(template);
            base.setSubapp('tasks');
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".menu_button", 'click', function () {
                var elt = $(this);
                base.setSubapp(elt.attr("data-subapp"));
            });
        },
        setSubapp: function (subapp) {
            var base = this;
            base.$el.find(".pure-menu-selected").removeClass("pure-menu-selected");
            console.log(subapp);
            if (subapp == "tasks") {
                base.$el.find(".tasks_tab_button").addClass("pure-menu-selected");
                var tasks_view = new TasksView(base.deadline);
                base.$el.find(".deadlineshow_subapp_container").html(tasks_view.$el);
                tasks_view.init(base.SmartBlocks);
            } else if (subapp == "planning") {
                base.$el.find(".planning_tab_button").addClass("pure-menu-selected");
                base.$el.find(".deadlineshow_subapp_container").html("");

            } else if (subapp == "edition") {
                base.$el.find(".edition_tab_button").addClass("pure-menu-selected");
                base.$el.find(".deadlineshow_subapp_container").html('');
            }
        }
    });

    return View;
});