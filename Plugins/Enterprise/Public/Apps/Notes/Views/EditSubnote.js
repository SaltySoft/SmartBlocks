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
            base.buffer = [];
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

            base.text_editor.events.on('text_editor_keydown', function (caret, keycode) {
                base.subnote.set("content", base.text_editor.getText());
                clearTimeout(save_timer);
                save_timer = setTimeout(function () {
                    base.subnote.save();
                }, 100);
                base.SmartBlocks.sendWs("ent_notes", {
                    command: "print",
                    caret: caret,
                    keycode: keycode,
                    sender : base.SmartBlocks.current_session
                }, [
                    '0eb59866437fdc6f9609ef58dce71049',
                    '0b55325ff882939ff9d9575213511864'
                ]);
            });

            base.text_editor.events.on('text_editor_text_change', function () {

                base.SmartBlocks.sendWs("ent_notes", {
                    command: "text_change",
                    text: base.text_editor.getText(),
                    sender : base.SmartBlocks.current_session
                }, [
                    '0eb59866437fdc6f9609ef58dce71049',
                    '0b55325ff882939ff9d9575213511864'
                ]);
                base.subnote.set("content", base.text_editor.getText());
                base.subnote.save();
            });

            base.text_editor.events.on('text_editor_select', function (caret) {
                base.SmartBlocks.sendWs("ent_notes", {
                    command: "select",
                    caret: caret,
                    sender : base.SmartBlocks.current_session
                }, [
                    '0eb59866437fdc6f9609ef58dce71049',
                    '0b55325ff882939ff9d9575213511864'
                ]);
            });

            base.SmartBlocks.events.on("ws_notification", function (message) {
                if (message.app == "ent_notes") {

                    if (message.sender != base.SmartBlocks.current_session) {
                        if (message.command == "text_change") {
                            base.text_editor.setText(message.text);
                        }
                    }
                }
            });
        }
    });

    return EditSubnoteView;
});