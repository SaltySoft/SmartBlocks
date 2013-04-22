define([
    'jquery',
    'underscore',
    'backbone',
    'text!Enterprise/Apps/Schemas/Templates/text_overlay.html'
], function ($, _, Backbone, TextOverlayTemplate) {
    var TextOverlayView = Backbone.View.extend({
        tagName: "div",
        "className": "text_overlay",
        initialize: function () {

        },
        init: function (text_overlay, drawing_view) {
            var base = this;
            base.text = text_overlay;
            base.drawing_view = drawing_view;
            return base.render();
        },
        render: function () {
            var base = this;
            var template = _.template(TextOverlayTemplate, { text: base.text });

            base.$el.html(template);

            base.$el.addClass("normal");
            base.$el.css('left', base.text.get("x"));
            base.$el.css('top', base.text.get("y"));
            base.$el.attr('data-id', base.text.get("id"));
            base.$el.css("position", "absolute");
            base.$el.draggable({
                stop: function() {
                    base.text.set("x", base.$el.position().left);
                    base.text.set("y", base.$el.position().top);
                    base.text.save({}, {
//                        success: function () {
//                            base.drawing_view.save();
//                        }
                    });
                }
            });
            base.initializeEvents();
            return base.$el;
        },
        initializeEvents: function () {
            var base = this;

            var hide_controls_timer = 0;
            base.$el.mousemove(function (e) {
                clearTimeout(hide_controls_timer);
                base.$el.find(".text_overlay_edition").show();
            });
            base.$el.mouseout(function (e) {
                hide_controls_timer = setTimeout(function () {
                    base.$el.find(".text_overlay_edition").hide();
                }, 500);
            });


            base.$el.delegate("a", "click", function (e) {
                var elt = $(this);
                var text_overlay = base.$el;

                if (elt.attr("data-action") == "edit") {
                    text_overlay.find("input").val(text_overlay.find(".text_ov_content").html());
                    text_overlay.removeClass("normal");
                    text_overlay.addClass("edited");
                }

                if (elt.attr("data-action") == "save_content") {
                    var value = text_overlay.find("input").val();
                    var schema_text = base.text;
                    schema_text.set("content", value);
                    text_overlay.find(".text_ov_content").html(value);
                    text_overlay.removeClass("edited");
                    text_overlay.addClass("normal");
                    schema_text.save({}, {
                        success: function () {
//                            base.drawing_view.save();
                        }
                    });
                }

                if (elt.attr("data-action") == "delete") {
                    if (confirm("Are you sure you want to delete this text overlay ?")) {
                        base.text.destroy({
                            success: function () {
                                base.$el.remove();
                            }
                        });
                    }
                }
            });
        }
    });

    return TextOverlayView;
});