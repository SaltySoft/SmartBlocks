define([
    'jquery',
    'underscore',
    'backbone',
    'text!Templates/user_card.html'
], function ($, _, Backbone, testTemplate) {
    var UserCard = Backbone.View.extend({
        tagName:"div",
        className:"user_card",
        events:{

        },
        initialize:function () {
            this.render();
        },
        render:function () {
            var compiledTemplate = _.template(testTemplate, {username:this.model.get("username")});

            this.$el.html(compiledTemplate);
            return this;
        }
    });
    return UserCard;
});