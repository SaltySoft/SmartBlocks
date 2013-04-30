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
//                console.log($(frameDoc));
                $(frame).find("body").setAttr("data-id", id);
//                $($(frameDoc)[0].body).attr("data-id", id);

                frameDoc.open();
                frameDoc.write(base.textArray[id]);
                frameDoc.close();
                frameDoc.designMode = "on";

                $(frame).css("height", 0);
                var actual_height = $(frame)[0].clientHeight;
                var needed_height = $(frame)[0].contentDocument.height;
//                console.log("actual_height " + actual_height);
//                console.log("needed_height " + needed_height);
                if (actual_height != needed_height) {
                    console.log("change height init: ");
                    $(frame).css("height", needed_height);
                }
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
                var id = $(this).attr("data-id");
                console.log(id);
                console.log($('.richTextEditor').contents());
                base.resizeIframes();
//
//                var iFrame = $(event).parents('.richTextEditor');
//                console.log("blur: ");
                console.log($(this));
                console.log("end blur");
//                console.log(iFrame);
//                console.log($(iFrame));
//                console.log($(".richTextEditor"));
//                $(".richTextEditor").css("height", 0);
//                var actual_height = event.currentTarget.clientHeight;
////                var needed_height = event.currentTarget.offsetHeight + 16;
//                var new_height = event.view.document.height;
////                console.log("actual_height " + actual_height);
////                console.log("needed_height " + needed_height);
////                console.log("new_height " + new_height);
//                if (actual_height != new_height) {
////                    console.log("change height blur: ");
//                    $('.richTextEditor').css("height", new_height);
//                }
                var textUpdate = event.currentTarget.innerHTML;
                base.textArray[id] = textUpdate;
                var message = {
                    status:"text_update",
                    textId:id,
                    text:textUpdate
                };
                base.events.trigger('textEditor_notification', message);
            });
        },
        resizeIframes:function () {
            $('.richTextEditor').contents().each(function () {
                var elt = $(this);
                console.log("elt resize: ");
                console.log(elt);
            });
        }
    });

    return TextEditorView;
});