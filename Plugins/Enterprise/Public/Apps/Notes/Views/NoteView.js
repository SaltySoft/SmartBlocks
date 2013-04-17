define([
    'jquery',
    'underscore',
    'backbone',
    'Enterprise/Apps/Notes/Models/Note'
], function ($, _, Backbone, Note) {
    var NoteView = Backbone.View.extend({
        tagName: "div",
        className: "ent_notes_noteview",
        initialize: function () {
        },
        init: function (SmartBlocks, note_id) {
            var base = this;

            base.SmartBlocks = SmartBlocks;
            //initializing the note that is going
            base.note = new Note({ id: note_id });
            //show some loading here
            base.note.fetch({
                success: function () {
                    //stop the loading there
                    base.render();
                }
            });
        },
        render: function () {
            var base = this;

            //Templating stuff and so on

            base.initializeEvents();
        },
        initializeEvents: function () {
            var base = this;
        }
    });

    return NoteView;
});