define([
    'jquery',
    'underscore',
    'backbone',
    'text!../../Templates/Timeline/timeline.html',
    'Organization/Apps/Planning/Views/PlannedTaskPopup',
    './Descriptor'
], function ($, _, Backbone, timeline_tpl, PlannedTaskPopup, DescriptorView) {
    var View = Backbone.View.extend({
        tagName: "div",
        className: "desk_timeline_view fullheight",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;

            base.render();
            base.registerEvents();
        },
        render: function () {
            var base = this;

            var template = _.template(timeline_tpl, {});
            base.$el.html(template);

            base.$el.find(".descriptor_container_top").addClass("disabled");
            var firstHour = new Date().getUTCHours() - 5;
            base.events = [];
            for (var k in OrgApp.planned_tasks.models) {
                var planned_task = OrgApp.planned_tasks.models[k];
                var start = planned_task.getStart();
                var end = new Date(start);
                var duration = parseInt(planned_task.get("duration"));
                end.setTime(end.getTime() + duration);
                var event = {
                    title: planned_task.get("content") ? planned_task.get("content") : "Untitled",
                    start: start,
                    end: end,
                    allDay: false,
                    id: planned_task.get("id"),
                    className: "planned_task_cal",
                    color: (planned_task.get("task").get("activity") != null) ? planned_task.get("task").get("activity").type.color : "gray"
                };
                base.events.push(event);
            }

            base.$el.find(".calendar_container").fullCalendar({
                header: {
                    left:   'title',
                    center: '',
                    right:  'today prev,next'
                },
                editable: true,
                droppable: true,
                events: base.events,
                defaultView: "agendaDay",
                allDaySlot: false,
                height: 550,
                firstHour: firstHour,
                drop: function (date, allDay, jsEvent, ui) { // this function is called when something is dropped

                    // retrieve the dropped element's stored Event Object
                    var originalEventObject = $(this).data('eventObject');

                    // we need to copy it, so that multiple events don't have a reference to the same object
                    var copiedEventObject = $.extend({}, originalEventObject);

                    // assign it the date that was reported
                    copiedEventObject.start = date;
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
                    // render the event on the calendar
                    // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)


                    var planned_task = new PlannedTask();
                    var task = OrgApp.parent.tasks.get($(this).attr("id"));
                    planned_task.setStart(date);
                    planned_task.set("duration", 3600000);
                    planned_task.set("content", task.get("name"));
                    planned_task.set("task", task);
                    planned_task.save({}, {
                        success: function () {
                            copiedEventObject.id = planned_task.get("id");
                            copiedEventObject.color = (task.get("activity") != null) ? task.get("activity").type.color : "gray";
                            base.$el.fullCalendar('renderEvent', copiedEventObject);
                            base.planned_tasks.add(planned_task);
                            base.parent.events.trigger("updated_planned_task", planned_task);
                        }
                    });


                },
                eventDrop: function (event, jsEvent, ui, view) {
                    var planned_task = OrgApp.planned_tasks.get(event.id);
                    if (planned_task) {
                        planned_task.setStart(event.start);

                        console.log(event, planned_task.getStart());
                        planned_task.save();

                    }

                },
                eventResize: function (event) {
                    var planned_task = OrgApp.planned_tasks.get(event.id);

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
//                    var planned_task = OrgApp.planned_tasks.get(event.id);
//                    if (planned_task) {
//                        var popup = new PlannedTaskPopup(planned_task);
//                        popup.init(base.SmartBlocks, e, event);
//
//                        popup.events.on("deleted", function () {
//                            base.$el.fullCalendar( 'removeEvents', event.id)
//                            base.parent.events.trigger("updated_planned_task");
//                        });
//                        popup.events.on("saved", function (event) {
//                            base.$el.fullCalendar( 'updateEvent', event)
//                            base.parent.events.trigger("updated_planned_task");
//                        });
//                    }

                },
                eventRender: function (event, element) {
                    var elt = $(element);
                    elt.mouseup(function (e) {
                        if (e.which == 1) {
                            if (!elt.hasClass("selected")) {
                                base.$el.find(".selected").removeClass("selected");
                                elt.addClass("selected");
                                base.planned_task = OrgApp.planned_tasks.get(event.id);
                                base.$el.find(".descriptor_container_top").removeClass("disabled");
                                base.renderDescriptor();

                            } else {
                                base.$el.find(".selected").removeClass("selected");
                                base.planned_task = undefined;
                                base.$el.find(".descriptor_container_top").addClass("disabled");
                            }
                        }
                    });
                }
            });
        },
        renderDescriptor: function () {
            var base = this;
            if (base.planned_task) {
                var descriptor_view = new DescriptorView(base.planned_task);
                base.$el.find('.descriptor_container').html(descriptor_view.$el);
                descriptor_view.init(base.SmartBlocks);
            }
        },
        update: function () {
            //Check if current planned task. If no event selected, show it in descriptor.
        },
        registerEvents: function () {
            var base = this;


        }
    });

    return View;
});