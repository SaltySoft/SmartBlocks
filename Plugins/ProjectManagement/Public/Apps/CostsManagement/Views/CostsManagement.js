define([
    'jquery',
    'underscore',
    'backbone',
    'ProjectManagement/Apps/CostsManagement/Views/ProjectsList',
    'ProjectManagement/Apps/CostsManagement/Views/RoleCreation'
], function ($, _, Backbone, ProjectsListView, RoleCreationView) {

    var CostsManagement = Backbone.View.extend({
        tagName:"div",
        className:"pm_costs_management",
        initialize:function () {
            var base = this;
        },
        init:function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.render();
        },
        render:function () {
            var base = this;
            var roleCreationView = new RoleCreationView();
            roleCreationView.init(base.SmartBlocks);
            base.$el.append(roleCreationView.$el);

            var projectsListView = new ProjectsListView();
            projectsListView.init(base.SmartBlocks);
            base.$el.append(projectsListView.$el);
        },
        initializeEvents:function () {
            var base = this;
        }
    });

    return CostsManagement;
});