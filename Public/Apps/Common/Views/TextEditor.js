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
        init:function (text) {
            var base = this;
            base.events = _.extend({}, Backbone.Events);
            base.text = text;
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
            console.log("initRichTextEditor");
            var frame = base.$el.find(".richTextEditor");
//            frame.html(base.text);
            console.log("myframe", frame);

            frame.load(function () {
                console.log("IFRAME READY");
                var frameDoc = frame[0].contentWindow.document;
                console.log("frameDoc", frameDoc);

                frameDoc.open();
                frameDoc.write(base.text);
                frameDoc.close();
                frameDoc.designMode = "on";

                frame.css("height", 0);
                var actual_height = frame[0].clientHeight;
                var needed_height = frame[0].contentDocument.height;
                console.log("actual_height " + actual_height);
                console.log("needed_height " + needed_height);
                if (actual_height != needed_height) {
                    console.log("change height init: ");
                    $(frame).css("height", needed_height);
                }

                base.initializeEvents();
            });
        },
        initializeEvents:function () {
            var base = this;
            var frame = base.$el.find(".richTextEditor");

            base.$el.delegate(".editor_button", "click", function (e) {
                $(this).toggleClass("selected");
                var contentWindow = frame.contentWindow;
                contentWindow.focus();
                contentWindow.document.execCommand($(this).attr("data-commandName"), false, null);
                contentWindow.focus();
            });

            $('body', $(frame).contents()).blur(function (event) {
                base.resizeIframe();
                console.log("blur: ");

                var textUpdate = event.currentTarget.innerHTML;
                base.text = textUpdate;
                var message = {
                    status:"text_update",
                    text:textUpdate
                };
                base.events.trigger('textEditor_notification', message);
            });
        },
        resizeIframe:function () {
            var base = this;

        }
    });

    return TextEditorView;
});