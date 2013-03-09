define([
    'jquery',

    'underscore',
    'backbone',
    'text!Templates/tabs.html',
    'jqueryui'
], function ($, _, Backbone, TabsTemplate) {
    var AppView = Backbone.View.extend({
        tagName:"div",
        className:"k_um_tabs_view",
        events:{

        },
        initialize:function () {

        },
        init:function (AppEvents) {
            this.AppEvents = AppEvents;
            this.render();
        },
        render:function () {
            var base = this;
            var template = _.template(TabsTemplate, {
            });
            base.$el.html(template);
            $("#tabs").tabs();
            $("#tabs").click(function(){
                alert('hey');
            });
        }
    });

    return AppView;
});