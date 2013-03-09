define([
    'underscore',
    'backbone',
    'JobModel',
    'GroupModel'
], function (_, Backbone, Job, Group) {
    var User = Backbone.Model.extend({
        urlRoot: "/Users",
        defaults: {
            username: "unregistered"
        },
        parse : function (response, option) {

            var jobs = response.jobs;
            var job_array = new Array();
            for (var key in jobs)
            {
                var job = new Job(jobs[key]);
                job_array.push(job);
            }
            response.jobs = job_array;

            var groups = response.groups;
            var group_array = new Array();
            for (var key in groups)
            {
                var group = new Group(groups[key]);
                group_array.push(group);
            }
            response.groups = group_array;

            return response;
        }
    });

    return User;
});

