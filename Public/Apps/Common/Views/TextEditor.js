define([
    'jquery',
    'underscore',
    'backbone',
    'text!Apps/Common/Templates/text_editor.html'
], function ($, _, Backbone, TextEditorTemplate) {
    var TextEditorView = Backbone.View.extend({
        tagName:"div",
        className:"text_editor",
        events:{
        },
        initialize:function () {
        },
        init:function () {
            var base = this;
            base.events = _.extend({}, Backbone.Events);
            base.textArray = new Array();
        },
        render:function () {
            var base = this;
            var template = _.template(TextEditorTemplate, {
                texts:base.textArray
            });
            base.$el.html(template);

            base.initRichTextEditor();
            base.initializeEvents();
        },
        addTextInit:function (text, id) {
            var base = this;
            base.textArray[id] = text;
        },
        addText:function (text, id) {
            var base = this;
            base.textArray[id] = text;
            base.render();
        },
        getText:function (id) {
            var base = this;
            return (base.textArray[id]);
        },
        initRichTextEditor:function () {
            var base = this;
            var frames = $(".richTextEditor");
            for (var i = 0; i < frames.length; ++i) {
                var frame = frames[i];
                var id = $(frame).attr("data-id");
                var frameDoc = frame.contentWindow.document;
                frameDoc.open();
                frameDoc.write(base.textArray[id]);
                frameDoc.close();
                frameDoc.designMode = "on";
            }
        },
        initializeEvents:function () {
            var base = this;
            base.$el.delegate(".editor_button", "click", function (e) {
                $(this).toggleClass("selected");
                var frames = $(".richTextEditor");
                for (var i = 0; i < frames.length; ++i) {
                    var frame = frames[i];
                    var contentWindow = frame.contentWindow;
                    contentWindow.focus();
                    contentWindow.document.execCommand($(this).attr("commandName"), false, null);
                    contentWindow.focus();
                }
            });

            $('body', $('.richTextEditor').contents()).blur(function (event) {
                var id = $('.richTextEditor').attr("data-id");
                var textUpdate = event.currentTarget.innerHTML;
                base.textArray[id] = textUpdate;
                var message = {
                    status:"text_update",
                    textId:id,
                    text:textUpdate
                };
                base.events.trigger('textEditor_notification', message);
            });
        }
    });

    return TextEditorView;
});