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
                    base.render();
                }
            });
        },
        render:function () {
            var base = this;

            //Init subnotes collections
            base.subnotes_list = base.note.get("subnotes").models;
            base.editNoteTemplate = _.template(EditNoteTemplate, {
                note:base.note
            });
            base.$el.html(base.editNoteTemplate);

            base.textEditor = new TextEditorView();
            base.textEditor.init();

            _.each(base.subnotes_list, function (subnote) {
                base.textEditor.addTextInit(subnote.get('content'), subnote.get('id'));
            });
            base.$el.find(".editNoteContent").html(base.textEditor.$el);
            base.textEditor.render();
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
                        base.textEditor.addText("New content", subnote.id);
                    },
                    error:function () {
                        SmartBlocks.show_message("There was an error creating the subnote. Please try again later.");
                    }
                });
            });

            base.textEditor.events.on('textEditor_notification', function (message) {
                if (message.status == "text_update") {
                    var id = message.textId;
                    var textUpdate = message.text;
//                    console.log("editNote textUpdate, id : " + id + ", text :" + textUpdate);
                    var subnote = new Subnote({
                        id:id
                    });
                    subnote.fetch({
                        data:{
                        },
                        success:function () {
                            subnote.set("content", textUpdate);
                            subnote.save();
                        }
                    })
                }
            });
        }
    });

    return EditNoteView;
});