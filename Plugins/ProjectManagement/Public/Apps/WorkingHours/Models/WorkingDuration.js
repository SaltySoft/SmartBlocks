define([
    'underscore',
    'backbone',
    'UserModel',
    'ProjectManagement/Apps/WorkingHours/Models/Project'
], function (_, Backbone, User, Project) {
    var WorkingDuration = Backbone.Model.extend({
        urlRoot:"/ProjectManagement/WorkingDurations",
        defaults:{
        },
        parse:function (response) {
            var user = new User(response.user);
            response.user = user;

            var project = new Project(response.project);
            response.project = project;
        }
    });

    return WorkingDuration;
});