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
        },
        addText:function (text) {
            var base = this;
            base.textArray.push(text);
        },
        show:function () {
            var base = this;
            for (var key in base.textArray) {
                alert(base.textArray[key]);
            }
        }
    });

    return TextEditorView;
});