define([
    'jquery',
    'underscore',
    'backbone',
    'SmartBlocks',
    'text!Templates/user_card.html',
    'Models/Job',
    'Collections/Jobs',
    'Models/Group',
    'Collections/Groups',
    'jqueryui'
], function ($, _, Backbone, SmartBlocks, testTemplate, Job, Jobs, Group, Groups) {
    var UserCard = Backbone.View.extend({
        tagName:"div",
        className:"k_um_card",
        events:{
            "click .k_um_remove_job_button":"removeJob",
            "click .k_um_user_save_button":"saveModel",
            "click .k_um_user_delete_button":"deleteModel"
        },
        initialize:function () {
            var base = this;
            base.$el.hide();
        },
        init:function (AppEvents) {
            var base = this;
            this.AppEvents = AppEvents;

            this.job_list = new Jobs();

            this.job_list.fetch({
                success:function () {

                    base.group_list = new Groups();
                    base.group_list.fetch({
                        success:function () {
                            if (!base.model.isNew()) {
                                base.render();
                                base.$el.fadeIn(200);
                            }
                        }
                    });
                }
            });
        },
        render:function () {
            var base = this;
            var compiledTemplate = _.template(testTemplate, {username:this.model.get("username"), user:this.model, jobs:this.job_list.models, groups:this.group_list.models});

            this.$el.html(compiledTemplate);
            base.updateJobs();
            base.updateGroups();
            this.$el.find(".job_item").disableSelection();
            this.$el.find(".job_item").click(function () {
                elt = $(this);
                var job = new Job({id:elt.attr("data-job_id")});
                var jobs = base.model.get("jobs");
                if (elt.hasClass("owned_job")) {

                    var new_jobs = new Array();
                    for (var k in jobs) {
                        if (jobs[k].get('id') != elt.attr('data-job_id')) {
                            new_jobs.push(jobs[k]);
                        }
                    }
                    base.model.set({jobs:new_jobs});
                } else {
                    var job = new Job({id:elt.attr("data-job_id")});
                    var jobs = base.model.get("jobs");
                    jobs.push(job);
                    base.model.set({jobs:jobs});
                }


                base.updateJobs();
            });

            this.$el.find(".group_item").disableSelection();
            this.$el.find(".group_item").click(function () {
                elt = $(this);
                var group = new Group({id:elt.attr("data-group_id")});
                var groups = base.model.get("groups");
                if (elt.hasClass("owned_group")) {

                    var new_groups = new Array();
                    for (var k in groups) {
                        if (groups[k].get('id') != elt.attr('data-group_id')) {
                            new_groups.push(groups[k]);
                        }
                    }
                    base.model.set({groups:new_groups});
                } else {
                    var group = new Group({id:elt.attr("data-group_id")});
                    var groups = base.model.get("groups");
                    groups.push(group);
                    base.model.set({groups:groups});
                }


                base.updateGroups();
            });
            this.initializeEvents();
            return this;
        },
        updateJobs:function () {
            var base = this;
            this.$el.find(".job_item").each(function () {
                elt = $(this);
                var model_jobs = base.model.get('jobs');
                elt.addClass("not_owned_job");
                elt.removeClass("owned_job");
                for (var k in base.model.get('jobs')) {
                    if (model_jobs[k].get('id') == elt.attr('data-job_id')) {
                        elt.addClass("owned_job");
                        elt.removeClass("not_owned_job");
                    }
                }
            });
        },
        updateGroups:function () {
            var base = this;
            this.$el.find(".group_item").each(function () {
                elt = $(this);
                var model_groups = base.model.get('groups');
                elt.addClass("not_owned_group");
                elt.removeClass("owned_group");
                for (var k in base.model.get('groups')) {
                    if (model_groups[k].get('id') == elt.attr('data-group_id')) {
                        elt.addClass("owned_group");
                        elt.removeClass("not_owned_group");
                    }
                }
            });
        },
        initializeEvents:function () {
            var base = this;
            this.$el.find(".k_um_username_input").keyup(function () {
                var elt = $(this);
                base.model.set({ username:elt.val() });
            });
            this.$el.find(".k_um_firstname_input").keyup(function () {
                var elt = $(this);
                base.model.set({ firstname:elt.val() });
            });
            this.$el.find(".k_um_lastname_input").keyup(function () {
                var elt = $(this);
                base.model.set({ lastname:elt.val() });
            });

        },
        removeJob:function (ev) {
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
            this.model.set({ jobs:newJobs });
            console.log(this.model.get("jobs"));
            base.render();
        },
        saveModel:function () {
            var base = this;
            this.model.save({}, {
                success:function () {
                    SmartBlocks.show_message("The user was saved");
                    base.render();
                    base.AppEvents.trigger("user_updated");
                }
            });
        },
        deleteModel:function () {
            var base = this;
            if (confirm("Are you sure you want to delete this user ?"))
            {
                this.model.destroy({
                    success:function (model, response) {
                        if (response.message && response.message == "success")
                        {
                            SmartBlocks.show_message("The user was successfully deleted");
                            base.AppEvents.trigger("user_updated");
                            window.location.hash = "edit_user";

                        }
                        else
                        {
                            SmartBlocks.show_message("The user couldn't be deleted");
                        }
                    }
                });
            }
        }
    });
    return UserCard;
});