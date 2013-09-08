define([
    'jquery',
    'underscore',
    'backbone',
    'text!../Templates/activity_search_controls.html'
], function ($, _, Backbone, ActivitySearchControlsTemplate) {
    var View = Backbone.View.extend({
        tagName:"div",
        className:"activity_search_controls",
        initialize:function () {
            var base = this;
            base.parameters = {};
        },
        init:function (SmartBlocks, parent) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.parent = parent;
            base.activity_types = base.parent.activity_types;

            base.render();
            base.registerEvents();

            base.parent.events.on("activity_types_loaded", function () {
                base.$el.find(".types_select").find(".activity_types").remove();
                for (var k in base.activity_types.models) {
                    var activity_type = base.activity_types.models[k];
                    base.$el.find(".types_select").append('<option class="activity_type" value="' + activity_type.get("id") + '">' + activity_type.get("name") + '</option>');
                }
            });
        },
        render:function () {
            var base = this;
            var template = _.template(ActivitySearchControlsTemplate, {});
            base.$el.html(template);
        },
        submitForm:function () {
            var base = this;
            var form = base.$el.find(".search_ctrls_form");
            var array = form.serializeArray();
            base.parameters = {};
            for (var k in array) {
                base.parameters[array[k].name] = array[k].value;
            }
            base.parent.events.trigger("load_list_with_params", base.parameters);
        },
        registerEvents:function () {
            var base = this;

            var timer = 0;
            base.$el.delegate(".name_filter", "keyup", function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    base.submitForm();
                }, 500);
            });

            base.$el.delegate("#show_arch_checkbox", "click", function () {
                base.submitForm();
            });

            base.$el.delegate(".types_select", "change", function () {
                base.submitForm();
            });

            base.$el.delegate("form", "submit", function () {
                var form = $(this);
                var array = form.serializeArray();
                base.parameters = {};
                for (var k in array) {
                    base.parameters[array[k].name] = array[k].value;
                }
                base.parent.events.trigger("load_list_with_params", base.parameters);
            });
        }
    });

    return View;
});