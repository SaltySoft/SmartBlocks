define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    var Model = Backbone.Model.extend({
        default: {
            name: "my deadline",
            start: new Date(),
            stop: new Date()
        },
        urlRoot: "/Organization/Deadlines",
        getStop: function () {
            var base = this;
            var date = new Date();
            date.setTime(base.get("stop"));
            return date;
        },
        setStop: function (date) {
            var base = this;
            base.set("stop", date.getTime());
        }
    });

    Model.generateStubs = function (activity) {
        var return_array = [];


        for (var i = 0; i < 10; i++) {
            var now = new Date();
            var start = new Date(now);
            var stop = new Date(now);

            start.setTime(now.getTime() - (Math.random() * 100000));

            stop.setTime(now.getTime() + (Math.random() * 100000));

            var deadline = new Model({
                name: "Deadline " + i,
                start: start,
                stop: stop,
                activity: activity
            });

            return_array.push(deadline);

        }

        return return_array;
    };

    return Model;
});