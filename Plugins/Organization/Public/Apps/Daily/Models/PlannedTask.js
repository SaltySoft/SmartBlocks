define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var PlannedTask = Backbone.Model.extend({
        urlRoot: "/Organization/PlannedTasks",
        getStart: function () {
            return new Date(this.get("start"));
        },
        setStart: function (date) {
            console.log(date);
            this.set("start", date.getTime());
            console.log(this);
        }
    });

    return PlannedTask;
});