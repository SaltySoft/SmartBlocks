define([
    'jquery'
], function ($) {

    var InputHandler = function (canvas) {

    };
    InputHandler.prototype = {
        init: function (timeline, canvas) {
            var base = this;

            base.timeline = timeline;

            base.cv = canvas;
            base.$cv = $(canvas);

            base.mouse_pressed = {};
            base.keyboard_presssed = {};

            base.mouse = {
                x: 0,
                y: 0,
                dx: 0,
                dy: 0,
                moved: false
            };

            base.$cv.mousedown(function (e) {

                base.mouse_pressed[e.which] = true;
            });

            base.$cv.mouseup(function (e) {
                base.mouse_pressed[e.which] = false;
            });

            base.$cv.mousemove(function (e) {

                var x = e.pageX - base.$cv.offset().left - base.timeline.offset_x;
                var y = e.pageY - base.$cv.offset().top;

                if (base.mouse.moved) {
                    base.mouse.dx =  - base.mouse.x + x;
                    base.mouse.dy = - base.mouse.y + y;
                } else {
                    base.mouse.dx = 0;
                    base.mouse.dy = 0;
                    base.mouse.moved = true;
                }
                base.mouse.x = x;
                base.mouse.y = y;
            });

            $(document).keydown(function (e) {
                base.keyboard_presssed[e.keyCode] = true;
            });

            $(document).keyup(function (e) {
                base.keyboard_presssed[e.keyCode] = false;
            });
        },
        keyPressed: function (keycode) {
            var base = this;
            return base.keyboard_presssed[keycode] !== undefined &&  base.keyboard_presssed[keycode] == true;
        },
        mousePressed: function (button_nb) {
            var base = this;
            return base.mouse_pressed[button_nb] !== undefined &&  base.mouse_pressed[button_nb] == true;
        },
        getMouse: function () {
            var base = this;
            return {
                x: base.mouse.x,
                y: base.mouse.y,
                dx: base.mouse.dx,
                dy: base.mouse.dy
            };
        },
        run: function () {
            var base = this;
            base.mouse.dx = 0;
            base.mouse.dy = 0;
        }
    };

    return InputHandler;
});