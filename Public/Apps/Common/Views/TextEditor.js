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
        init:function (text, heightFactor) {
            var base = this;
            base.events = _.extend({}, Backbone.Events);
            base.text = text;
            base.heightFactor = heightFactor !== undefined ? heightFactor : 100;
            base.render();
        },
        render:function () {
            var base = this;
            var template = _.template(TextEditorTemplate, {
                text:base.text
            });
            base.$el.html(template);

            base.initRichTextEditor();
        },
        getText:function () {
            var base = this;
            return base.text;
        },
        initRichTextEditor:function () {
            var base = this;
            var frame = base.$el.find(".richTextEditor");
            base.frame = frame;

            frame.load(function () {
                var frameDoc = frame[0].contentWindow.document;
                var link = $(document.createElement("link"));

                frameDoc.open();
                frameDoc.write(base.text);
                frameDoc.close();

                frameDoc.designMode = "on";

                var contents = frame.contents();
                contents.find("head").append('<link rel="stylesheet" href="/Apps/Common/Css/text_editor.css" type="text/css" />');
                base.initializeEvents();
                base.resizeFrame();
            });

        },
        resizeFrame:function () {
            var base = this;
            base.frame.css("height", base.heightFactor);
            var needed_height = base.frame.contents().find("body").outerHeight();
            if (needed_height % base.heightFactor != 0) {
                needed_height += base.heightFactor - (needed_height % base.heightFactor);
            }
            base.frame.css("height", needed_height + "px");
        },
        initializeEvents:function () {
            var base = this;
            var frame = base.$el.find(".richTextEditor");

            base.$el.delegate(".editor_button", "click", function (e) {
                $(this).toggleClass("selected");
                var contentWindow = frame[0].contentWindow;

                contentWindow.focus();
                contentWindow.document.execCommand($(this).attr("data-commandName"), false, null);
                contentWindow.focus();
            });

            $('body', $(frame).contents()).blur(function (event) {
                var textUpdate = event.currentTarget.innerHTML;
                base.text = textUpdate;
                var message = {
                    status:"text_update",
                    text:textUpdate
                };
                base.events.trigger('text_editor_blur', message);
            });

            frame.contents().delegate("body", "keyup", function (e) {
                base.resizeFrame();
                base.events.trigger("text_editor_keyup", base.caretPosition(), e.keyCode);
            });

            frame.contents().delegate("body", "select", function (e) {
                console.log("Caret : ", base.caretPosition());
                base.events.trigger("text_editor_select", base.caretPosition());
            });
        },
        caretPosition:function () {
            var base = this;
            var element = base.frame[0];
            var range = element.contentWindow.getSelection().getRangeAt(0);
            return {start:range.startOffset, end:range.endOffset};
        }
    });

    return TextEditorView;
});