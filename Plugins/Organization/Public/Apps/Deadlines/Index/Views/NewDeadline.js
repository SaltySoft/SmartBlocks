define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/new_deadline_btn.html'
], function ($, _, Backbone, new_ddl_tpl) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "deadline_show_container new",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(new_ddl_tpl, {});
            base.$el.html(template);
        },
        expand: function () {
            var base = this;

            if (base.$el.hasClass("expanded")) {
               base.retract();
            } else {
                base.$el.parent().find(".expanded").removeClass("expanded");
                base.$el.addClass("expanded");
                base.$el.find(".deadline_body").slideDown(200);
                var transform_n = -parseInt(base.$el.position().top - parseInt(base.$el.parent().css("margin-top")));
                var transform = "translateY(-" + parseInt(base.$el.position().top) + "px)";
                base.$el.parent().animate({'margin-top': transform_n}, 200);
            }


        },
        retract: function () {
            var base = this;
            base.$el.removeClass("expanded");
            base.$el.parent().animate({'margin-top': 0}, 200);
            base.$el.parent().find(".deadline_body").slideUp(200);
        },
        registerEvents: function () {
            var base = this;

            base.$el.delegate(".deadline_header", "click", function () {
                base.expand();
            });

            base.$el.delegate("form", "submit", function () {
                if (base.$el.hasClass("expanded")) {
                    base.retract();
                }
            });

            base.$el.delegate("form", 'reset', function () {
                base.retract();
            });


        }
    });

    return View;
});