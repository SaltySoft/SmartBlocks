define([
    'underscore',
    'backbone',
    'UserModel',
    'ProjectManagement/Apps/WorkingHours/Models/Project'
], function (_, Backbone, User, Project) {
    var Role = Backbone.Model.extend({
        urlRoot:"/ProjectManagement/Roles",
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

            return response;
        }
    });

    return Role;
});