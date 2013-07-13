define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Task = Backbone.Model.extend({
        urlRoot: "/Organization/Tasks",
        getDueDate: function () {
            return new Date(this.get("due_date") * 1000);
        },
        setDueDate: function (date) {
            this.set("due_date", date.getTime() / 1000);
        }
    });

    return Task;
});