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
            console.log(date);
            this.set("due_date", date.getTime() / 1000);
            console.log(this);
        },
        constructor: function() {
            Backbone.Model.apply(this, arguments);
            if (!this.attributes.id) {
                var date = new Date();
                date.setHours(23);
                date.setMinutes(59);
                date.setSeconds(0);
                date.setMilliseconds(0);
                this.setDueDate(date);
                console.log("DATE", this.get("due_date"), date);
            }
        }
    });

    return Task;
});