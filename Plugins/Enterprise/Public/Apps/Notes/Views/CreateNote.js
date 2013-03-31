define([
    'jquery',
    'underscore',
    'backbone',
    'Enterprise/Apps/Notes/Models/Note',
    'text!Enterprise/Apps/Notes/Templates/create_note.html'
], function ($, _, Backbone, Note, CreateNoteTemplate) {
    var CreateNoteView = Backbone.View.extend({
        tagName:"div",
        className:"ent_notes_create_note",
        events:{
        },
        initialize:function () {
        },
        init:function (AppEvents) {
            var base = this;
            this.AppEvents = AppEvents;
        },
        render:function () {
            var base = this;
            var template = _.template(CreateNoteTemplate, {
            });
            base.$el.html(template);
            base.initializeEvents();
        },
        show:function () {
            var base = this;
            var left_gap = ($(window).width() - base.$el.find(".createNote").width()) / 2;
            var top_gap = ($(window).height() - base.$el.find(".createNote").height()) / 2;
            base.$el.find(".createNote").css("left", left_gap + "px");
            base.$el.find(".createNote").css("top", top_gap + "px");
            base.$el.find(".createNoteCache").fadeIn(200);
        },
        hide:function () {
            var base = this;
            base.$el.find(".createNoteCache").fadeOut(100);
        },
        createNote:function (title) {
            var base = this;
            var note = new Note({
                title:title,
                archived:false,
                important:false
            })
            note.save();
            base.hide();
        },
        initializeEvents:function () {
            var base = this;
            base.$el.find(".closeButtonCreateNote").click(function () {
                base.hide();
            });
            base.$el.find("#button_create_note").click(function () {
                base.createNote(base.$el.find("#input_new_note_title").val());
            });
        }
    });

    return CreateNoteView;
});