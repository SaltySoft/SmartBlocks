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

            var wd_date = new Date();
            wd_date.setTime(response.date * 1000);
            response.date = wd_date;

            return response;
        }
    });

    return WorkingDuration;
});