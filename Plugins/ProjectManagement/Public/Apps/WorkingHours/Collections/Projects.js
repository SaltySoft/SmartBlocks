define([
    "underscore",
    "backbone",
    'ProjectManagement/Apps/WorkingHours/Models/Project'
], function (_, Backbone, Project) {
    var ProjectsCollection = Backbone.Collection.extend({
        url:"/ProjectManagement/Projects",
        model:Project
    });

    return ProjectsCollection;
});