define([
    'underscore',
    'backbone',
    './Job'
], function (_, Backbone, Job) {
    var User = Backbone.Model.extend({
        urlRoot: "/Users",
        defaults: {
            username: "unregistered"
        },
        parse : function (response, option) {

            var jobs = response.jobs;
            var job_array = new Array();
            for (key in jobs)
            {
                var job = new Job(jobs[key]);
                job_array.push(job);
            }
            response.jobs = job_array;



            return response;
        }
    });

    return User;
});

