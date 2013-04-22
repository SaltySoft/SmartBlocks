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
        },
        render:function () {
            var base = this;
            var template = _.template(TextEditorTemplate, {
            });
            base.$el.html(template);
        },
        show:function () {
        }
    });

    return TextEditorView;
});