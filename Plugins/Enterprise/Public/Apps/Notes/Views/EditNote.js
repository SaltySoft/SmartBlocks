define([
    'jquery',
    'underscore',
    'backbone',
    'Enterprise/Apps/Notes/Models/Note',
    'Enterprise/Apps/Notes/Models/Subnote',
    'Enterprise/Apps/Notes/Views/EditSubnote',
    'TextEditorView',
    'text!Enterprise/Apps/Notes/Templates/edit_note.html',
    'Enterprise/Apps/Notes/Views/NoteParameters'
], function ($, _, Backbone, Note, Subnote, EditSubnoteView, TextEditorView, EditNoteTemplate, NoteParametersView) {
    var EditNoteView = Backbone.View.extend({
        tagName: "div",
        className: "ent_notes_edition",
        events: {
        },
        initialize: function () {
        },
        init: function (AppEvents, SmartBlocks, note_id) {
            var base = this;
            base.AppEvents = AppEvents;
            base.SmartBlocks = SmartBlocks;
            base.note_id = note_id;

            //initializing the note that is going
            base.note = new Note({ id: note_id });

            //show some loading here
            base.note.fetch({
                success: function () {
                    base.render();
                }
            });
        },
        render: function () {
            var base = this;

            //Init subnotes collections
            base.editNoteTemplate = _.template(EditNoteTemplate, {
                note: base.note
            });
            base.$el.html(base.editNoteTemplate);

            base.subnotes_views_list = new Array();
            base.subnotes_list = base.note.get("subnotes").models;

            _.each(base.subnotes_list, function (subnote) {
                var editSubnoteView = new EditSubnoteView();
                base.$el.find(".editNoteContent").append(editSubnoteView.$el);
                var subNoteId = subnote.get('id');
                var suNoteText = subnote.get('content');
                editSubnoteView.init(base.AppEvents, base.SmartBlocks, subnote);

                base.subnotes_views_list[subNoteId] = editSubnoteView;
            });

            base.initializeEvents();
        },
        retrieveSubnote: function (id) {
            var base = this;
            var subnote = new Subnote({ id: id});
            subnote.fetch({
                success: function () {
                    var editSubnoteView = new EditSubnoteView();
                    base.$el.find(".editNoteContent").append(editSubnoteView.$el);
                    var subNoteId = subnote.get('id');
                    editSubnoteView.init(base.AppEvents, base.SmartBlocks, subnote);

                    base.subnotes_views_list[subNoteId] = editSubnoteView;
                }
            });
        },
        initializeEvents: function () {
            var base = this;
            base.$el.delegate(".editNote_add_subnote_button", "click", function () {
                var elt = $(this);
                var id = base.note.get("id");
                var type = elt.attr("data-type");
                var subnote = new Subnote({
                    note_id: id,
                    content: "New content",
                    type: "text"
                });

                var users = base.note.get("users").models;
                var user_sessions = [];
                for (var k in users) {
                    user_sessions.push(users[k].get("session_id"));
                }

                subnote.save({}, {
                    success: function () {
                        var editSubnoteView = new EditSubnoteView();
                        base.$el.find(".editNoteContent").append(editSubnoteView.$el);
                        var subNoteId = subnote.id;
                        editSubnoteView.init(base.AppEvents, base.SmartBlocks, subnote);
                        base.subnotes_views_list[subNoteId] = editSubnoteView;

                        base.SmartBlocks.sendWs("ent_notes", {
                            command: "retrieve_note",
                            subnote_id: subnote.get("id"),
                            note_id: base.note.get("id"),
                            sender: base.SmartBlocks.current_session
                        }, user_sessions);
                    },
                    error: function () {
                        base.SmartBlocks.show_message("There was an error creating the subnote. Please try again later.");
                    }
                });
            });
            base.$el.delegate(".editNote_add_users", "click", function () {
                var elt = $(this);
                var noteParametersView = new NoteParametersView();
                noteParametersView.init(base.SmartBlocks, base.note);
                noteParametersView.show();
            });

            base.SmartBlocks.events.on("ws_notification", function (message) {
                console.log("RECEIVED MESSAGE");
                if (message.app == "ent_notes") {
                    if (message.sender != base.SmartBlocks.current_session) {
                        if (message.note_id == base.note.get("id")) {
                            if (message.command == "retrieve_note") {
                                base.retrieveSubnote(message.subnote_id);
                                console.log("SUCCESSFUL TREATMENT");
                            }
                        }

                    }
                }
            })
        }
    });

    return EditNoteView;
});