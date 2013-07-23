define([
    'jquery',
    'underscore',
    'backbone',
    'text!ProjectManagement/Apps/CostsManagement/Templates/project_list_item.html',
    'ProjectManagement/Apps/CostsManagement/Models/Role',
    'ProjectManagement/Apps/CostsManagement/Collections/Roles'
], function ($, _, Backbone, ProjectsListItemTemplate, Role, RolesCollection) {

    var ProjectsListItem = Backbone.View.extend({
        tagName:"div",
        className:"pm_project_item",
        initialize:function (model) {
            var base = this;
            base.project = model;
        },
        init:function (SmartBlocks) {
            var base = this;
            base.SmartBlocks = SmartBlocks;
            base.roles = new RolesCollection({});
            base.roles.fetch({
                data:{
                    project_id:base.project.get('id')
                },
                success:function () {
                    base.render();
                }
            });
        },
        render:function () {
            var base = this;
            if (base.roles.length > 0) {
                var projectsListItemTemplate = _.template(ProjectsListItemTemplate, {
                    project:base.project,
                    roles:base.roles.models
                });
                base.$el.html(projectsListItemTemplate);
                base.initializeEvents();
            }
        },
        initializeEvents:function () {
            var base = this;

            base.$el.delegate(".role_td", "click", function (event) {
                event.stopPropagation();
                var elt = $(this);
                elt.addClass("editing");
                var display = elt.find(".display");
                var edition = elt.find(".edition");
                var input = elt.find(".input");
                input.val(display.html());
                display.hide();
                edition.show();
                input.focus();
            });

            base.$el.delegate(".role_td", "keydown", function (event) {
                var currentInput = event.target;
                event.stopPropagation();
                if (event.keyCode == 13) {
                    $(currentInput).focusout();
                    event.stopPropagation();
                }
            });

            base.$el.delegate(".input", "blur", function (event) {
                event.stopPropagation();
                var elt = $(this);
                var role_td = elt.parents(".role_td");
                role_td.removeClass("editing");
                var display = role_td.find(".display");
                var edition = role_td.find(".edition");
                var input = role_td.find(".input");
                var value = input.val();
                display.html(value);
                display.show();
                edition.hide();
                if (input.attr("data-type") == "name") {
                    var role = new Role({
                        id:input.attr("data-rid")
                    });
                }
                if (input.attr("data-type") == "cost") {
                    var role = new Role({
                        id:input.attr("data-rid")
                    });
                }
                if (role !== undefined) {
                    role.fetch({
                        success:function () {
                            if (input.attr("data-type") == "name") {
                                role.attributes.name = value;
                                role.save({});
                            }
                            if (input.attr("data-type") == "cost") {
                                role.attributes.cost = value;
                                role.save({});
                            }
                        }
                    })
                }
            });

            $('table tr td').hover(function () {
                $(this).addClass('odd');
            }, function () {
                $(this).removeClass('odd');
            });

            $('table tr td').click(function () {
                $(this).addClass('editing');
            }, function () {
                $(this).removeClass('editing');
            });
        }
    });

    return ProjectsListItem;
});