define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    var OrganizationView = Backbone.View.extend({
        tagName: "div",
        className: "organization_view",
        initialize: function () {
            var base = this;
        },
        init: function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
        },
        render: function () {
            var base = this;
        },
        registereEvents: function () {
            var base = this;
        }
    });

    return OrganizationView;
});