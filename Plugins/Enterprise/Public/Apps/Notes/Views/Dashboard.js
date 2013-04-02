define([
    'jquery',
    'underscore',
    'backbone',
    'jqueryflip',
    'Enterprise/Apps/Notes/Views/Panel',
    'Enterprise/Apps/Notes/Views/CreateNote',
    'text!Enterprise/Apps/Notes/Templates/dashboard.html',
    'Enterprise/Apps/Notes/Collections/Notes'
], function ($, _, Backbone, JqueryFlip, PanelView, CreateNoteView, DashboardTemplate, NotesCollection) {
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
            base.initializeEvents();
        },
        renderAll:function () {
            var base = this;
            base.$el.append(base.templateAllNotes);
        },
        renderImportants:function () {
            var base = this;
            base.$el.append(base.templateImportantsNotes);
        },
        showCreateNote:function () {
            var base = this;
            base.create_note.show();
        },
        clear:function () {
            var base = this;
            base.$el.find(".notes_container").html("");
        },
        initializeEvents:function () {
            var base = this;
        }
    });
    return Dashboard;
});