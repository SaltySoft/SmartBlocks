define([
    'jquery',
    'underscore',
    'backbone',
    'jqueryflip',
    'Meetings/Apps/Notes/Models/Note',
    'Meetings/Apps/Notes/Views/EditNote',
    'text!Meetings/Apps/Notes/Templates/dashboard.html',
    'text!Meetings/Apps/Notes/Templates/main.html',
    'text!Meetings/Apps/Notes/Templates/panel.html',
    'Meetings/Apps/Notes/Collections/Notes'
], function ($, _, Backbone, JqueryFlip, Note, EditNoteView, DashboardTemplate, MainTemplate, PanelTemplate, NotesCollection) {
    var Dashboard = Backbone.View.extend({
            tagName: "div",
            className: "ent_notes_dashboard",
            events: {
            },
            initialize: function (SmartBlocks) {
                var base = this;
                base.SmartBlocks = SmartBlocks;
            },
            init: function (AppEvents) {
                var base = this;
                this.AppEvents = AppEvents;

                //Init templates
                var template = _.template(MainTemplate, {});
                base.$el.html(template);

                var panel_template = _.template(PanelTemplate, {});
                base.$el.find(".quick_control_panel_container").html(panel_template);

                //Init notes collections
                base.notes_list = new NotesCollection();

                base.render();
            },
            render: function () {
                var base = this;
                base.renderAll();
                base.initializeEvents();
            },
            renderInterface: function () {
                var base = this;
                base.templateAllNotes = _.template(DashboardTemplate, {
                    notes: base.notes_list.models,
                    category: "all"
                });
                base.$el.find(".notes_container").html(base.templateAllNotes);
            },
            renderAll: function (refetch) {
                var base = this;
                if (refetch === undefined || refetch) {
                    base.notes_list.fetch({
                        data: {
                            all: "true",
                            importants: "false"
                        },
                        success: function () {
                            base.renderInterface();
                        }
                    });
                }
                else {
                    base.renderInterface();
                }
                base.deleted = false;
            },
            renderEditNote: function (id, elt) {
                var base = this;
                var editNote = new EditNoteView(elt);
                base.editNote = editNote;
                base.editNote.init(base.AppEvents, base.SmartBlocks, id);
                base.$el.find(".ent_notes_edition").remove();
                base.$el.find(".content_container").append(base.editNote.$el);
            },
            changeNoteName: function (note, note_div) {
                note_div.removeClass("edited");
                note.set("title", note_div.find("input").val());
                note_div.find(".name_link .display").html(note.get('title'));
                note.save({}, {
                    success: function () {
                        console.log("saved note");
                    },
                    error: function () {
                        console.log("error saving note");
                    }
                });
            },
            initializeEvents: function () {
                var base = this;

                base.$el.delegate(".create_note_button", "click", function () {
                    var note = new Note({
                        title: "New note",
                        archived: false,
                        important: false,
                        description: ""
                    });
                    //faster interface

                    note.save({}, {
                        success: function () {
                            console.log("saved note");
                            base.notes_list.add(note);
                            base.renderAll(false);
                        },
                        error: function () {
                            console.log("error saving note");
                            base.notes_list.remove(note);
                            base.renderAll(false);
                            SmartBlocks.show_message("There was an error creating the note. Please try again later.");
                        }
                    });
                });

                base.$el.delegate(".note_edition_button", "click", function () {
                    var elt = $(this);
                    if (!base.deleted) {
                        var id = elt.attr("data-id");
                        base.renderEditNote(id, elt);
                    }

                });

                base.$el.delegate(".dashboard_note", "click", function () {
                    var elt = $(this);
                    var id = elt.attr("data-id");
                    base.renderEditNote(id, elt);
                });

                base.$el.delegate(".show_all_button", "click", function () {
                    base.renderAll();
                });

                base.$el.delegate(".dashboard_note input", "keyup", function (e) {
                    if (e.keyCode == 13) {
                        var elt = $(this);
                        var note_div = elt.closest(".dashboard_note");
                        var note = base.notes_list.get(note_div.attr("data-id"));
                        base.changeNoteName(note, note_div);
                    }
                });

                base.$el.delegate(".dashboard_note input", "blur", function () {
                    var elt = $(this);
                    var note_div = elt.closest(".dashboard_note");
                    var note = base.notes_list.get(note_div.attr("data-id"));
                    base.changeNoteName(note, note_div);
                });

                base.$el.delegate(".edit_note_button", "click", function () {
                    var elt = $(this);

                    var note_div = elt.parent();
                    var note = base.notes_list.get(note_div.attr("data-id"));
                    if (!note_div.hasClass("edited")) {
                        note_div.addClass("edited");
                        note_div.find("input").val(note.get('title'));
                    } else {
                        base.changeNoteName(note, note_div);
                    }
                });

                base.$el.delegate(".delete_note_button", "click", function () {
                    var elt = $(this);
                    var note_div = elt.parent();
                    if (confirm("Are you sure you want to delete this note ?")) {
                        var note = base.notes_list.get(note_div.attr("data-id"));
                        note.fetch({
                            success: function () {
                                var users = note.get("users").models;

                                var user_sessions = [];
                                for (var k in users) {
                                    user_sessions.push(users[k].get("session_id"));
                                }
                                var id = note.get("id");

                                base.deleted = true;

                                note.destroy({
                                    success: function () {
                                        note_div.remove();
                                        base.SmartBlocks.events.trigger("ent_notes_deleted_note", id);
                                        base.SmartBlocks.sendWs("ent_notes", {
                                            command: "remove_note",
                                            note_id: id,
                                            sender: base.SmartBlocks.current_user.get("session_id")
                                        }, user_sessions);
                                    }
                                });
                            }});
                    }
                });

                base.SmartBlocks.events.on("ws_notification", function (message) {
                    console.log(message);
                    if (message.app == "ent_notes") {
                        if (message.sender != base.SmartBlocks.current_user.get("session_id")) {
                            if (message.command == "refetch_notes") {
                                base.renderAll(true);
                            }
                            if (message.command == "change_title") {
                                base.renderAll(true);
                            }
                            if (message.command == "remove_note") {
                                base.renderAll(true);
                            }
                        }
                    }
                });
            }
        })
        ;
    return Dashboard;
})
;