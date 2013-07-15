define([
    'Class'
], function (Class) {
    var Button = new Class();

    Button.include({
        init: function (app, text, x, y, width, height, callback) {
            var base = this;
            base.app = app;

            base.x = x;
            base.y = y;
            base.width = width;
            base.height = height;
            base.clicked = false;
            base.callback = callback;
            base.text = text;
        },
        logic: function () {
            var base = this;
            var mouse_pos = base.app.mouse_pos;
            if (base.app.clicked &&
                mouse_pos.x > base.x && mouse_pos.x < base.x + base.width &&
                mouse_pos.y > base.y && mouse_pos.y < base.y + base.height) {

                if (!base.clicked) {
                    base.clicked = true;
                    base.app.clicked = false;
                    base.callback();
                }

            } else {
                base.clicked = false;
            }
        },
        draw: function () {
            var base = this;

            var ctx = base.app.ctx;

            ctx.beginPath();
            ctx.rect(base.x, base.y, base.width, base.height);
            if (!base.clicked)
                ctx.fillStyle = "rgba(255,0,0,0.5)";
            else
                ctx.fillStyle = "rgba(0,255,0,0.5)";
            ctx.fill();
            ctx.fillStyle = "rgba(255,255,255, 1)";
            ctx.font = "20px";
            var metrics = ctx.measureText(base.text);
            ctx.fillText(base.text, base.x + base.width / 2 - metrics.width / 2, base.y + base.height / 2 + 5);

        }
    });

    return Button;
});