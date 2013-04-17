define([
    'jquery',
    'underscore',
    'backbone',
    'jqueryflip',
    'Enterprise/Apps/Notes/Models/Note',
    'Enterprise/Apps/Notes/Views/Panel',
    'Enterprise/Apps/Notes/Views/CreateNote',
    'Enterprise/Apps/Notes/Views/EditNote',
    'text!Enterprise/Apps/Notes/Templates/dashboard.html',
    'text!Enterprise/Apps/Notes/Templates/main.html',
    'text!Enterprise/Apps/Notes/Templates/panel.html',
    'Enterprise/Apps/Notes/Collections/Notes'
], function ($, _, Backbone, JqueryFlip, Note, PanelView, CreateNoteView, EditNoteView, DashboardTemplate, MainTemplate, PanelTemplate, NotesCollection) {
    var Dashboard = Backbone.View.extend({
        tagName: "div",
        className: "ent_notes_dashboard",
        events: {
        },
        initialize: function () {
        },
        init: function (AppEvents) {
            var base = this;
            this.AppEvents = AppEvents;

            var template = _.template(MainTemplate, {});
            base.$el.html(template);

            var panel_template = _.template(PanelTemplate, {});
            base.$el.find(".panel_container").html(panel_template);

            //Init notes collections
            base.notes_list = new NotesCollection();

            base.render();

        },
        render: function () {
            var base = this;
            base.renderAll();
            base.initializeEvents();
        },
        renderAll: function () {
            var base = this;
            base.notes_list.fetch({
                data: {
                    all: "true",
                    importants: "false"
                },
                success: function () {
                    base.templateAllNotes = _.template(DashboardTemplate, {
                        notes: base.notes_list.models,
                        category: "all"
                    });
                    base.$el.find(".notes_container").html(base.templateAllNotes);

                }
            });

        },
        renderImportants: function () {
            var base = this;
            base.notes_list.fetch({
                data: {
                    all: "false",
                    importants: "true"
                },
                success: function () {
                    base.templateImportantsNotes = _.template(DashboardTemplate, {
                        notes: base.notes_list.models,
                        category: "importants"
                    });
                    base.$el.append(base.templateImportantsNotes);

                }
            });

        },
        changeNoteName: function (note, note_div) {
            note_div.removeClass("edited");
            note.set("title", note_div.find("input").val());
            note_div.find(".name_link .display a").html(note.get('title'));
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
                    important: false
                });
                note.save();
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
                    note.destroy({
                        success: function () {
                            note_div.remove();
                        }
                    });
                }
            });
        }
    });
    return Dashboard;
});