define([
    'jquery',
    'underscore',
    'backbone',
    'text!Apps/Common/Templates/text_editor.html'
], function ($, _, Backbone, TextEditorTemplate) {
    var TextEditorView = Backbone.View.extend({
        tagName: "div",
        className: "text_editor",
        events: {
        },
        initialize: function () {
        },
        init: function (text, heightFactor) {
            var base = this;
            base.events = _.extend({}, Backbone.Events);
            base.text = text;
            base.heightFactor = heightFactor !== undefined ? heightFactor : 100;
            base.buffer = "";
            base.render();
        },
        render: function () {
            var base = this;
            var template = _.template(TextEditorTemplate, {
                text: base.text
            });
            base.$el.html(template);

            base.initRichTextEditor();
        },
        getText: function () {
            var base = this;
            return base.frame.contents().find("body").html();
        },
        setText: function (text) {
            var base = this;
            base.frame.contents().find("body").html(text);
        },
        insertAt: function (string, pos) {
            var base = this;
            var content =  base.frame.contents().find("body").html();
            var front =  content.substring(0,pos);
            var back = content.substring(pos,content.length);
            base.frame.contents().find("body").html(front+string+back);
        },
        charAt: function (pos) {
            var base = this;
            var content =  base.frame.contents().find("body").html();
            return content.substring(pos, pos+1);
        },
        initRichTextEditor: function () {
            var base = this;
            console.log("initRichTextEditor");
            var frame = base.$el.find(".richTextEditor");
            base.frame = frame;

            frame.load(function () {


                base.frameDoc = frame[0].contentWindow.document;
                var link = $(document.createElement("link"));


                base.frameDoc.open();
                base.frameDoc.write(base.text);
                base.frameDoc.close();

                base.frameDoc.designMode = "on";

                var contents = frame.contents();
                contents.find("head").append('<link rel="stylesheet" href="/Apps/Common/Css/text_editor.css" type="text/css" />');
                console.log(contents.find("head"));
                base.initializeEvents();
                base.resizeFrame();
            });

        },
        resizeFrame: function () {
            var base = this;
            base.frame.css("height", base.heightFactor);
            var needed_height = base.frame.contents().find("body").outerHeight();
            if (needed_height % base.heightFactor != 0) {
                needed_height += base.heightFactor - (needed_height % base.heightFactor);
            }
            base.frame.css("height", needed_height + "px");
        },
        initializeEvents: function () {
            var base = this;
            var frame = base.$el.find(".richTextEditor");

            base.$el.delegate(".editor_button", "click", function (e) {
                $(this).toggleClass("selected");
                console.log("click", frame);
                var contentWindow = frame[0].contentWindow;

                contentWindow.focus();
                contentWindow.document.execCommand($(this).attr("data-commandName"), false, null);
                contentWindow.focus();
            });

            $('body', $(frame).contents()).blur(function (event) {
                var textUpdate = event.currentTarget.innerHTML;
                base.text = textUpdate;
                var message = {
                    status: "text_update",
                    text: textUpdate
                };
                base.events.trigger('text_editor_blur', message);
            });
            base.caret = 0;
            frame.contents().delegate("body", "keydown", function (e) {
                text_save = base.getText();

                base.caret = base.caretPosition();
                base.buffer += base.charAt(base.caretPosition().start);

                base.resizeFrame();
            });

            frame.contents().delegate("body", "keyup", function (e) {
//                if (base.getText() != text_save)
//                    base.events.trigger("text_editor_text_change");
                base.events.trigger("inserted_at", base.buffer, base.caret);
                base.buffer = "";
            });

            var text_save = null;
            frame.contents().delegate("body", "mousedown", function (e) {
                text_save = base.getText();
            });

            frame.contents().delegate("body", "mouseup", function (e) {
                base.events.trigger("text_editor_select", base.caretPosition());

                if (base.getText() != text_save) {
                    base.events.trigger("text_editor_text_change");
                }
            });
        },
        caretPosition: function () {
            var base = this;
            var element = base.frame[0];
            var range = element.contentWindow.getSelection().getRangeAt(0);
            console.log("OFFSET", range.start, range.endOffset);
            return {start: range.startOffset, end: range.endOffset};
        }
    });

    return TextEditorView;
});