define([
    'underscore',
    'backbone',
    'JobModel',
    'JobsCollection',
    'text!Templates/job_list.html',
    'jqueryui'
], function (_, Backbone, Job, JobsCollection, JobsListTemplate) {
    var JobList = Backbone.View.extend({
        tagName:"div",
        className:"job_list",
        events:{

        },
        initialize:function () {
            var base = this;
            base.collection = new JobsCollection();
        },
        init:function (AppEvents) {
            this.AppEvents = AppEvents;
            this.load_page();
        },
        render: function () {
            var base = this;
            var compiledTemplate = _.template(JobsListTemplate, {jobs: base.collection.models});

            this.$el.html(compiledTemplate);
//            this.$el.find("ul").each(function () {
//                elt = $(this);
//                console.log(elt);
//                elt.sortable({
//                    connectWith: ".job_list_container"
//                });
//            });
            this.initializeEvents();
            return this;
        },
        load_page:function () {
            var base = this;
            base.collection.fetch({
                success:function (data) {
                    console.log(base.collection);
                    base.render();
                }
            });
        },
        initializeEvents:function() {

        }
    });
    return JobList;
});