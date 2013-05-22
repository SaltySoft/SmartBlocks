define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Common/Templates/share_window.html',
    'text!Organization/Apps/Common/Templates/linked_users.html',
    'text!Organization/Apps/Common/Templates/users_list.html',
    'UsersCollection',
    'UserModel',
    'Organization/Apps/Common/Models/TaskUser',
    'Organization/Apps/Common/Collections/TaskUsers'
], function ($, _, Backbone, ShareWindowTemplate, LinkedUsersTemplate, UsersListTemplate, UsersCollection, User, TaskUser, TasksUsersCollection) {
    var ShareWindow = Backbone.View.extend({
        tagName: "div",
        className: "cache",
        initialize: function (obj) {
            var base = this;
            if (obj !== undefined && obj.model !== undefined) {
                base.task = obj.model;
            }
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.users = new UsersCollection();
            base.task_users = new TasksUsersCollection();
            base.users_response = new UsersCollection();
            base.render();
            base.task.fetch({
                success: function () {
                    base.fillUsers();
                }
            });
            base.registerEvents();
        },
        render: function () {
            var base = this;
            var template = _.template(ShareWindowTemplate, {});
            base.$el.html(template);
        },
        fillUsers: function () {
            var base = this;
            base.task_users = new TasksUsersCollection(base.task.get('task_users'));
            var template = _.template(LinkedUsersTemplate, { taskusers: base.task_users.models });
            base.$el.find(".users").html(template);
        },
        registerEvents: function () {
            var base = this;
            base.$el.delegate(".close_window", "click", function () {
                base.hide();
            });

            var key_timer = 0;
            base.$el.delegate(".user_search_input", "keyup", function () {
                var elt = $(this);
                clearTimeout(key_timer);
                key_timer = setTimeout(function () {
                    base.users_response.fetch({
                        data: {
                            filter: elt.val()
                        },
                        success: function () {
                            var template = _.template(UsersListTemplate, { users: base.users_response.models });
                            base.$el.find(".server_response").html(template);
                            base.$el.find(".server_response").addClass("shown");
                        }
                    });
                }, 200);
            });
            var hide_resp_timer = 0;
            base.$el.delegate(".user_search_input", "blur", function () {
                clearTimeout(hide_resp_timer);
                hide_resp_timer = setTimeout(function () {
                    base.$el.find(".server_response").removeClass("shown");
                }, 500);
            });
            base.$el.delegate(".server_response", "mouseout", function () {
                clearTimeout(hide_resp_timer);
                hide_resp_timer = setTimeout(function () {
                    base.$el.find(".server_response").removeClass("shown");
                }, 500);
            });

            base.$el.delegate(".server_response", "mousemove", function () {
                clearTimeout(hide_resp_timer);
            });

            base.$el.delegate(".select_user", "click", function () {
                var elt = $(this);
                var user = new User({id: elt.attr("data-id")});
                console.log(user);

                var task_user = new TaskUser();
                task_user.set("task", base.task);
                task_user.set("user", user);
                task_user.save({}, {
                    success: function () {
                        base.task.get("task_users").push(task_user.attributes);
                        base.fillUsers();
                        elt.removeClass("shown");
                    }
                });
            });

            base.$el.delegate(".remove_user", "click", function () {
                var elt = $(this);
                var task_user = new TaskUser({ id:elt.attr("data-id") });
                console.log(task_user);
                task_user.destroy({
                    success: function () {
                        console.log("DESTROYED");
                        base.task.fetch({
                            success: function () {
                                base.fillUsers();
                            }
                        });
                    }
                });
            });
        },
        show: function () {
            var base = this;
            $("body").prepend(base.$el);
        },
        hide: function () {
            var base = this;
            base.$el.remove();
        }
    });

    return ShareWindow;
});