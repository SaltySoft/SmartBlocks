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
        init: function (DrawingView) {
            this.canvas = DrawingView.canvas;
            this.context = DrawingView.context;
            this.drawing_view = DrawingView;
        },
        size: 1,
        drawing: false,
        color: {
            r: 0,
            g: 0,
            b: 0
        },
        live_sharable: true,
        mousedown: function (e, x, y) {
            var base = this;
            base.drawing = true;
            base.context.lineWidth = base.size;
            base.context.lineJoin = "round";
            base.context.lineCap = 'round';
            var posx = 0;
            var posy = 0;
            if (x !== undefined && y !== undefined){
                posx = x;
                posy = y;
            } else {
                posx = e.pageX - base.canvas.offset().left;
                posy = e.pageY - base.canvas.offset().top;
            }
            base.orx = posx;
            base.ory = posy;
        },
        mousemove: function (e, x, y) {

            var base = this;
            base.context.beginPath();
            base.context.moveTo(base.orx, base.ory);
            var posx = 0;
            var posy = 0;
            if (x !== undefined && y !== undefined){
                posx = x;
                posy = y;
            } else {
                posx = e.pageX - base.canvas.offset().left;
                posy = e.pageY - base.canvas.offset().top;
            }


            if (base.drawing) {
                base.context.lineTo(posx, posy);
                base.context.stroke();
            }
            base.context.closePath();
            base.orx = posx;
            base.ory = posy;
        },
        mouseup: function (e, x, y) {
            var base = this;
            base.drawing = false;

//            base.drawing_view.setImage();
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
        init: function (DrawingView) {
            this.canvas = DrawingView.canvas;
            this.context = DrawingView.context;
            this.drawing_view = DrawingView;
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
        mousedown: function (e, x, y) {
            var base = this;

            base.context.lineWidth = base.size;
            base.context.lineJoin = "round";
            base.context.lineCap = 'round';
            base.drawing = true;
            var posx = 0;
            var posy = 0;
            if (x !== undefined && y !== undefined){
                posx = x;
                posy = y;
            } else {
                posx = e.pageX - base.canvas.offset().left;
                posy = e.pageY - base.canvas.offset().top;
            }

            base.orx = posx;
            base.ory = posy;
        },
        mousemove: function (e, x, y) {
            var base = this;

            var posx = 0;
            var posy = 0;
            if (x !== undefined && y !== undefined){
                posx = x;
                posy = y;
            } else {
                posx = e.pageX - base.canvas.offset().left;
                posy = e.pageY - base.canvas.offset().top;
            }

            if (base.drawing) {
                base.drawing_view.resetImage();
                base.context.beginPath();

                base.context.moveTo(base.orx, base.ory);
                base.context.lineTo(posx, posy);
                base.context.stroke();
                base.context.closePath();
            }
        },
        mouseup: function (e,x ,y) {
            var base = this;
            base.drawing = false;
            var posx = 0;
            var posy = 0;
            if (x !== undefined && y !== undefined){
                posx = x;
                posy = y;
            } else {
                posx = e.pageX - base.canvas.offset().left;
                posy = e.pageY - base.canvas.offset().top;
            }
//            base.drawing_view.setImage();
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
        init: function (DrawingView) {
            this.canvas = DrawingView.canvas;
            this.context = DrawingView.context;
            this.drawing_view = DrawingView;
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
        mousedown: function (e, x, y) {
            var base = this;

            base.context.lineWidth = base.size;
            base.context.lineJoin = "round";
            base.context.lineCap = 'round';

            base.drawing = true;

            var posx = 0;
            var posy = 0;
            if (x !== undefined && y !== undefined){
                posx = x;
                posy = y;
            } else {
                posx = e.pageX - base.canvas.offset().left;
                posy = e.pageY - base.canvas.offset().top;
            }

            base.orx = posx;
            base.ory = posy;
        },
        mousemove: function (e, x ,y) {
            var base = this;

            var posx = 0;
            var posy = 0;
            if (x !== undefined && y !== undefined){
                posx = x;
                posy = y;
            } else {
                posx = e.pageX - base.canvas.offset().left;
                posy = e.pageY - base.canvas.offset().top;
            }

            if (base.drawing) {
                console.log("drawing");
                base.drawing_view.resetImage();
                base.context.beginPath();
                base.context.moveTo(base.orx, base.ory);
                base.context.lineTo(posx,  base.ory);
                base.context.lineTo(posx, posy);
                base.context.lineTo(base.orx, posy);
                base.context.lineTo(base.orx, base.ory);
                base.context.stroke();
                base.context.closePath();
            }
        },
        mouseup: function (e,x,x) {
            var base = this;
            base.drawing = false;
//            base.drawing_view.setImage();

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
        init: function (DrawingView) {
            this.canvas = DrawingView.canvas;
            this.context = DrawingView.context;
            this.drawing_view = DrawingView;
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