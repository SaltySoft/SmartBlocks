define([
    'jquery',
    'underscore',
    'backbone',
    'text!Meetings/Apps/Schemas/Templates/creation.html',
    'UsersCollection',
    'text!SearchResultsTemplate',
    'text!SelectionTemplate',
    'Meetings/Apps/Schemas/Models/Schema'
], function ($, _, Backbone, creationTemplate, UsersCollection, SearchResultsTemplate, SelectionTemplate, Schema) {
    var CreationView = Backbone.View.extend({
        tagName: "div",
        className: "cache",
        initialize: function () {

        },
        init: function (SmartBlocks, main_view) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.user_search_results = new UsersCollection();
            base.selected_users = new UsersCollection();
            base.main_view = main_view;
            base.render();
        },
        render: function  () {
            var base = this;
            var template = _.template(creationTemplate, {});
            var content = $(document.createElement("div"));
            content.addClass('ent_sch_cv');
            content.html(template);
            base.$el.append(content);
            base.initializeEvents();
        },
        initializeEvents: function () {
            var base = this;
            var search_timer = 0;
            base.$el.find(".user_search_input").keyup(function () {
                console.log('sdf');
                clearTimeout(search_timer);
                search_timer = setTimeout(function () {
                    console.log("stuff");
                    base.user_search_results.fetch({
                        data: {
                            filter:  base.$el.find(".user_search_input").val()
                        },
                        success: function () {
                            var template = _.template(SearchResultsTemplate, {
                                type: "User",
                                results: base.user_search_results.models,
                                field: "username"
                            });
                            base.$el.find(".user_search_result").html(template);
                            base.$el.find(".add_to_selection").click(function () {
                                var elt = $(this);
                                var model = base.user_search_results.get(elt.attr("data-id"));
                                base.selected_users.add(model);
                                console.log(base.selected_users);
                            });
                        }
                    });
                }, 100);


            });
            base.selected_users.on("add", function () {

                var template = _.template(SelectionTemplate, {
                    type: "User",
                    selection: base.selected_users.models,
                    field: "username"
                });
                base.$el.find(".user_selection").html(template);

                base.$el.find(".remove_from_selection").click(function () {
                    var elt = $(this);
                    base.selected_users.remove(base.selected_users.get(elt.attr("data-id")));
                });
            });

            base.selected_users.on("remove", function () {
                var template = _.template(SelectionTemplate, {
                    type: "User",
                    selection: base.selected_users.models,
                    field: "username"
                });

                base.$el.find(".user_selection").html(template);

                base.$el.find(".remove_from_selection").click(function () {
                    var elt = $(this);
                    base.selected_users.remove(base.selected_users.get(elt.attr("data-id")));
                });
            });

            base.$el.find(".ent_sch_cv_validate").click(function () {
                var schema = new Schema({
                    name: base.$el.find(".ent_sch_cv_name").val(),
                    participants: base.selected_users.toArray()
                });

                base.SmartBlocks.startLoading("Creating schema");
                schema.save({}, {
                    success: function () {
                        base.hide();
                        base.main_view.fetchSchemas(function () {
                            base.SmartBlocks.stopLoading();
                        });
                    }
                });
            });

            base.$el.find(".cancel_button").click(function () {
                base.hide();
            });

        },
        show: function () {
            var base = this;
            $("body").append(base.$el);

            base.$el.show();
        },
        hide: function () {
            var base = this;
            base.$el.remove();
        }
    });

    return CreationView;
});