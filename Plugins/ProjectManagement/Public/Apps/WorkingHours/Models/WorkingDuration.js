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
            if (response.user !== undefined) {
                var user = new User(response.user);
                if (user !== undefined)
                    response.user = user;
            }
            if (response.project != null && response.project != undefined) {
                var project = new Project(response.project);
                if (project !== undefined)
                    response.project = project;
            }
            var wd_date = new Date();
            wd_date.setTime(response.date * 1000);
            response.date = wd_date;

            return response;
        }
    });

    return WorkingDuration;
});