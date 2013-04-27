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
        init:function (AppEvents) {
            var base = this;
            this.AppEvents = AppEvents;

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
//            base.$el.find(".textContent").hide();
            var frames = $(".richTextEditor");
            for (var i = 0; i < frames.length; ++i) {
                var frame = frames[i];
                var frameDoc = frame.contentWindow.document;
                frameDoc.open();
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
        fontEdit:function (x, y) {
            var base = this;
            base.iFrameTextEditor.document.execCommand(x, "", y);
            base.iFrameTextEditor.focus();
        },
        initializeEvents:function () {
            var base = this;
            base.$el.delegate(".textContent", "blur", function () {
                var id = $(this).attr("data-id");
                var newText = $(this).html();
                base.textArray[id] = newText;
            });
        },
        initializeRichTextEditorEvents:function () {
            var base = this;

            base.$el.delegate(".editor_button", "click", execCommand);
            function execCommand(e) {
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
            }

//            base.$el.delegate("#showText", "click", function () {
//
//            });
//
//            base.$el.delegate(".richTextEditor", "blur", function () {
//                alert("leaving iFrame");
////                document.getElementById(editor).contentWindow.document.body.innerHTML;
//            });
//
//            base.$el.delegate(".richTextEditor_containerDiv", "blur", function () {
//                alert("leaving iFrame container");
////                document.getElementById(editor).contentWindow.document.body.innerHTML;
//            });
        }
    });

    return TextEditorView;
})
;