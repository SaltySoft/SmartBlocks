define([
    'Class'
], function (Class) {
    var WorkloadTimeline = new Class();

    WorkloadTimeline.include({
        init: function (canvas, planned_tasks) {
            var base = this;
            base.planned_tasks = planned_tasks;
            base.canvas = canvas;
            base.ctx = base.canvas.getContext('2d');
            console.log();
            base.clicked = false;
            base.mouse_pos = {x: 0, y:0};
            base.mouse_mvt = {x: 0, y:0};
            base.registerEvents();
            base.run();

            base.posx = 0;

            var now = new Date();
            var start = new Date(now.getFullYear(), 0, 0);
            var diff = now - start;
            var oneDay = 1000 * 60 * 60 * 24;
            base.day = Math.floor(diff / oneDay);

            base.posx = -base.day * 16 + 16 * 15;
            base.speedX = 0;
        },
        logic: function () {
            var base = this;

            if (base.clicked) {
                base.speedX = base.mouse_mvt.x * 2;
            } else {
                base.speedX *= 0.9;
            }
            base.posx += base.speedX;
            base.mouse_mvt.x = 0;
            base.mouse_mvt.y = 0;
        },
        draw: function () {
            var base = this;
            base.ctx.beginPath();

            base.ctx.moveTo(0, base.canvas.height - 15);
            base.ctx.lineTo(base.canvas.width, base.canvas.height - 15);

            base.ctx.stroke();
            var now = new Date();
            var offset = 0;
            base.ctx.save();
            base.ctx.translate(base.posx, 0);
            for (var i = now.getDate() - base.day; i <= now.getDate() + 365 - base.day; i++) {
                var dstart = new Date();
                dstart.setDate(i);
                dstart.setHours(0,0,0,0);
                var dend = new Date();
                dend.setDate(i);
                dend.setHours(23,59,59,10);
                var work_amount = 0;
                for (var k in base.planned_tasks.models) {
                    var planned_task = base.planned_tasks.models[k];
                    var task_start = planned_task.getStart();
                    var task_end = new Date(task_start);
                    task_end.setTime(task_start.getTime() + parseInt(planned_task.get("duration")));
                    if (task_start > dstart && task_start < dend) {
                        work_amount +=  parseInt(planned_task.get("duration"));
                    }
                }
                var height = work_amount / 3600000 * 5;
                base.ctx.fillStyle = "rgba(0,0,0,0.9)";
                if (now > dstart && now < dend) {
                    base.ctx.fillStyle = "rgba(255,0,0,0.9)";
                }
                base.ctx.beginPath();
                base.ctx.rect(offset, base.canvas.height - 15 - height, 10, height);

                var metrics = base.ctx.measureText(dstart.getDate());
                base.ctx.fillText(dstart.getDate(), offset ,  base.canvas.height);
                base.ctx.fill();
                offset += 16;
            }
            base.ctx.restore();

        },
        run: function () {
            var base = this

            base.ctx.clearRect(0,0,1000, base.canvas.height);
            base.logic();
            base.draw();

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

    return WorkloadTimeline;
});