define([
    'jquery',
    'Class'
], function ($, Class) {
    var WorktimeProgressBar = new Class();

    WorktimeProgressBar.include({
        init: function (canvas, start, end, width, height) {
            var base = this;
            base.canvas = canvas;
            base.worktime = worktime_object;
            base.ctx = base.canvas.getContext('2d');
            if (!width) {
                $(canvas).attr("width", $(canvas).parent().width());
            } else {
                $(canvas).attr("width", width);
            }
            if (!height) {
                $(canvas).attr("height", $(canvas).parent().height());
            } else {
                $(canvas).attr("height", height);
            }


            base.$canvas = $(canvas);
            base.registerEvents();
            base.run();
        },
        run: function () {
            var base = this;
            base.ctx.clearRect(0, 0, base.canvas.width, base.canvas.height);
            if ($(base.canvas).width() > 0) {
                base.logic();
                base.draw();
            }

            requestAnimationFrame($.proxy(base.run, base), base.canvas);
        },
        logic: function () {
            var base = this;
        },
        draw: function () {
            var base = this;

            var completed_time = base.worktime.done;
            var planned_time = base.worktime.left;
            var missing_time = base.worktime.total - (base.worktime.done + base.worktime.left);
            var required_time = base.worktime.total;

            base.planned_time = planned_time;
            base.missing_time = missing_time;
            base.completed_time = completed_time;

            var canvas = base.canvas;
            var ctx = base.ctx;

            ctx.beginPath();
            var completex = completed_time / required_time * canvas.width;
            ctx.rect(0, 0, completed_time / required_time * canvas.width, canvas.height);
            ctx.fillStyle = "whitesmoke";
            ctx.fill();

            ctx.beginPath();
            var plannedx = completex + planned_time / required_time * canvas.width;
            ctx.rect(completex, 0, planned_time / required_time * canvas.width, canvas.height);
            ctx.fillStyle = "lightgray";
            ctx.fill();
            ctx.beginPath();
            ctx.rect(plannedx, 0, missing_time / required_time * canvas.width, canvas.height);
            ctx.fillStyle = "gray";
            ctx.fill();
        },
        updateWorktime: function (worktime_object) {
            var base = this;
            base.worktime = worktime_object;
        },
        registerEvents: function () {
            var base = this;
            var elt = base.$canvas;


        }
    });

    return WorktimeProgressBar;
});