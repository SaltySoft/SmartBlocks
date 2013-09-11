define([
    'jquery',
    'underscore',
    'backbone',
    'Meetings/Apps/Notes/Models/Note',
    'Meetings/Apps/Notes/Models/Subnote',
    'TextEditorView',
    'text!Meetings/Apps/Notes/Templates/subnote.html'
], function ($, _, Backbone, Note, Subnote, TextEditorView, SubnoteTemplate) {
    var EditSubnoteView = Backbone.View.extend({
        tagName: "div",
        className: "ent_subnote_edition",
        events: {
        },
        initialize: function () {
        },
        init: function (AppEvents, SmartBlocks, subnote) {
            var base = this;
            base.AppEvents = AppEvents;
            base.SmartBlocks = SmartBlocks;
            base.subnote = subnote;
            base.user_sessions = [];
            console.log(base.subnote);
            var users = base.subnote.get("users");
            for (var k in users) {
                base.user_sessions.push(users[k].session_id);
            }

            console.log(base.user_sessions);

            base.text_editor = new TextEditorView();
            base.text_editor.init(subnote.get("content"), 200);
            base.buffer = [];
            base.render();
        },
        render: function () {
            var base = this;

            if (base.subnote.get("fullsize")) {
                base.$el.addClass("fullsize");
            } else {
                base.$el.addClass("halfsize");
            }

            var template = _.template(SubnoteTemplate, {});
            base.$el.html(template);
            base.$el.find(".subnote_text_editor").html(base.text_editor.$el);
            base.initializeEvents();
        },
        initializeEvents: function () {
            var base = this;

            var save_timer = 0;

            base.$el.delegate(".subnote_button", "click", function () {
                var elt = $(this);
                var action = elt.attr("data-action");

                if (action == "full_size") {
                    base.subnote.set("fullsize", true);
                    base.subnote.save();
                    base.$el.addClass("fullsize");
                    base.$el.removeClass("halfsize");
                    base.SmartBlocks.sendWs("ent_notes", {
                        command: "full_size",
                        sender: base.SmartBlocks.current_session,
                        subnote_id: base.subnote.get("id")
                    }, base.user_sessions);
                }
                if (action == "half_size") {
                    base.subnote.set("fullsize", false);
                    base.subnote.save();
                    base.$el.addClass("halfsize");
                    base.$el.removeClass("fullsize");
                    base.SmartBlocks.sendWs("ent_notes", {
                        command: "half_size",
                        sender: base.SmartBlocks.current_session,
                        subnote_id: base.subnote.get("id")
                    }, base.user_sessions);
                }
                if (action == 'delete') {
                    if (confirm("Are you sure you want to delete this subnote ?")) {

                        base.SmartBlocks.startLoading("Deleting note");
                        base.subnote.destroy({
                            success: function () {
                                base.SmartBlocks.stopLoading();
                            }
                        });

                        base.SmartBlocks.sendWs("ent_notes", {
                            command: "delete",
                            sender: base.SmartBlocks.current_session,
                            subnote_id: base.subnote.get("id")
                        }, base.user_sessions);
                        base.$el.fadeOut(300, function () {
                            base.$el.remove();
                        });
                    }
                }
            });


            base.text_editor.events.on('text_editor_keydown', function (caret, keycode) {
                base.subnote.set("content", base.text_editor.getText());
                clearTimeout(save_timer);
                save_timer = setTimeout(function () {
                    base.subnote.save();
                }, 200);
                base.SmartBlocks.sendWs("ent_notes", {
                    command: "print",
                    caret: caret,
                    keycode: keycode,
                    sender: base.SmartBlocks.current_session,
                    subnote_id: base.subnote.get("id")
                }, base.user_sessions);
            });

            base.text_editor.events.on('text_editor_text_change', function () {

                base.SmartBlocks.sendWs("ent_notes", {
                    command: "text_change",
                    text: base.text_editor.getText(),
                    sender: base.SmartBlocks.current_session,
                    subnote_id: base.subnote.get("id")
                }, base.user_sessions);
                base.subnote.set("content", base.text_editor.getText());
                clearTimeout(save_timer);
                save_timer = setTimeout(function () {
                    base.subnote.save();
                }, 200);
            });

            base.text_editor.events.on('text_editor_select', function (caret) {
                base.SmartBlocks.sendWs("ent_notes", {
                    command: "select",
                    caret: caret,
                    sender: base.SmartBlocks.current_session,
                    subnote_id: base.subnote.get("id")
                }, base.user_sessions);
            });

            base.text_editor.events.on('focus', function () {
                base.$el.addClass("edited");
                base.SmartBlocks.sendWs("ent_notes", {
                    command: "lock",
                    sender: base.SmartBlocks.current_session,
                    subnote_id: base.subnote.get("id")
                }, base.user_sessions);
            });

            base.text_editor.events.on('blur', function () {
                base.$el.removeClass("edited");
                base.SmartBlocks.sendWs("ent_notes", {
                    command: "unlock",
                    sender: base.SmartBlocks.current_session,
                    subnote_id: base.subnote.get("id")
                }, base.user_sessions);
            });

            base.SmartBlocks.events.on("ws_notification", function (message) {
                if (message.app == "ent_notes") {

                    if (message.sender != base.SmartBlocks.current_session) {
                        if (message.subnote_id == base.subnote.get("id")) {
                            if (message.command == "text_change") {
                                base.text_editor.setText(message.text);
                            }
                            if (message.command == "delete") {
                                base.$el.fadeOut(300, function () {
                                    base.$el.remove();
                                });
                            }
                            if (message.command == "full_size") {
                                base.$el.addClass("fullsize");
                                base.$el.removeClass("halfsize");
                            }
                            if (message.command == "half_size") {
                                base.$el.addClass("halfsize");
                                base.$el.removeClass("fullsize");
                            }
                            if (message.command == "lock") {
                                base.$el.addClass("locked");
                                base.text_editor.lock();
                            }
                            if (message.command == "unlock") {
                                base.$el.removeClass("locked");
                                base.text_editor.unlock();
                            }
                        }
                    }
                }
            });
        }
    });

    return EditSubnoteView;
});