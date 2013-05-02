define([
    'jquery',
    'underscore',
    'backbone',
    'Enterprise/Apps/Notes/Models/Note',
    'text!Enterprise/Apps/Notes/Templates/note_parameters.html',
    'UsersCollection',
    'text!SearchResultsTemplate',
    'text!SelectionTemplate'
], function ($, _, Backbone, Note, NoteParametersTemplate, UsersCollection, SearchResultsTemplate, SelectionTemplate) {
    var NoteParametersView = Backbone.View.extend({
        tagName:"div",
        className:"cache",
        initialize:function () {
        },
        init:function (SmartBlocks, note) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.note = note;
            base.user_search_results = new UsersCollection();
            base.selected_users = new UsersCollection();
            base.events = $.extend(true, {}, Backbone.Events);
            base.note.fetch({
                success: function () {
                    base.old_users = base.note.get("users").toArray();
                    base.render();
                }
            });
        },
        render:function () {
            var base = this;
            var template = _.template(NoteParametersTemplate, {});
            var content = $(document.createElement("div"));
            content.addClass('ent_notes_np');
            content.html(template);
            base.$el.append(content);
            base.selected_users = base.note.get("users");
            var template = _.template(SelectionTemplate, {
                type:"User",
                selection:base.selected_users.models,
                field:"username"
            });
            base.$el.find(".user_selection").html(template);

            base.$el.find(".remove_from_selection").click(function () {
                var elt = $(this);
                base.selected_users.remove(base.selected_users.get(elt.attr("data-id")));
            });
            base.user_search_results.fetch({
                data:{
                    filter:base.$el.find(".user_search_input").val()
                },
                success:function () {
                    var template = _.template(SearchResultsTemplate, {
                        type:"User",
                        results:base.user_search_results.models,
                        field:"username"
                    });
                    base.$el.find(".user_search_result").html(template);
                    base.$el.find(".add_to_selection").click(function () {
                        var elt = $(this);
                        var model = base.user_search_results.get(elt.attr("data-id"));
                        base.selected_users.add(model);
                        console.log("base.selected_users init", base.selected_users);
                    });
                }
            });



            base.initializeEvents();
        },
        initializeEvents:function () {
            var base = this;
            var search_timer = 0;
            base.$el.find(".user_search_input").keyup(function () {
                clearTimeout(search_timer);
                search_timer = setTimeout(function () {
                    base.user_search_results.fetch({
                        data:{
                            filter:base.$el.find(".user_search_input").val()
                        },
                        success:function () {
                            var template = _.template(SearchResultsTemplate, {
                                type:"User",
                                results:base.user_search_results.models,
                                field:"username"
                            });
                            base.$el.find(".user_search_result").html(template);
                            base.$el.find(".add_to_selection").click(function () {
                                var elt = $(this);
                                var model = base.user_search_results.get(elt.attr("data-id"));
                                base.selected_users.add(model);
                                console.log("base.selected_users", base.selected_users);
                            });
                        }
                    });
                }, 100);
            });
            base.selected_users.on("add", function (model, collection) {

                var template = _.template(SelectionTemplate, {
                    type:"User",
                    selection:base.selected_users.models,
                    field:"username"
                });
                base.$el.find(".user_selection").html(template);
                base.$el.find(".remove_from_selection").click(function () {
                    var elt = $(this);
                    base.selected_users.remove(base.selected_users.get(elt.attr("data-id")));
                });
            });

            base.selected_users.on("remove", function () {
                var template = _.template(SelectionTemplate, {
                    type:"User",
                    selection:base.selected_users.models,
                    field:"username"
                });

                base.$el.find(".user_selection").html(template);

                base.$el.find(".remove_from_selection").click(function () {
                    var elt = $(this);
                    base.selected_users.remove(base.selected_users.get(elt.attr("data-id")));
                });
            });

            base.$el.find(".ent_note_np_validate").click(function () {
                base.SmartBlocks.startLoading("Validating parameters");
                var users = base.old_users;
                base.user_sessions = [];
                for (var k in users) {
                    base.user_sessions.push(users[k].get("session_id"));
                }
                console.log(users);
                for (var k in base.selected_users.models) {
                    base.user_sessions.push(base.selected_users.models[k].get("session_id"));
                }


                base.note.set("users", base.selected_users);
                base.note.save({}, {
                    success:function () {
                        console.log("NoteParameters note save success");
                        base.hide();
                        base.SmartBlocks.stopLoading();
                        base.SmartBlocks.sendWs("ent_notes", {
                            command: "refetch_notes",
                            sender: base.SmartBlocks.current_user.get("session_id")
                        }, base.user_sessions);
                        base.events.trigger("changed_users");
                    },
                    error:function () {
                        console.log("NoteParameters note save error");
                    }
                });
            });

            base.$el.find(".cancel_button").click(function () {
                base.hide();
            });
        },
        show:function () {
            var base = this;
            $("body").append(base.$el);
            base.$el.show();
        },
        hide:function () {
            var base = this;
            base.$el.remove();
        }
    });

    return NoteParametersView;
});