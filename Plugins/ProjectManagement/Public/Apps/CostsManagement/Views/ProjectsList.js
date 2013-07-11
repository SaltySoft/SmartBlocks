define([
    'jquery',
    'underscore',
    'backbone',
    'ProjectManagement/Apps/WorkingHours/Models/Project',
    'text!ProjectManagement/Apps/CostsManagement/Templates/project_list.html',
    'ProjectManagement/Apps/WorkingHours/Collections/Projects',
    'ProjectManagement/Apps/CostsManagement/Views/ProjectsListItem'
], function ($, _, Backbone, Project, ProjectListTemplate, ProjectsCollection, ProjectsListItemView) {

    var ProjectsList = Backbone.View.extend({
        tagName:"div",
        className:"pm_projects_list",
        initialize:function () {
            var base = this;
        },
        init:function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.projects = new ProjectsCollection({});
            base.render();
        },
        render:function () {
            var base = this;
            var projectListTemplate = _.template(ProjectListTemplate, {
            });
            base.$el.html(projectListTemplate);
            base.projects.fetch({
                data:{
                },
                success:function () {
                    base.updateList();
                }
            });
        },
        updateList:function () {
            var base = this;
            var dom_list = base.$el.find(".project_list");
            for (var k in base.projects.models) {
                var project = base.projects.models[k];
                var project_item_view = new ProjectsListItemView(project);
                dom_list.append(project_item_view.$el);
                project_item_view.init(base.SmartBlocks);
            }

            if (base.projects.length == 0) {
                dom_list.append("No project found.");
            }
        },
        initializeEvents:function () {
            var base = this;
        }
    });

    return ProjectsList;
});