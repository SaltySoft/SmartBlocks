define([
    'jquery',
    'underscore',
    'backbone',
    'Organization/Apps/Daily/Models/PlannedTask',
    'text!../Templates/planning.html',
    'Organization/Apps/Common/Views/TaskThumbnail',
    'Organization/Apps/Planning/Views/PlannedTaskPopup',
    'Organization/Apps/Daily/Collections/PlannedTasks',
    'jqueryui',
    'fullCalendar',
], function ($, _, Backbone, PlannedTask, planning_template, TaskThumbnail, PlannedTaskPopup, PlannedTasksCollection) {
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
            var tasks = base.activity.getTasks();
            for (var k in tasks.models) {
                var task = OrgApp.tasks.get(tasks.models[k].get('id'));
                var task_thumbnail = new TaskThumbnail(task);
                task_thumbnail.$el.addClass("small");
                task_thumbnail.$el.draggable({
                    appendTo: 'body',
                    containment: 'window',
                    scroll: false,
                    helper: 'clone',
                    revert: true
                });
                base.$el.find(".tasks_list_container").append(task_thumbnail.$el);

                task_thumbnail.init(base.SmartBlocks);
            }
            base.$el.find(".tasks_list_container").css("width", tasks.models.length * 180);
        },
        renderCalendar: function () {
            var base = this;

            var events = [];
            var tasks = base.activity.get('tasks');
            base.planned_tasks = new PlannedTasksCollection();
            for (var k in tasks.models) {
                var task = tasks.models[k];
                var pts = task.get('planned_tasks');
                for (var i in pts.models) {
                    var planned_task = pts.models[i];
                    base.planned_tasks.add(planned_task);
                }
            }

            for (var k in OrgApp.planned_tasks.models) {
                var planned_task = OrgApp.planned_tasks.models[k];
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
                    color: (base.activity.get('tasks').get(planned_task.get('task').get('id'))) ? base.activity.get('type').get('color') : "gray"
                });
            }

            base.$el.find(".planning_container").html("");
            base.planning = base.$el.find(".planning_container");
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
                    var planned_task = OrgApp.planned_tasks.get(event.id);
                    var task = OrgApp.tasks.get(planned_task.get('task').get('id'));
                    if (planned_task) {
                        planned_task.setStart(event.start);

                        console.log(event, planned_task.getStart());
                        planned_task.save({}, {
                            success: function () {
                                OrgApp.events.trigger("updated_planned_task");
                            }
                        });

                        task.get('planned_tasks').get(planned_task.get('id')).set(planned_task.attributes);
                    }

                },
                eventResize: function (event) {
                    var planned_task = OrgApp.planned_tasks.get(event.id);
                    var task = OrgApp.tasks.get(planned_task.get('task').get('id'));
                    if (planned_task) {
                        planned_task.setStart(event.start);
                        planned_task.set("duration", event.end.getTime() - event.start.getTime());

                        console.log(event, planned_task.getStart());

                        planned_task.save({}, {
                            success: function () {
                                OrgApp.events.trigger("updated_planned_task");

                            }
                        });
                        task.get('planned_tasks').get(planned_task.get('id')).set(planned_task.attributes);
                    }

                },
                drop: function (date, allDay, jsEvent, ui) { // this function is called when something is dropped

                    // retrieve the dropped element's stored Event Object
                    var originalEventObject = $(this).data('eventObject');

                    // we need to copy it, so that multiple events don't have a reference to the same object
                    var copiedEventObject = $.extend({}, originalEventObject);

                    // assign it the date that was reported
                    copiedEventObject.start = date;
                    console.log(date);
                    if (allDay) {
                        date.setHours(12);
                    }
                    var end = new Date(date);

                    end.setHours(end.getHours() + 1);
                    copiedEventObject.end = end;
                    console.log(end);
                    copiedEventObject.allDay = false;
                    copiedEventObject.editable = true;
                    copiedEventObject.className = "planned_task_cal";
                    copiedEventObject.color = base.activity.get('type').get('color');
                    console.log(copiedEventObject);
                    // render the event on the calendar
                    // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)



                    var planned_task = new PlannedTask();
                    var task = OrgApp.tasks.get($(this).attr("id"));
                    planned_task.setStart(date);
                    planned_task.set("duration", 3600000);
                    planned_task.set("content", task.get("name"));
                    planned_task.set("task", task);

                    planned_task.save({}, {
                        success: function () {
                            copiedEventObject.id = planned_task.get("id");
                            copiedEventObject.title = task.get('name');
                            copiedEventObject.color = (task.get("activity") != null) ? task.get("activity").type.color : "gray";
                            base.$el.fullCalendar('renderEvent', copiedEventObject);
                            task.get('planned_tasks').add(planned_task);
                            base.planning.fullCalendar('renderEvent', copiedEventObject);
                            console.log(copiedEventObject);
                            OrgApp.planned_tasks.add(planned_task);
                            task.get("planned_tasks").add(planned_task);
                            task.save();

                        }
                    });
                },
                eventClick: function (event, e) {
                    var elt = $(this);
                    $(".planned_task_popup").remove();
                    var planned_task = OrgApp.planned_tasks.get(event.id);
                    var task = OrgApp.tasks.get(planned_task.get('task').get('id'));
                    if (planned_task) {
                        var popup = new PlannedTaskPopup(planned_task);
                        popup.init(base.SmartBlocks, e, event);

                        popup.events.on("deleted", function () {
                            base.planning.fullCalendar( 'removeEvents', event.id)
                            OrgApp.events.trigger("updated_planned_task");
                            task.get('planned_tasks').remove(planned_task);
                        });
                        popup.events.on("saved", function (event) {
                            base.planning.fullCalendar( 'updateEvent', event)
                            OrgApp.events.events.trigger("updated_planned_task");
                        });
                    }

                }
//                dayClick: function(date, allDay, jsEvent, view) {
//
//                    if (allDay) {
//                        alert('Clicked on the entire day: ' + date);
//                    }else{
//                       var planned_task = new PlannedTask();
//                        planned_task.setStart(date);
//                        planned_task.set('content', 'New planned task');
//                        planned_task.set('task', base.activity.get('tasks').models[0]);
//                        planned_task.set("duration", 3600000);
//                        planned_task.save({}, {
//                            success: function () {
//                                base.activity.fetch({
//                                    success: function () {
//                                        base.renderCalendar();
//                                    }
//                                });
//                            }
//                        });
//                    }
//                }
            });
        },
        registerEvents: function () {
            var base = this;
        }
    });

    return View;
});