define([
    'jquery',
    'underscore',
    'backbone',
    'Enterprise/Apps/Notes/Models/Note',
    'Enterprise/Apps/Notes/Models/Subnote',
    'TextEditorView',
    'text!Enterprise/Apps/Notes/Templates/edit_note.html'
], function ($, _, Backbone, Note, Subnote, TextEditorView, EditNoteTemplate) {
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
                    //stop the loading there
                    base.render();
                }
            });
        },
        render:function () {
            var base = this;

            //Init subnotes collections
            base.subnotes_list = base.note.get("subnotes").models;
//                subnotes:base.note.get("subnotes").models
            base["template" + base.note_id] = _.template(EditNoteTemplate, {
                note:base.note
            });
            base.editNoteTemplate = base["template" + base.note_id];
            base.$el.html(base.editNoteTemplate);

            base.textEditor = new TextEditorView();
            base.textEditor.init(base.AppEvents);

            _.each(base.subnotes_list, function (subnote) {
                base.textEditor.addTextInit(subnote.get('content'), subnote.get('id'));
            });
            base.$el.find(".editNoteContent").html(base.textEditor.$el);
            base.textEditor.render();
            base.initializeEvents();
        },
        renderNote:function (id) {
            var base = this;
            base.note = new Note({
                id:id
            });
            base.note.fetch({
                data:{
                },
                success:function (data) {
                    base["template" + id] = _.template(EditNoteTemplate, {
                        note:base.note
                    });
                    base.$el.html(base["template" + id]);
                    base.initializeEvents();
                    base.show();
                }
            })
        },
        initializeEvents:function () {
            var base = this;
            base.$el.delegate(".editNote_add_subnote_button", "click", function () {
                var elt = $(this);
                var id = elt.attr("data-id");
                var type = elt.attr("data-type");
                base.textEditor.addText("New content", id);
                var subnote = new Subnote({
                    note_id:id,
                    content:"New content",
                    type:"text"
                });
                subnote.save();
            });
            base.$el.delegate(".textContent", "blur", function () {
                var id = $(this).attr("data-id");
                var newText = base.textEditor.getText(id);
                var subnote = new Subnote({
                    id:id
                });
                subnote.fetch({
                    data:{
                    },
                    success:function (data) {
                        subnote.set("content", newText);
                        subnote.save();
                    }
                })
            });
        }
    });

    return EditNoteView;
});