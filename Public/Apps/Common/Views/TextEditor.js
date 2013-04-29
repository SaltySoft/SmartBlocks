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
            base.initializeRichTextEditorEvents();
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
                var id = frames.attr("data-id");
                var frame = frames[i];
                var frameDoc = frame.contentWindow.document;
                frameDoc.open();
                frameDoc.write(base.textArray[id]);
                frameDoc.close();
                frameDoc.designMode = "on";
            }
        },
        getInfo:function () {
            var base = this;
            for (var key in base.textArray) {
                alert(key + " : " + base.textArray[key]);
            }
        },
        initializeEvents:function () {
            var base = this;
//            base.$el.delegate(".textContent", "blur", function () {
//                var id = $(this).attr("data-id");
//                var newText = $(this).html();
//                base.textArray[id] = newText;
//            });
        },
        initializeRichTextEditorEvents:function () {
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

                return false;
            });
            $('body', $('.richTextEditor').contents()).blur(function (event) {
                var id = $(this).attr("data-id");
                base.textArray[id] = event.currentTarget.innerHTML;
                console.log("blur TextEditor : " + event.currentTarget.innerHTML);
            });
        }
    });

    return TextEditorView;
})
;