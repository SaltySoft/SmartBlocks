define([
    'jquery',
    'underscore',
    'backbone',
    'Enterprise/Apps/Notes/Models/Note',
    'Enterprise/Apps/Notes/Models/Subnote',
    'TextEditorView'
], function ($, _, Backbone, Note, Subnote, TextEditorView) {
    var EditSubnoteView = Backbone.View.extend({
        tagName:"div",
        className:"ent_subnote_edition",
        events:{
        },
        initialize:function () {
        },
        init:function (AppEvents, SmartBlocks, id, text) {
            var base = this;
            base.AppEvents = AppEvents;
            base.SmartBlocks = SmartBlocks;
            base.subnote_id = id;
            base.subnote_text = text;

            base.textEditor = new TextEditorView();
            base.textEditor.init(base.subnote_text, 150);
            base.render();


        },
        render:function () {
            var base = this;
            base.$el.html(base.textEditor.$el);
            base.initializeEvents();
        },
        initializeEvents:function () {
            var base = this;

            base.textEditor.events.on('textEditor_notification', function (message) {
                if (message.status == "text_update") {
                    var textUpdate = message.text;
                    var subnote = new Subnote({
                        id:base.subnote_id
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

    return EditSubnoteView;
});