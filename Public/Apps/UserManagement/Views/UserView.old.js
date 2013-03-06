var UserView = Backbone.View.extend({
    tagName:"div",
    className:"User",
    events:{

    },
    initialize:function () {
        this.render();
    },
    render:function () {
        var base = this;
        base.$el.addClass("k_um_card");
        var wrapper = $(document.createElement("div"));

        var window_title = $(document.createElement("div"));
        window_title.addClass("k_um_card_title");
        window_title.html(base.model.get("username") + "'s User card");
        wrapper.append(window_title);

        //Form constructon
        var form = $(document.createElement("div"));

        //Name field
        var name_field = $(document.createElement("div"));
        name_field.addClass("k_um_card_field");

        var name_label = $(document.createElement("label"));
        name_label.html("Login : ");
        name_field.append(name_label);

        var name_input = $(document.createElement("input"));
        name_input.attr("type", "text");
        name_input.val(base.model.get("username"));
        name_field.append(name_input);

        form.append(name_field);


        //Firstname field
        var fn_field = $(document.createElement("div"));
        fn_field.addClass("k_um_card_field");

        var fn_label = $(document.createElement("label"));
        fn_label.html("Prénom");
        fn_field.append(fn_label);

        var fn_input = $(document.createElement("input"));
        fn_input.attr("type", "text");
        fn_input.val(base.model.get("firstname"));
        fn_field.append(fn_input);

        form.append(fn_field);

        //Firstname field
        var ln_field = $(document.createElement("div"));
        ln_field.addClass("k_um_card_field");

        var ln_label = $(document.createElement("label"));
        ln_label.html("Nom de famille");
        ln_field.append(ln_label);

        var ln_input = $(document.createElement("input"));
        ln_input.attr("type", "text");
        ln_input.val(base.model.get("lastname"));
        ln_field.append(ln_input);

        form.append(ln_field);

        wrapper.append(form);
//            base.$el.append(wrapper);
        var variables = {
            search_label:"test"
        };
        var template = _.template($("#search_template").html(), variables);
        base.$el.html(template);

        return this;
    }
});