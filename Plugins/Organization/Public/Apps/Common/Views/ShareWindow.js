define([
    'jquery',
    'underscore',
    'backbone',
    'text!Organization/Apps/Common/Templates/share_window.html',
    'text!Organization/Apps/Common/Templates/linked_users.html',
    'text!Organization/Apps/Common/Templates/users_list.html',
    'UsersCollection',
    'UserModel'
], function ($, _, Backbone, ShareWindowTemplate, LinkedUsersTemplate, UsersListTemplate, UsersCollection, User) {
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
            base.users_response = new UsersCollection();
            base.render();
            base.fillUsers();
            base.registerEvents();
        },
        render: function () {
            var base = this;
            var template = _.template(ShareWindowTemplate, {});
            base.$el.html(template);
        },
        fillUsers: function () {
            var base = this;
            base.task.fetch({
                success: function () {
                    base.users = new UsersCollection(base.task.get('linked_users'));
                    console.log(base.users);
                    var template = _.template(LinkedUsersTemplate, { users: base.users.models });
                    base.$el.find(".users").html(template);
                }
            });
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
                base.task.get('linked_users').push(new User({ id: elt.attr("data-id") }));
                console.log(base.task.get('linked_users'));
                base.task.save();
                base.fillUsers();
                elt.removeClass("shown");
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