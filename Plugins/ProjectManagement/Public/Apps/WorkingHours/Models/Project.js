define([
    'underscore',
    'backbone',
    'UserModel',
    'ProjectManagement/Apps/WorkingHours/Models/WorkingDuration',
    'ProjectManagement/Apps/WorkingHours/Collections/WorkingDurations',
    'UsersCollection'
], function (_, Backbone, User, WorkingDuration, WorkingDurationsCollection, UsersCollection) {
    var Project = Backbone.Model.extend({
        urlRoot:"/ProjectManagement/Projects",
        defaults:{
        },
        parse:function (response) {
            //Attach working_duration
            var working_durations_array = response.working_durations;
            var working_durations_collection = new WorkingDurationsCollection();
            for (var k in working_durations_array) {
                var working_duration = new WorkingDuration(working_durations_array[k]);
                working_durations_collection.add(working_duration);
            }
            response.working_durations = working_durations_collection;

            //Attach users
            var users_array = response.users;
            var users_collection = new UsersCollection();
            for (var k in users_array) {
                var user = new User(users_array[k]);
                users_collection.add(user);
            }
            response.users = users_collection;

            return response;
        },
        getWorkingDurationIdAtDate:function (date) {
            var base = this;
            for (var k in base.working_durations) {
                if (k.date.getFullYear() == date.getFullYear()
                    && k.date.getMonth() == date.getMonth()
                    && k.date.getDate() == date.getDate())
                {
                    return k.id;
                }
            }

            return 0;
        },
        getWorkingDurationHoursAtDate:function (date) {
            var base = this;
            console.log("getWorkingDurationHoursAtDate");
            console.log("date", date);
            console.log("base", base);
            for (var k in base.working_durations) {
                console.log("k", k);
                if (k.date.getFullYear() == date.getFullYear()
                    && k.date.getMonth() == date.getMonth()
                    && k.date.getDate() == date.getDate())
                {
                    return k.get("hours_number");
                }
            }

            return 0;
        },
        getWorkingDurationFromDate:function (date) {
            var base = this;
            var working_durations = array();
            for (var k in base.working_durations) {
//                var today = date;
//                var tomorow = new Date();
//                tomorow.setDate(date.getDate() + 1);
//                var start_time = today.getTime() / 1000;
//                var end_time = tomorow.getTime() / 1000;
//                var wh_time = k.getDate();
//                console.log(wh_time);
//                if (wh_time < end_time && wh_time > start_time) {
//                    working_durations.add(k);
//                }
                var wh_date = new Date();
                wh_date.setDate(k.getDate());
            }
            console.log(working_durations);

            if (working_durations.length > 0) {
                return working_durations[0].id;
            }
            else {
                return 0;
            }
        }
    });

    return Project;
});