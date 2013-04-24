define([
    'jquery',
    'underscore',
    'backbone',
    'Enterprise/Apps/Notes/Models/Note',
    'TextEditorView',
    'text!Enterprise/Apps/Notes/Templates/edit_note.html'
], function ($, _, Backbone, Note, TextEditorView, EditNoteTemplate) {
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

            var textEditor = new TextEditorView();
            textEditor.init(base.AppEvents);

            _.each(base.subnotes_list, function (subnote) {
                textEditor.addText(subnote.get('content'));
            });
            base.$el.find(".editNoteContent").html(textEditor.$el);
            textEditor.render();
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
        show:function () {
            var base = this;
            var left_gap = ($(window).width() - base.$el.find(".editNote").width()) / 2;
            var top_gap = ($(window).height() - base.$el.find(".editNote").height()) / 2;
            base.$el.find(".editNote").css("left", left_gap + "px");
            base.$el.find(".editNote").css("top", top_gap + "px");
            base.$el.find(".noteCache").fadeIn(200);
        },
        hide:function () {
            var base = this;
            base.$el.find(".noteCache").fadeOut(100);
        },
        initializeEvents:function () {
            var base = this;
            base.$el.find(".closeButtonEditNote").click(function () {
                base.hide();
            });
        }
    });

    return EditNoteView;
});