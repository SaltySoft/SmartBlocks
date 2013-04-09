define([
    'jquery',
    'underscore',
    'backbone',
    'Enterprise/Apps/Notes/Models/Note',
    'text!Enterprise/Apps/Notes/Templates/edit_note.html'
], function ($, _, Backbone, Note, EditNoteTemplate) {
    var EditNoteView = Backbone.View.extend({
        tagName:"div",
        className:"ent_notes_edition",
        events:{
        },
        initialize:function () {
        },
        init:function (AppEvents) {
            var base = this;
            this.AppEvents = AppEvents;
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