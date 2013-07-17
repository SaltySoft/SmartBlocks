define([
    'Class',
    './Button'
], function (Class, Button) {
    var WorkloadTimeline = new Class();

    WorkloadTimeline.include({
        init: function (canvas, planned_tasks, total_amount, deadline, start) {
            var base = this;
            base.planned_tasks = planned_tasks;
            base.canvas = canvas;
            base.ctx = base.canvas.getContext('2d');
            base.total_amount = total_amount;
            base.clicked = false;
            base.mouse_pos = {x: 0, y:0};
            base.mouse_mvt = {x: 0, y:0};
            base.buttons = [];
            base.daywidth = 30;
            base.deadline = deadline;
            base.start = start;

            base.buttons.push(new Button(base, "<<", 10, 10, 50, 20, function () {
                base.speedX = 20;
            }));

            base.buttons.push(new Button(base, ">>", 70, 10, 50, 20, function () {
                base.speedX -= 20;
            }));

            base.registerEvents();
            base.run();

            base.posx = 0;

            var now = new Date();
            var start = new Date(now.getFullYear(), 0, 0);
            var diff = now - start;
            var oneDay = 1000 * 60 * 60 * 24;
            base.day = Math.floor(diff / oneDay);
            base.originx = -101 * (base.daywidth + 1) + (base.daywidth + 1) * (base.canvas.width / base.daywidth / 2);
            base.posx = 0;
            base.speedX = 0;
        },
        logic: function () {
            var base = this;

            if (base.clicked) {
                base.speedX = base.mouse_mvt.x;
            } else {
                base.speedX *= 0.9;
                base.posx *= 0.99;
            }
            base.posx += base.speedX;
            base.mouse_mvt.x = 0;
            base.mouse_mvt.y = 0;

            for (var k in base.buttons) {
                base.buttons[k].logic();
            }
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
            base.ctx.translate(base.posx + base.originx, 0);
            var burndown = [];
            var worked = 0
            for (var i = now.getDate() - 100; i <= now.getDate() + 100; i++) {
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

                if (now > dstart && now < dend) {
                    base.ctx.fillStyle = "rgba(0,0,0,0.05)";
                    base.ctx.beginPath();
                    base.ctx.rect(offset, 0, base.daywidth, base.canvas.height);
                    base.ctx.fill();
                }
                if (base.deadline) {
                    if (base.deadline > dstart && base.deadline < dend) {
                        base.ctx.fillStyle = "rgba(255,0,0,0.1)";
                        base.ctx.beginPath();
                        base.ctx.rect(offset, 0, base.daywidth, base.canvas.height);
                        base.ctx.fill();
                    }
                }

                base.ctx.fillStyle = "rgba(0,0,0,0.9)";
                base.ctx.beginPath();
                base.ctx.rect(offset, base.canvas.height - 15 - height, base.daywidth, height);


                var hours =work_amount / 3600000;
                if (Math.round(hours) == hours) {
                    hours = Math.round(hours);
                } else {
                    hours = hours.toFixed(1);
                }
                if (hours > 0) {
                    var metrics = base.ctx.measureText(hours + "h");
                    base.ctx.fillText(hours + "h", offset + base.daywidth / 2 - metrics.width / 2,  base.canvas.height - 15 - height - 3);
                }
                var metrics = base.ctx.measureText(dstart.getDate());
                base.ctx.fillText(dstart.getDate(), offset + base.daywidth / 2 - metrics.width / 2 ,  base.canvas.height);
                base.ctx.fill();
                worked += work_amount;

                if (!base.start || base.start < dend) {
                    burndown.push({
                        x: offset + 7,
                        worked: worked
                    });
                }
                offset += base.daywidth + 1;
            }
            base.ctx.beginPath();
            base.ctx.fillStyle = "rgba(255,150,0,0.5)";
            if (burndown.length > 0) {
                base.ctx.moveTo(burndown[0].x,(base.canvas.height - 15));
                for (var k in burndown) {

                    base.ctx.lineTo(burndown[k].x, (base.canvas.height - 15) - worked / 3600000 * 5 + burndown[k].worked / 3600000 * 5)
                }
            }
            base.ctx.closePath();
            base.ctx.stroke();
            base.ctx.fill();


            base.ctx.restore();
            for (var k in base.buttons) {
                base.buttons[k].draw();
            }

        },
        run: function () {
            var base = this

            base.ctx.clearRect(0,0,1000, base.canvas.height);
            base.logic();
            base.draw();
            if ($(base.canvas).height() > 0) {
                requestAnimationFrame($.proxy(base.run, base), base.canvas);
            }

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