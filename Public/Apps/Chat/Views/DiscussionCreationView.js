define([
    'jquery',
    'underscore',
    'backbone',
    'UsersCollection',
    'Chat/Models/Discussion',
    'text!Chat/Templates/discussion_creation_form.html',
    'text!Chat/Templates/simple_user_list.html'
], function ($, _, Backbone, UsersCollection, Discussion, DiscussionCrationTemplate, SimpleUserListTemplate) {
    var DiscussionCreationView = Backbone.View.extend({
        tagName:"div",
        className:"k_chat_discussion_creation",
        initialize:function () {

        },
        init:function (ChatApplication) {
            var base = this;
            base.app = ChatApplication;
            base.search_user_collection = new UsersCollection();
            base.selected_users_collection = new UsersCollection();
            base.render();
            base.initializeEvents();
        },
        initializeEvents:function () {
            var base = this;
            var timer = 0;
            base.$el.find(".k_chat_dc_user_search_input").keyup(function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    if (base.$el.find(".k_chat_dc_user_search_input").val()) {

                        base.search_user_collection.fetch({
                            data:{
                                filter:base.$el.find(".k_chat_dc_user_search_input").val()
                            },
                            success:function () {
                                var ul = $(document.createElement("div"));
                                var users = base.search_user_collection.models;
                                for (var k in users) {
                                    var li = $(document.createElement("div"));

                                    var a = $(document.createElement("a"));
                                    a.attr("href", "javascript:void(0);");
                                    a.attr("user_index", k);
                                    a.html(users[k].get('username'));
                                    a.click(function () {
                                        var elt = $(this);
                                        var index = elt.attr("user_index");
                                        base.selected_users_collection.add(base.search_user_collection.models[index]);
                                        console.log(base.selected_users_collection);
                                    });
                                    li.html(a);
                                    ul.append(li);
                                }
                                base.$el.find(".k_chat_dc_user_search_result").html(ul);
                            }
                        });
                    }
                }, 500);
            });
            base.selected_users_collection.on("add", function () {
                base.updateSelectedUsers();
            });

            base.selected_users_collection.on("remove", function () {
                base.updateSelectedUsers();
            });

            base.$el.find(".k_chat_dc_validation_button").click(function () {
                var discussion = new Discussion();
                discussion.set({
                    name: base.$el.find(".k_chat_dc_name_input").val(),
                    participants: base.selected_users_collection.toJSON()
                });
                discussion.save({}, {
                    success: function () {
                        console.log("saved discussion", discussion);
                        base.$el.remove();
                    }
                });
            });
        },
        updateSelectedUsers: function () {
            var base = this;
            var template = _.template(SimpleUserListTemplate, {users: base.selected_users_collection.models });
            base.$el.find(".k_chat_dc_user_selection").html(template);
            base.$el.find(".k_chat_dc_user_selection").find(".remove_item_button").click(function () {
                var elt = $(this);
                var id = elt.attr("data-user_id");
                var model = base.selected_users_collection.get(id);
                base.selected_users_collection.remove(model);
            });
        },
        render:function () {
            var base = this;
            var template = _.template(DiscussionCrationTemplate, {});

            base.$el.html(template);
        }
    });

    return DiscussionCreationView;

});