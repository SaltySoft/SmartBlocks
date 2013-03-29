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
        size: 1,
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

    var LineTool = new Class();

    LineTool.include({
        init: function (canvas, context) {
            this.canvas = canvas;
            this.context = context;
        },
        size: 1,
        drawing: false,
        color: {
            r: 0,
            g: 0,
            b: 0
        },
        orx:0,
        ory:0,
        save: "",
        mousedown: function (e) {
            var base = this;

            base.context.lineWidth = base.size;
            base.context.lineJoin = "round";

            base.save = base.canvas[0].toDataURL("image/png");
            base.image = new Image();
            base.image.src = base.save;
            base.image.onload = function() {
                base.drawing = true;
            };
            base.orx = e.pageX - base.canvas.offset().left;
            base.ory = e.pageY - base.canvas.offset().top;
        },
        mousemove: function (e) {
            var base = this;



            if (base.drawing) {
                base.context.clearRect(0, 0, base.canvas[0].width, base.canvas[0].height);
                base.context.drawImage(base.image, 0, 0);
                base.context.beginPath();

                base.context.moveTo(base.orx, base.ory);
                base.context.lineTo(e.pageX - base.canvas.offset().left, e.pageY - base.canvas.offset().top);
                base.context.stroke();
                base.context.closePath();
            }
        },
        mouseup: function (e) {
            var base = this;
            base.drawing = false;

        },
        keydown: function (e) {
            var base = this;
        },
        setSize: function (size) {
            var base = this;
            base.size = size;
        }
    });

    var RectangleTool = new Class();

    RectangleTool.include({
        init: function (canvas, context) {
            this.canvas = canvas;
            this.context = context;
        },
        size: 1,
        drawing: false,
        color: {
            r: 0,
            g: 0,
            b: 0
        },
        orx:0,
        ory:0,
        save: "",
        mousedown: function (e) {
            var base = this;

            base.context.lineWidth = base.size;
            base.context.lineJoin = "round";

            base.save = base.canvas[0].toDataURL("image/png");
            base.image = new Image();
            base.image.src = base.save;
            base.image.onload = function() {
                base.drawing = true;
            };
            base.orx = e.pageX - base.canvas.offset().left;
            base.ory = e.pageY - base.canvas.offset().top;
        },
        mousemove: function (e) {
            var base = this;



            if (base.drawing) {
                base.context.clearRect(0, 0, base.canvas[0].width, base.canvas[0].height);
                base.context.drawImage(base.image, 0, 0);
                base.context.beginPath();

                base.context.moveTo(base.orx, base.ory);
                base.context.lineTo(e.pageX - base.canvas.offset().left,  base.ory);
                base.context.lineTo(e.pageX - base.canvas.offset().left, e.pageY - base.canvas.offset().top);
                base.context.lineTo(base.orx, e.pageY - base.canvas.offset().top);
                base.context.lineTo(base.orx, base.ory);
                base.context.stroke();
                base.context.closePath();
            }
        },
        mouseup: function (e) {
            var base = this;
            base.drawing = false;

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
        size: 1,
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
        Eraser: Eraser,
        LineTool: LineTool,
        RectangleTool: RectangleTool
    };
});