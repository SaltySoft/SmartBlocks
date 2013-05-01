define([
    'jquery',
    'underscore',
    'backbone',
    'Enterprise/Apps/Notes/Models/Note',
    'Enterprise/Apps/Notes/Models/Subnote',
    'Enterprise/Apps/Notes/Views/EditSubnote',
    'TextEditorView',
    'text!Enterprise/Apps/Notes/Templates/edit_note.html'
], function ($, _, Backbone, Note, Subnote, EditSubnoteView, TextEditorView, EditNoteTemplate) {
    var EditNoteView = Backbone.View.extend({
        tagName:"div",
        className:"ent_notes_edition",
        events:{
        },
        initialize:function () {
        },
        init:function (AppEvents, SmartBlocks, note_id) {
            var base = this;
            base.AppEvents = AppEvents;
            base.SmartBlocks = SmartBlocks;
            base.note_id = note_id;

            //initializing the note that is going
            base.note = new Note({ id:note_id });

            //show some loading here
            base.note.fetch({
                success:function () {
                    base.render();
                }
            });
        },
        render:function () {
            var base = this;

            //Init subnotes collections
            base.editNoteTemplate = _.template(EditNoteTemplate, {
                note:base.note
            });
            base.$el.html(base.editNoteTemplate);

            base.subnotes_views_list = new Array();
            base.subnotes_list = base.note.get("subnotes").models;

            _.each(base.subnotes_list, function (subnote) {
                var editSubnoteView = new EditSubnoteView();
                var subNoteId = subnote.get('id');
                var suNoteText = subnote.get('content');
                editSubnoteView.init(base.AppEvents, base.SmartBlocks, subnote);
                base.$el.find(".editNoteContent").append(editSubnoteView.$el);
                base.subnotes_views_list[subNoteId] = editSubnoteView;
            });

            base.initializeEvents();
        },
        initializeEvents:function () {
            var base = this;
            base.$el.delegate(".editNote_add_subnote_button", "click", function () {
                var elt = $(this);
                var id = elt.attr("data-id");
                var type = elt.attr("data-type");
                var subnote = new Subnote({
                    note_id:id,
                    content:"New content",
                    type:"text"
                });
                subnote.save({}, {
                    success:function () {
                        var editSubnoteView = new EditSubnoteView();
                        var subNoteId = subnote.id;
                        var suNoteText = "New content";
                        editSubnoteView.init(base.AppEvents, base.SmartBlocks, subnote);
                        base.$el.find(".editNoteContent").append(editSubnoteView.$el);
                        base.subnotes_views_list[subNoteId] = editSubnoteView;
                    },
                    error:function () {
                        SmartBlocks.show_message("There was an error creating the subnote. Please try again later.");
                    }
                });
            });
        }
    });

    return EditNoteView;
});