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
//            //Create Views
//            var notes_panel = new PanelView();
//            notes_panel.init(this.AppEvents);
//            notes_panel.render();
            var panel_template = _.template(PanelTemplate, {});
            base.$el.find(".panel_container").html(panel_template);
//            var create_note = new CreateNoteView();
//            base.create_note = create_note;
//            base.create_note.init(this.AppEvents);
//            base.create_note.render();
//            base.$el.prepend(base.create_note.$el);
//            var edit_note = new EditNoteView();
//            base.edit_note = edit_note;
//            base.edit_note.init(this.AppEvents);
//            base.$el.append(base.edit_note.$el);

            //Init notes collections
            base.notes_collectionAll = new NotesCollection();

            base.notes_collectionImportants = new NotesCollection();

            base.render();

        },
        render: function () {
            var base = this;
            base.renderAll();
            base.initializeEvents();
        },
        renderAll: function () {
            var base = this;
            base.notes_collectionAll.fetch({
                data: {
                    all: "true",
                    importants: "false"
                },
                success: function () {
                    base.templateAllNotes = _.template(DashboardTemplate, {
                        notes: base.notes_collectionAll.models,
                        category: "all"
                    });
                    base.$el.find(".notes_container").html(base.templateAllNotes);

                }
            });

        },
        renderImportants: function () {
            var base = this;
            base.notes_collectionImportants.fetch({
                data: {
                    all: "false",
                    importants: "true"
                },
                success: function () {
                    base.templateImportantsNotes = _.template(DashboardTemplate, {
                        notes: base.notes_collectionImportants.models,
                        category: "importants"
                    });
                    base.$el.append(base.templateImportantsNotes);

                }
            });

        },
        showCreateNote: function () {
            var base = this;
            base.create_note.show();

        },
        showEditNote: function (id) {
            var base = this;
            base.edit_note.renderNote(id);
        },
        clear: function () {
            var base = this;
            base.$el.find(".notes_container").html("");

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

            base.$el.delegate(".edit_note_button", "click", function () {
                var elt = $(this);
                var note_div = elt.parent();
                var name_container = note_div.find(".name_link");
                var note = base.notes_collectionAll.get(note_div.attr("data-id"));
                if (!name_container.hasClass("edited")) {
                    name_container.addClass("edited");
                    note_div.find("input").val(note.get('title'));
                } else {
                    name_container.removeClass("edited");

                    note.set("title", note_div.find("input").val());
                    note.save({}, {
                        success: function () {
                            console.log("saved note");
                            note_div.find(".name_link .display a").html(note.get('title'));
                        },
                        error: function () {
                            console.log("error saving note");
                        }
                    });
                }
            });

            base.$el.delegate(".delete_note_button", "click", function () {
                var elt = $(this);
                var note_div = elt.parent();
                if (confirm("Are you sure you want to delete this note ?")) {
                    var note = base.notes_collectionAll.get(note_div.attr("data-id"));
                    note.destroy({
                        success: function () {
                            note_div.remove();
                        }
                    });
                }
            });


//            base.$el.find(".dashboard_note").click(function () {
////                alert("dash click");
//                if ($(this).attr("data-flip") == 0) {
//                    var randomNumber = Math.floor((Math.random() * 4) + 1);
//                    var flipDir = 'tb';
//                    if (randomNumber == 2)
//                        flipDir = 'bt';
//                    if (randomNumber == 3)
//                        flipDir = 'lr';
//                    if (randomNumber == 4)
//                        flipDir = 'rl';
//
//                    $(this).flip({
//                        direction:flipDir,
//                        color:$(this).css("background-color"),
//                        content:$(this).attr("data-description"),
//                        speed:100
//                    });
//                    $(this).attr("data-flip", 1);
//                }
//                else {
//                    $(this).revertFlip();
//                    $(this).attr("data-flip", 0);
//                }
//            });
//            base.$el.find(".name_link").click(function (e) {
////                alert("name click");
//                e.stopPropagation();
//            });
        }
    });
    return Dashboard;
});