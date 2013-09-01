define([
    'jquery',
    'underscore',
    'backbone',
    'UserModel',
    'UsersCollection',
    'ProjectManagement/Apps/CostsManagement/Models/Role',
    'ProjectManagement/Apps/WorkingHours/Collections/Projects',
    'text!ProjectManagement/Apps/CostsManagement/Templates/role_creation.html'
], function ($, _, Backbone, User, UsersCollection, Role, ProjectsCollection, RoleCreationTemplate) {

    var RoleCreation = Backbone.View.extend({
        tagName:"div",
        className:"pm_role_creation",
        initialize:function () {
            var base = this;
        },
        init:function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.users = new UsersCollection({});
            base.projects = new ProjectsCollection({});

            base.users.fetch({
                data:{
                },
                success:function () {
                    console.log("pm_role_creation success fetching users_collection");
                    base.projects.fetch({
                        data:{
                        },
                        success:function () {
                            console.log("pm_role_creation success fetching projects_collection");
                            base.render();
                        },
                        error:function () {
                            console.log("pm_role_creation error fetching projects_collection");
                        }
                    });
                },
                error:function () {
                    console.log("pm_role_creation error fetching users_collection");
                }
            });
        },
        render:function () {
            var base = this;
            console.log("projects", base.projects);
            var roleCreationTemplate = _.template(RoleCreationTemplate, {
                projects:base.projects.models,
                users:base.users.models
            });
            base.$el.html(roleCreationTemplate);
            base.initializeEvents();
        },
        initializeEvents:function () {
            var base = this;

            base.$el.delegate(".role_creation_form", "submit", function () {
                var form = $(this);
                $.ajax({
                    url:"/ProjectManagement/Roles",
                    type:"post",
                    data:form.serialize(),
                    success:function (data) {
                        console.log("success", data);

                    },
                    error:function (object, status, data) {
                        console.log("error");
                    }
                });
            });
        }
    });

    return RoleCreation;
});