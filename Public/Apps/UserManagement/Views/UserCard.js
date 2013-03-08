define([
    'jquery',
    'underscore',
    'backbone',

    'text!Templates/user_card.html'
], function ($, _, Backbone, testTemplate) {
    var UserCard = Backbone.View.extend({
        tagName:"div",
        className:"user_card",
        events:{
            "click .k_um_remove_job_button": "removeJob",
            "click .k_um_user_save_button": "saveModel"
        },
        initialize:function () {

        },
        init:function (AppEvents) {
            this.AppEvents = AppEvents;
            this.render();
        },
        render:function () {
            var compiledTemplate = _.template(testTemplate, {username:this.model.get("username"), user:this.model});

            this.$el.html(compiledTemplate);
            this.initializeEvents();
            return this;
        },
        initializeEvents:function(){
            var base = this;
            this.$el.find(".k_um_username_input").keyup(function () {
                var elt = $(this);
                base.model.set({ username: elt.val() });
            });
        },
        removeJob:function(ev) {
            var base = this;
            var job_id = $(ev.currentTarget).attr('data-job_id');
            var jobs = this.model.get("jobs");
            var newJobs = new Array();
            for (var key in jobs) {
                if (jobs[key].get("id") == job_id) {
                    console.log("Found job");
                } else {
                    newJobs.push(jobs[key]);
                }
            }
            this.model.set({ jobs: newJobs });
            console.log(this.model.get("jobs"));
            base.render();
        },
        saveModel:function () {
            var base = this;
            this.model.save({}, {
                success: function () {
//                    show_message("The user was saved");
                    base.render();
                    base.AppEvents.trigger("user_updated");
                }
            });
        }
    });
    return UserCard;
});