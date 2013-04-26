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
        render:function (refetch) {
            var base = this;
            var template = _.template(TextEditorTemplate, {
                texts:base.textArray
            });
            base.$el.html(template);
            base.initializeEvents();
        },
        addTextInit:function (text, id) {
            var base = this;
            base.textArray[id] = text;
        },
        addText:function (text, id) {
            var base = this;
//            var newTextContainer = $(document.createElement("div"));
//            newTextContainer.addClass("textContainer");
//            var newTextContent = $(document.createElement("textarea"));
//            newTextContent.addClass("textContent");
//            newTextContent.name = "textAreaContent" + base.textArray.length;
//            newTextContent.attr("data-id", id);
//            newTextContent.html(text);
//            newTextContainer.append(newTextContent);
//            base.$el.find(".text_editor_container").append(newTextContainer);
            base.textArray[id] = text;
            base.render();
        },
        getText:function (id) {
            var base = this;
            return (base.textArray[id]);
        },
        show:function () {
            var base = this;
            for (var key in base.textArray) {
                alert(key + " : " + base.textArray[key]);
            }
        },
        initializeEvents:function () {
            var base = this;
            base.$el.delegate(".textContent", "blur", function () {
                var id = $(this).attr("data-id");
                var newText = $(this).html();
                base.textArray[id] = newText;
            });
        }
    });

    return TextEditorView;
});