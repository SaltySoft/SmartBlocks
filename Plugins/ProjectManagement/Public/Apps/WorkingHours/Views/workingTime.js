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

    var WorkingTime = Backbone.View.extend({
        tagName:"div",
        className:"pm_workingHours_working_time",
        initialize:function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
        },
        init:function () {
            var base = this;
            //Init notes collections
            base.projects_collection = new ProjectsCollection();

            base.render(true);
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
                var date = new Date();
                var week_nb = getWeekNumber(date)[1];
                var monday = new Date();
                monday.setDate(date.getDate() - date.getDay());
                var sunday = new Date();
                sunday.setDate(date.getDate() - date.getDay() + 7);
                var workingTimeTemplate = _.template(WorkingTimeTemplate, {
                    projects:base.projects_collection.models,
                    week_number:week_nb,
                    monday:monday,
                    sunday:sunday
                });
                base.$el.html(workingTimeTemplate);
                base.project_deleted = false;
                base.initializeEvents();
            }
        },
        initializeEvents:function () {
            var base = this;
//            var workingDuration = new WorkingDuration({
//                date:d.getTime()/1000
//            });

            base.$el.delegate(".add_project", "click", function () {
                var elt = $(this);
                var project = new Project({
                    name:"New project"
                });
                project.save({}, {
                    success:function () {
                        console.log("success creating project");
                        base.projects_collection.add(project);
                        base.render(false);
                    },
                    error:function () {
                        console.log("error creating project");
                        base.SmartBlocks.show_message("There was an error creating the project. Please try again later.");
                    }
                })
            });

            base.$el.delegate(".manage_projects_viewer_button", "click", function () {
                var elt = $(this);
                var content = base.$el.find(".manage_projects_content");
                if (content.css("display") == "none")
                    content.show();
                else
                    content.hide();
            });

            base.$el.delegate(".hours_display_td", "click", function () {
                console.log("hours_display click");
                var elt = $(this);
                elt.addClass("editing");
                var hours_display = elt.find(".hours_display");
                console.log(hours_display);
                var hours_edition = elt.find(".hours_edition");
                var hours_input = elt.find(".hours_input");
                hours_input.val(hours_display.html());
                hours_display.hide();
                hours_edition.show();
            });

            base.$el.delegate(".hours_display_td", "blur", function () {
                console.log("hours_display blur");
                var elt = $(this);
                elt.removeClass("editing");
                var hours_display = elt.find(".hours_display");
                var hours_edition = elt.find(".hours_edition");
                hours_display.show();
                hours_edition.hide();
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