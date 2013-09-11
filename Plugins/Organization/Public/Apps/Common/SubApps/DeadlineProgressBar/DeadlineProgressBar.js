define([
    'Class'
], function (Class) {
    var DeadlineProgressBar = new Class();

    DeadlineProgressBar.include({
        init: function (canvas, task) {
            var base = this;
            base.canvas = canvas;
            base.task = task;
            base.ctx = base.canvas.getContext('2d');
//            base.registerEvents();
            base.run();
        },
        logic: function () {
            var base = this;
        },
        draw: function () {
            var base = this;

            var planned_tasks = base.task.get("planned_tasks").models;
            var completed_time = 0;
            var planned_time = 0;
            var missing_time = 0;
            var required_time = base.task.get("required_time");

            var now = new Date();


            for (var k in planned_tasks) {
                var pt = planned_tasks[k];
                var start = pt.getStart();
                var end = new Date(start);
                var duration = parseInt(pt.get("duration"));
                end.setTime(end.getTime() + duration);

                if (now > start) {
                    if (now < end) {
                        completed_time += now.getTime() - start.getTime();
                        planned_time += end.getTime() - now.getTime();
                    } else {
                        completed_time += duration;
                    }
                } else {
                    planned_time += duration;
                }
            }
            missing_time = required_time - planned_time - completed_time;
            missing_time = missing_time < 0 ? 0 : missing_time;

            base.planned_time = planned_time;
            base.missing_time = missing_time;
            base.completed_time = completed_time;

            var canvas = base.canvas;
            var ctx = base.ctx;

            ctx.beginPath();
            var completex = completed_time / required_time * canvas.width;
            ctx.rect(0, 0, completed_time / required_time * canvas.width, canvas.height);
            ctx.fillStyle = "#3da02b";
            ctx.fill();
            ctx.fillStyle = "white";
//            var metrics = ctx.measureText(completed_time / 3600000);
//            if (completed_time / required_time * canvas.width > 20)
//                ctx.fillText((completed_time / 3600000).toFixed(1), completex / 2, canvas.height / 2 - 3);


            ctx.beginPath();
            var plannedx = completex + planned_time / required_time * canvas.width;
            ctx.rect(completex, 0, planned_time / required_time * canvas.width, canvas.height);
            ctx.fillStyle = "#1d7373";
            ctx.fill();
            ctx.fillStyle = "white";
//            var metrics = ctx.measureText(planned_time / 3600000);
//            if (planned_time / required_time * canvas.width > 20)
//                ctx.fillText((planned_time / 3600000).toFixed(1), planned_time / required_time * canvas.width / 2 + completex, canvas.height / 2 - 3);

            ctx.beginPath();
            ctx.rect(plannedx, 0, missing_time / required_time * canvas.width, canvas.height);
            ctx.fillStyle = "#a62000";
            ctx.fill();
//            ctx.fillStyle = "white";
//            var metrics = ctx.measureText(missing_time / 3600000);
//            if (planned_time / required_time * canvas.width > 20)
//                ctx.fillText((missing_time / 3600000).toFixed(1), missing_time / required_time * canvas.width / 2 + plannedx, canvas.height / 2 - 3);
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
        registerEvents: function () {
            var base = this;
            var $c = $(base.canvas);
            $c.mousedown(function () {
                base.clicked = true;
            });

            $(document).mouseup(function () {
                base.clicked = false;
            });

            $c.mousemove(function (e) {
                var x = e.pageX - $c.offset().left;
                var y = e.pageY - $c.offset().top;
                base.mouse_mvt.x = x - base.mouse_pos.x;
                base.mouse_mvt.y = y - base.mouse_pos.y;

                base.mouse_pos.x = x;
                base.mouse_pos.y = y;
            });
        }
    });

    return DeadlineProgressBar;
});