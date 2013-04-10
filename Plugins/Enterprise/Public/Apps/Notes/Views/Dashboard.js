define([
    'jquery',
    'underscore',
    'backbone',
    'jqueryflip',
    'Enterprise/Apps/Notes/Views/Panel',
    'Enterprise/Apps/Notes/Views/CreateNote',
    'Enterprise/Apps/Notes/Views/EditNote',
    'text!Enterprise/Apps/Notes/Templates/dashboard.html',
    'Enterprise/Apps/Notes/Collections/Notes'
], function ($, _, Backbone, JqueryFlip, PanelView, CreateNoteView, EditNoteView, DashboardTemplate, NotesCollection) {
    var Dashboard = Backbone.View.extend({
        tagName:"div",
        className:"ent_notes_dashboard",
        events:{
        },
        initialize:function () {
        },
        init:function (AppEvents) {
            var base = this;
            this.AppEvents = AppEvents;

            //Create Views
            var notes_panel = new PanelView();
            notes_panel.init(this.AppEvents);
            notes_panel.render();
            base.$el.html(notes_panel.$el);
            var create_note = new CreateNoteView();
            base.create_note = create_note;
            base.create_note.init(this.AppEvents);
            base.create_note.render();
            base.$el.prepend(base.create_note.$el);
            var edit_note = new EditNoteView();
            base.edit_note = edit_note;
            base.edit_note.init(this.AppEvents);
            base.$el.append(base.edit_note.$el);

            //Init notes collections
            base.notes_collectionAll = new NotesCollection();
            base.notes_collectionAll.fetch({
                data:{
                    all:"true",
                    importants:"false"
                },
                success:function () {
                    base.templateAllNotes = _.template(DashboardTemplate, {
                        notes:base.notes_collectionAll.models,
                        category:"all"
                    });
                }
            })
            base.notes_collectionImportants = new NotesCollection();
            base.notes_collectionImportants.fetch({
                data:{
                    all:"false",
                    importants:"true"
                },
                success:function () {
                    base.templateImportantsNotes = _.template(DashboardTemplate, {
                        notes:base.notes_collectionImportants.models,
                        category:"importants"
                    });
                }
            })
        },
        renderAll:function () {
            var base = this;
            base.$el.append(base.templateAllNotes);
            base.initializeEvents();
        },
        renderImportants:function () {
            var base = this;
            base.$el.append(base.templateImportantsNotes);
            base.initializeEvents();
        },
        showCreateNote:function () {
            var base = this;
            base.create_note.show();
            base.initializeEvents();
        },
        showEditNote:function (id) {
            var base = this;
            base.edit_note.renderNote(id);
        },
        clear:function () {
            var base = this;
            base.$el.find(".notes_container").html("");
        },
        initializeEvents:function () {
            var base = this;

            base.$el.find(".dashboard_note").click(function () {
//                alert("dash click");
                if ($(this).attr("data-flip") == 0) {
                    var randomNumber = Math.floor((Math.random() * 4) + 1);
                    var flipDir = 'tb';
                    if (randomNumber == 2)
                        flipDir = 'bt';
                    if (randomNumber == 3)
                        flipDir = 'lr';
                    if (randomNumber == 4)
                        flipDir = 'rl';

                    $(this).flip({
                        direction:flipDir,
                        color:$(this).css("background-color"),
                        content:$(this).attr("data-description"),
                        speed:100
                    });
                    $(this).attr("data-flip", 1);
                }
                else {
                    $(this).revertFlip();
                    $(this).attr("data-flip", 0);
                }
            });
            base.$el.find(".name_link").click(function (e) {
//                alert("name click");
                e.stopPropagation();
            });
        }
    });
    return Dashboard;
});