define([
    'jquery',
    'underscore',
    'backbone',
    'text!Enterprise/Apps/Schemas/Templates/draw_view.html',
    'Enterprise/Apps/Schemas/Business/Tools',
    'ColorPicker'
], function ($, _, Backbone, DrawTemplate, Tools) {
    var DrawView = Backbone.View.extend({
        tagName: "div",
        className: "ent_sch_drawview",
        tools: {

        },
        current_tool: undefined,
        initialize: function () {

        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.render();
        },
        render: function () {
            var base = this;
            var template = _.template(DrawTemplate, {});

            base.$el.html(template);

            base.canvas = base.$el.find('#ent_sch_dv_canvas');
            if (!base.canvas) {
                return;
            }

            base.context = base.canvas[0].getContext('2d');
            if (!base.context) {
                return;
            }
            var colorpicker = base.$el.find(".ent_sch_dv_colorpicker");
            var slider = colorpicker.find(".slider")[0];
            var picker = colorpicker.find(".picker")[0];
            colorpicker.append(slider, picker);

            ColorPicker(
                slider,
                picker,
                function (hex, hsv, rgb) {
                    var color = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b +')';
                    base.$el.find(".color_chooser").css("background-color", color);
                    base.context.strokeStyle = color;
                });
            base.initializeEvents();
        },
        initializeEvents: function () {
            var base = this;
            base.drawing = false;

            var brush = new Tools.Brush(base.canvas, base.context);
            base.tools.brush = brush;
            base.current_tool = base.tools.brush;

            base.$el.find(".ent_sch_dv_toolsize").val(base.current_tool.size);

            var hide_colors_timer = 0;
            base.$el.find(".ent_sch_dv_colorpicker").mouseover(function () {
                clearTimeout(hide_colors_timer);
            });

            base.$el.find(".ent_sch_dv_colorpicker").mouseout(function () {
                clearTimeout(hide_colors_timer);
                hide_colors_timer = setTimeout(function () {
                    base.$el.find(".ent_sch_dv_colorpicker").hide();
                }, 500);
            });

            base.$el.find(".color_chooser").click(function () {
                base.$el.find(".ent_sch_dv_colorpicker").show();
            });

            base.$el.find(".ent_sch_dv_toolsize").change(function () {
                var elt = $(this);
                base.current_tool.setSize(elt.val());
                alert(base.current_tool.size());
            });

            base.canvas.mousedown(function (e) {
                base.current_tool.mousedown(e);
            });

            base.canvas.mousemove(function (e) {
                base.current_tool.mousemove(e);
            });

            base.canvas.mouseup(function (e) {
                base.current_tool.mouseup(e);
            });

            base.$el.find(".ent_sch_dv_save_button").click(function () {
                var myImage = base.canvas[0].toDataURL("image/png");
                console.log(myImage);
                $.ajax({
                    url: "/Enterprise/Schemas/share",
                    type: "post",
                    data: {
                        image: myImage
                    },
                    success: function () {
                        console.log("sent");
                    }
                });
            });



        }

    });

    return DrawView;
});