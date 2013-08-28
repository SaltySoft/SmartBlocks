define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Daily/Models/PlannedTask',
    'text!../Templates/planning.html',
    'Organization/Apps/Common/Views/TaskThumbnail',
    'jqueryui',
    'fullCalendar',
], function ($, _, Backbone, PlannedTask, planning_template, TaskThumbnail) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "planning",
        initialize: function (model) {
            var base = this;
            base.model = model;
            base.activity = model;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
        },
        render: function () {
            var base = this;

            var template = _.template(planning_template, {

            });

            base.$el.html(template);
            base.renderTasksList();
            base.renderCalendar();

        },
        renderTasksList: function () {
            var base = this;
            var tasks = base.activity.get('tasks');
            for (var k in tasks.models) {
                var task = tasks.models[k];
                var task_thumbnail = new TaskThumbnail(task);
                task_thumbnail.$el.addClass("small");
                base.$el.find(".tasks_list_container").append(task_thumbnail.$el);
                task_thumbnail.init(base.SmartBlocks);
            }
        },
        renderCalendar: function () {
            var base = this;

            var events = [];
            var tasks = base.activity.get('tasks');
            for (var k in tasks.models) {
                var task = tasks.models[k];
                var pts = task.get('planned_tasks');
                for (var i in pts.models) {
                    var planned_task = pts.models[i];
                    var start = planned_task.getStart();
                    var end = new Date(start);
                    var duration = parseInt(planned_task.get("duration"));
                    end.setTime(end.getTime() + duration);
                    events.push({
                        title: planned_task.get("content") ? planned_task.get("content") : "Untitled",
                        start: start,
                        end: end,
                        allDay: false,
                        id: planned_task.get("id"),
                        className: "planned_task_cal",
                        color: (task != null) ? base.activity.get('type').color : "gray"
                    });
                }
            }
            base.$el.find(".planning_container").html("");
            base.$el.find(".planning_container").fullCalendar({
                header: {
                    left: 'prev, next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                editable: true,
                droppable: true,
                height: 492,
                events: events,
                defaultView: "agendaWeek",
                allDaySlot: false,

                eventDrop: function (event, jsEvent, ui, view) {
                    var planned_task = base.planned_tasks.get(event.id);
                    if (planned_task) {
                        planned_task.setStart(event.start);

                        console.log(event, planned_task.getStart());
                        planned_task.save();

                    }

                },
                eventResize: function (event) {
                    var planned_task = base.planned_tasks.get(event.id);

                    if (planned_task) {
                        planned_task.setStart(event.start);
                        planned_task.set("duration", event.end.getTime() - event.start.getTime());

                        console.log(event, planned_task.getStart());

                        planned_task.save({}, {
                            success: function () {
                                base.parent.events.trigger("updated_planned_task");
                            }
                        });

                    }

                },
                eventClick: function (event, e) {
                    var elt = $(this);
                    $(".planned_task_popup").remove();

                    var planned_task = base.planned_tasks.get(event.id);
                    if (planned_task) {
                        var popup = new PlannedTaskPopup(planned_task);
                        popup.init(base.SmartBlocks, e, event);

                        popup.events.on("deleted", function () {
                            base.$el.fullCalendar( 'removeEvents', event.id)
                            base.parent.events.trigger("updated_planned_task");
                        });
                        popup.events.on("saved", function (event) {
                            base.$el.fullCalendar( 'updateEvent', event)
                            base.parent.events.trigger("updated_planned_task");
                        });
                    }
                },
                dayClick: function(date, allDay, jsEvent, view) {

                    if (allDay) {
                        alert('Clicked on the entire day: ' + date);
                    }else{
                       var planned_task = new PlannedTask();
                        planned_task.setStart(date);
                        planned_task.set('content', 'New planned task');
                        planned_task.set('task', base.activity.get('tasks').models[0]);
                        planned_task.set("duration", 3600000);
                        planned_task.save({}, {
                            success: function () {
                                base.activity.fetch({
                                    success: function () {
                                        base.renderCalendar();
                                    }
                                });
                            }
                        });


                    }

                }
            });
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});