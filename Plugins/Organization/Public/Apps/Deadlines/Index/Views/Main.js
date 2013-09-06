define([
    'jquery',
    'underscore',
    'backbone',
    './Deadline',
    'text!../Templates/main.html',
    'text!../Templates/new_deadline_btn.html'
], function ($, _, Backbone, DeadlineShow, main_template, new_dl_btn_tpl) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "deadlines_index",
        initialize: function (deadlines) {
            var base = this;
            base.deadlines = deadlines;

            base.current_page = 1;
            base.page_count = 0;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(main_template, {

            });

            var new_deadline_button = _.template(new_dl_btn_tpl, {});

            base.$el.html(template);



            for (var k in base.deadlines.models) {
                var deadline_view = new DeadlineShow(base.deadlines.models[k]);
                base.$el.find(".deadlines_container").append(deadline_view.$el);
                deadline_view.init(base.SmartBlocks, {
                    show_activity: base.activity === undefined
                });
            }

            base.$el.find();
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".deadline_header", "click", function() {
                base.$el.find(".deadline_body").hide();
                base.$el.find(".deadline_show").removeClass("expanded");
                base.$el.find(".deadline_show").css("transform", "none");
            });
        }
    });

    return View;
});