define([
    'jquery',
    'underscore',
    'backbone',
    'Class'
], function ($, _, Backbone, Class) {
    var base = this;

    var initialize = function (SmartBlocks, context) {

    };

    var Brush = new Class();

    Brush.include({
        init: function (canvas, context) {
            this.canvas = canvas;
            this.context = context;
        },
        size: 12,
        drawing: false,
        color: {
            r: 0,
            g: 0,
            b: 0
        },
        mousedown: function (e) {
            var base = this;
            base.drawing = true;
            base.context.lineWidth = base.size;
            base.context.lineJoin = "round";
            base.context.beginPath();
        },
        mousemove: function (e) {
            var base = this;
            if (base.drawing) {
                base.context.lineTo(e.pageX - base.canvas.offset().left, e.pageY - base.canvas.offset().top);
                base.context.stroke();
            }
        },
        mouseup: function (e) {
            var base = this;
            base.drawing = false;
            base.context.closePath();
        },
        keydown: function (e) {
            var base = this;
        },
        setSize: function (size) {
            var base = this;
            base.size = size;
        }
    });

    var Eraser = new Class();

    Eraser.include({
        init: function (canvas, context) {
            this.canvas = canvas;
            this.context = context;

        },
        size: 15,
        drawing: false,
        mousedown: function (e) {
            var base = this;
            base.drawing = true;
//            base.context.lineWidth = 15;
            base.context.beginPath();

        },
        mousemove: function (e) {
            var base = this;
            if (base.drawing) {
                base.context.lineTo(e.pageX - base.canvas.offset().left, e.pageY - base.canvas.offset().top);

                base.context.stroke();
            }
        },
        mouseup: function (e) {
            var base = this;
            base.drawing = false;
            base.context.closePath();
        },
        keydown: function (e) {
            var base = this;
        },
        setSize: function (size) {
            base.size = size;
        }
    });



    return {
        init: initialize,
        Brush: Brush,
        Eraser: Eraser
    };
});