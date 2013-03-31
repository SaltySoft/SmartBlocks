define([
    'jquery',
    'underscore',
    'backbone',
    'jqueryflip',
    'Enterprise/Apps/Notes/Views/Panel',
    'Enterprise/Apps/Notes/Views/CreateNote',
    'text!Enterprise/Apps/Notes/Templates/dashboard.html'
], function ($, _, Backbone, JqueryFlip, PanelView, CreateNoteView, DashboardTemplate) {
    var Dashboard = Backbone.View.extend({
        tagName:"div",
        className:"ent_notes_dashboard",
        events:{
        },
        initialize:function () {
        },
        init:function (AppEvents) {
            var base = this;
            this.AppEvents = AppEvents;

            var notes_panel = new PanelView();
            notes_panel.init(this.AppEvents);
            notes_panel.render();
            base.$el.html(notes_panel.$el);

            var create_note = new CreateNoteView();
            base.create_note = create_note;
            base.create_note.init(this.AppEvents);
            base.create_note.render();
            base.$el.prepend(base.create_note.$el);
        },
        render:function () {
            var base = this;
            var template = _.template(DashboardTemplate, {
                enterprise:"enterprise"
            });
            base.$el.append(template);
            base.initializeEvents();
        },
        showCreateNote:function () {
            var base = this;
            base.create_note.show();
        },
        clear:function () {
            var base = this;
            base.$el.find(".notes_container").html("");
        },
        initializeEvents:function () {
            var base = this;
        }
    });
    return Dashboard;
});