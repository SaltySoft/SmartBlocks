define([
    'jquery',
    'underscore',
    'backbone',
    'ProjectManagement/Apps/WorkingHours/Models/Project',
    'ProjectManagement/Apps/WorkingHours/Models/WorkingDuration',
    'text!ProjectManagement/Apps/WorkingHours/Templates/working_time.html',
    'ProjectManagement/Apps/WorkingHours/Collections/Projects'
], function ($, _, Backbone, Project, WorkingDuration, WorkingTimeTemplate, ProjectsCollection) {

    function getWeekNumber(d) {
        // Copy date so don't modify original
        d = new Date(d);
        d.setHours(0, 0, 0);
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        // Get first day of year
        var yearStart = new Date(d.getFullYear(), 0, 1);
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
        // Return array of year and week number
        return [d.getFullYear(), weekNo];
    }

    function isNormalInteger(str) {
        var intRegex = /^\d+$/;
        return (intRegex.test(str));
//        return /^\+?(0|[1-9]\d*)$/.test(str);
    }

    var WorkingTime = Backbone.View.extend({
        tagName:"div",
        className:"pm_workingHours_working_time",
        initialize:function () {
            var base = this;
        },
        init:function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            Date.prototype.getMonthName = function (lang) {
                lang = lang && (lang in Date.locale) ? lang : 'en';
                return Date.locale[lang].month_names[this.getMonth()];
            };

            Date.prototype.getDayName = function (lang) {
                lang = lang && (lang in Date.locale) ? lang : 'en';
                return Date.locale[lang].day_names[this.getDay()];
            };

            Date.prototype.getMonthNameShort = function (lang) {
                lang = lang && (lang in Date.locale) ? lang : 'en';
                return Date.locale[lang].month_names_short[this.getMonth()];
            };

            Date.locale = {
                en:{
                    month_names:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    month_names_short:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    day_names:['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                }
            };
            //Init notes collections
            base.projects_collection = new ProjectsCollection();

            base.actualDate = new Date();

            base.render(true);
            base.initializeEvents();
        },
        loadProjects:function () {
            var base = this;
            base.projects_collection.fetch({
                data:{
                },
                success:function () {
                    console.log("success fetching projects_collection");
                    base.render(false);
                },
                error:function () {
                    console.log("error fetching projects_collection");
                }
            });
        },
        render:function (refetch) {
            var base = this;
            if (refetch === undefined || refetch) {
                base.loadProjects();
            }
            else {
                var date = base.actualDate;
                var week_nb = getWeekNumber(date)[1];
                var monday = new Date();
                monday.setTime(date.getTime());
                monday.setDate(date.getDate() - (date.getDay() - 1));
                var tuesday = new Date();
                tuesday.setTime(date.getTime());
                tuesday.setDate(date.getDate() - (date.getDay() - 1) + 1);
                var wednesday = new Date();
                wednesday.setTime(date.getTime());
                wednesday.setDate(date.getDate() - (date.getDay() - 1) + 2);
                var thursday = new Date();
                thursday.setTime(date.getTime());
                thursday.setDate(date.getDate() - (date.getDay() - 1) + 3);
                var friday = new Date();
                friday.setTime(date.getTime());
                friday.setDate(date.getDate() - (date.getDay() - 1) + 4);
                var saturday = new Date();
                saturday.setTime(date.getTime());
                saturday.setDate(date.getDate() - (date.getDay() - 1) + 5);
                var sunday = new Date();
                sunday.setTime(date.getTime());
                sunday.setDate(date.getDate() - (date.getDay() - 1) + 6);
                var workingTimeTemplate = _.template(WorkingTimeTemplate, {
                    projects:base.projects_collection.models,
                    week_number:week_nb,
                    monday:monday,
                    tuesday:tuesday,
                    wednesday:wednesday,
                    thursday:thursday,
                    friday:friday,
                    saturday:saturday,
                    sunday:sunday
                });
                base.$el.html(workingTimeTemplate);
                base.project_deleted = false;
            }
        },
        initializeEvents:function () {
            var base = this;
            base.initializeEventsProjectManagement();
            base.initializeEventsWorkingHours();
        },
        initializeEventsProjectManagement:function () {
            var base = this;
            base.$el.delegate(".manage_projects_viewer_button", "click", function () {
                var elt = $(this);
                var content = base.$el.find(".manage_projects_content");
                if (content.css("display") == "none") {
                    base.$el.find(".manage_projects_viewer_button").html("Manage the projects you are working on (hide ↑)");
                    content.show();
                }
                else {
                    base.$el.find(".manage_projects_viewer_button").html("Manage the projects you are working on (show ↓)");
                    content.hide();
                }
            });

            base.$el.delegate(".add_project", "click", function () {
                var elt = $(this);
                var project = new Project({
                    name:"New project"
                });

                project.save({}, {
                    success:function () {
                        base.projects_collection.add(project);
                        base.render(false);
                    },
                    error:function () {
                        base.SmartBlocks.show_message("There was an error creating the project. Please try again later.");
                    }
                });
            });

            base.$el.delegate(".wh_project .project_button", "click", function () {
                var elt = $(this);
                var action = elt.attr("data-action");
                var wh_project = elt.closest(".wh_project");
                var project = base.projects_collection.get(wh_project.attr("data-pid"));

                if (action == "edit") {
                    wh_project.find(".project_name_input").val(project.get("name"));
                    wh_project.addClass("edition");
                }
                if (action == "cancel") {
                    wh_project.removeClass("edition");
                }
                if (action == "save") {
                    project.set("name", wh_project.find(".project_name_input").val());
                    project.save({}, {
                        success:function () {
                            base.render(false);
                        }
                    });
                    wh_project.find(".name_display_text").html(project.get("name"));
                    wh_project.removeClass("edition");
                }
                if (action == "delete") {
                    if (confirm("Do you want to delete this project ?")) {
                        project.destroy({
                            success:function () {
                                wh_project.remove();
                            }
                        });
                    }
                }
            });
        },
        initializeEventsWorkingHours:function () {
            var base = this;
            base.$el.delegate(".change_week_more", "click", function () {
                var newDate = new Date();
                newDate.setTime(base.actualDate.getTime());
                newDate.setDate(base.actualDate.getDate() + 7);
                base.actualDate = newDate;
                base.render(true);
            });

            base.$el.delegate(".change_week_less", "click", function () {
                var newDate = new Date();
                newDate.setTime(base.actualDate.getTime());
                newDate.setDate(base.actualDate.getDate() - 7);
                base.actualDate = newDate;
                base.render(true);
            });

            base.$el.delegate(".hours_display_td", "click", function (event) {
                event.stopPropagation();
                var elt = $(this);
                elt.addClass("editing");
                var hours_display = elt.find(".hours_display");
                var hours_edition = elt.find(".hours_edition");
                var hours_input = elt.find(".hours_input");
                var hours_nb = hours_display.html();
                if (hours_nb > 0)
                    hours_input.val(hours_display.html());
                else
                    hours_input.val("");
                hours_display.hide();
                hours_edition.show();
                hours_input.focus();
            });

            base.$el.delegate(".hours_display_td", "keydown", function (event) {
                var currentInput = event.target;
                event.stopPropagation();
                if (event.keyCode == 9) {
                    var nextInput = $(currentInput).parents(".hours_display_td").next(".hours_display_td");
                    if (nextInput !== undefined) {
                        nextInput.click();
                    }
                    else {
                        var nextInput = $(currentInput).parents("tr").next("tr").next(".hours_display_td");
                        if (nextInput !== undefined) {
                            nextInput.click();
                        }
                    }
                    event.stopPropagation();
                    return false;
                }
                if (event.keyCode == 13) {
                    $(currentInput).focusout();
                    event.stopPropagation();
                }
            });


            base.$el.delegate(".save_working_hours_button", "click", function (event) {
                base.render(true);
            });

            base.$el.delegate(".hours_input", "blur", function (event) {
                event.stopPropagation();
                console.log("hours_display blur ---------------------------");
                var elt = $(this);
                var hours_display_td = elt.parents(".hours_display_td");

                hours_display_td.removeClass("editing");
                var hours_display = hours_display_td.find(".hours_display");
                var hours_edition = hours_display_td.find(".hours_edition");
                var hours_input = hours_display_td.find(".hours_input");
                var hours_number = hours_input.val();
                if (!isNormalInteger(hours_number))
                    hours_number = 0;
                hours_display.html(hours_number);
                hours_display.show();
                hours_edition.hide();

                var working_duration = undefined;
//                console.log("base.projects_collection", base.projects_collection);
//                console.log("data-pid", hours_input.attr("data-pid"));
                var project = base.projects_collection.get(hours_input.attr("data-pid"));
                console.log("project", project);
                var wd_date = new Date();
                wd_date.setTime(hours_input.attr("data-date"));
                if (project !== undefined) {
                    var wd_id = project.getWorkingDurationIdAtDate(project, wd_date);
                    console.log("wd_id", wd_id);
                    if (wd_id != 0) {
                        console.log("wd FIND id: ", wd_id);
                        working_duration = project.get("working_durations").get(wd_id);
                        console.log("working_duration", working_duration);
                        if (hours_number <= 0) {
                            working_duration.destroy();
                        }
                        else {
                            working_duration.set("hours_number", hours_number);
                        }
                    }
                    else {
                        console.log("wd not found");
                        if (hours_number > 0) {
                            console.log("hours_number : ", hours_number);
                            working_duration = new WorkingDuration({
                                hours_number:hours_number,
                                date:wd_date.getTime() / 1000,
                                project_id:project.id
                            });
                        }
                    }
                    if (working_duration !== undefined) {
                        console.log("working_duration.save", working_duration);

                        working_duration.save({}, {
                            success:function () {
                                project.get("working_durations").push(working_duration);
//                                base.render(false);
                                console.log("success working_duration save");
                            },
                            error:function () {
                                console.log("error working_duration save");
                            }
                        });
                    }
                }
            });

            $('table tr td').hover(function () {
                $(this).addClass('odd');
            }, function () {
                $(this).removeClass('odd');
            });

            $('table tr td').click(function () {
                $(this).addClass('editing');
            }, function () {
                $(this).removeClass('editing');
            });
        }
    });

    return WorkingTime;
});