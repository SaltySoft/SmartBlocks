define([
    'jquery',
    'underscore',
    'backbone',
    'Enterprise/Apps/Notes/Models/Note',
    'Enterprise/Apps/Notes/Models/Subnote',
    'TextEditorView'
], function ($, _, Backbone, Note, Subnote, TextEditorView) {
    var EditSubnoteView = Backbone.View.extend({
        tagName: "div",
        className: "ent_subnote_edition",
        events: {
        },
        initialize: function () {
        },
        init: function (AppEvents, SmartBlocks, subnote) {
            var base = this;
            base.AppEvents = AppEvents;
            base.SmartBlocks = SmartBlocks;
            base.subnote = subnote;

            base.text_editor = new TextEditorView();
            base.text_editor.init(subnote.get("content"), 150);
            base.render();
        },
        render: function () {
            var base = this;
            base.$el.html(base.text_editor.$el);
            base.initializeEvents();
        },
        initializeEvents: function () {
            var base = this;

            var save_timer = 0;

            base.text_editor.events.on('text_editor_keyup', function (caret, keycode) {
                base.subnote.set("content", base.text_editor.getText());
                clearTimeout(save_timer);
                save_timer = setTimeout(function () {
                    base.subnote.save();
                }, 100);
                //send insert commands to node
            });

            base.text_editor.events.on('text_editor_select', function (caret) {
                //send selection commands to node
            });

            base.SmartBlocks.events.on("ws_notification", function (message) {
                if (message.app == "ent_notes") {
                    console.log(message);
                }
            });
        }
    });

    return EditSubnoteView;
});