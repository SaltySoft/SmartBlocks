define([
    'jquery',
    'underscore',
    'backbone',
    'text!Enterprise/Apps/Schemas/Templates/draw_view.html',
    'Enterprise/Apps/Schemas/Business/Tools',
    'Enterprise/Apps/Schemas/Models/Schema',
    'ColorPicker'
], function ($, _, Backbone, DrawTemplate, Tools, Schema) {
    var DrawView = Backbone.View.extend({
            tagName: "div",
            className: "ent_sch_drawview",
            tools: {

            },
            base_tools: {

            },
            current_tool: undefined,
            saved_states: [],
            current_state: 0,
            initialize: function () {
                var base = this;


            },
            init: function (SmartBlocks, id) {
                var base = this;
                base.SmartBlocks = SmartBlocks;
                base.schema = new Schema();
                base.render();
                if (id) {
                    base.load(id);
                }
            },
            render: function () {
                var base = this;
                var template = _.template(DrawTemplate, {});

                base.$el.html(template);

                base.canvas = base.$el.find('#ent_sch_dv_canvas');
                if (!base.canvas) {
                    return;
                }

                base.context = base.canvas[0].getContext('2d');
                if (!base.context) {
                    return;
                }
                var colorpicker = base.$el.find(".ent_sch_dv_colorpicker");
                var slider = colorpicker.find(".slider")[0];
                var picker = colorpicker.find(".picker")[0];
                colorpicker.append(slider, picker);

                ColorPicker(
                    slider,
                    picker,
                    function (hex, hsv, rgb) {
                        var color = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
                        base.$el.find(".color_chooser").css("background-color", color);
                        base.context.strokeStyle = color;


                    });
                base.current_image = new Image();
                base.initializeEvents();
            },
            current_image: undefined,
            setImage: function (dataUrl, callback, above) {
                var base = this;
                base.current_image = new Image();
                if (dataUrl !== undefined) {
                    if (above) {
                        var image = new Image();
                        image.src = dataUrl;
                        image.onload = function () {
                            base.context.drawImage(image, 0, 0);
                            base.current_image.src = base.canvas[0].toDataURL("image/png");
                        };

                    } else {
                        base.current_image.src = dataUrl;
                    }

                } else {
                    dataUrl = base.canvas[0].toDataURL("image/png");
                    base.current_image.src = dataUrl;
//                    base.share();
                    base.schema.set('data', dataUrl);
                }
                base.current_image.onload = function () {
                    if (callback !== undefined)
                        callback();
                };
            },
            resetImage: function (above) {
                var base = this;
                if (above === undefined || above == false)
                    base.context.clearRect(0, 0, base.canvas[0].width, base.canvas[0].height);
                base.context.drawImage(base.current_image, 0, 0);
            },
            undo: function () {
                var base = this;

                if (base.current_state < base.saved_states.length && base.current_state >= 0) {
                    if (base.saved_states[base.current_state - 1] !== undefined) {
                        base.setImage(base.saved_states[--base.current_state], function () {
                            base.resetImage();
                        });

                    }
                }
            },
            redo: function () {
                var base = this;

                if (base.current_state < base.saved_states.length && base.current_state >= 0) {
                    if (base.saved_states[base.current_state + 1] !== undefined) {
                        base.setImage(base.saved_states[++base.current_state], function () {
                            base.resetImage();
                        });
                    }


                }
            },
            saveState: function () {
                var base = this;
                if (base.current_state < base.saved_states.length - 1) {
                    var new_states = [];
                    for (k in base.saved_states) {
                        if (k <= base.current_state) {
                            new_states.push(base.saved_states[k]);
                        }
                    }
                    base.saved_states = new_states;
                }
                base.saved_states.push(base.current_image.src);
                base.current_state = base.saved_states.length - 1;
            },
            initializeEvents: function () {
                var base = this;
                base.drawing = false;

                var brush = new Tools.Brush(base);
                base.base_tools[0] = Tools.Brush;
                base.base_tools[1] = Tools.LineTool;
                base.base_tools[2] = Tools.RectangleTool;
                base.tools[0] = brush;
                base.tools[1] = new Tools.LineTool(base);
                base.tools[2] = new Tools.RectangleTool(base);


                base.current_tool = base.tools[0];
                base.tool_id = 0;

                base.$el.find(".saved_color").click(function () {
                    var elt = $(this);
                    var color = elt.css("background-color");
                    base.$el.find(".color_chooser").css("background-color", color);
                    base.context.strokeStyle = color;
                });

                base.$el.find(".tool").click(function () {
                    var elt = $(this);
                    base.tool_id = elt.attr("data-id");
                    base.current_tool = base.tools[base.tool_id];
                    base.$el.find(".ent_sch_dv_toolsize").val(base.current_tool.size);
                });

                base.$el.find(".ent_sch_dv_toolsize").val(base.current_tool.size);

                var hide_colors_timer = 0;
                base.$el.find(".ent_sch_dv_colorpicker").mouseover(function () {
                    clearTimeout(hide_colors_timer);
                });
                var color_index = 0;
                base.$el.find(".ent_sch_dv_colorpicker").mouseout(function () {
                    clearTimeout(hide_colors_timer);
                    hide_colors_timer = setTimeout(function () {
                        base.$el.find(".ent_sch_dv_colorpicker").hide();
                        var i = 0;

                        base.$el.find(".saved_color").each(function () {
                            var elt = $(this);
                            if (i == color_index) {
                                elt.css("background-color", base.$el.find(".color_chooser").css("background-color"));
                            }
                            i++;
                        });
                        color_index++;
                        color_index = color_index % 20;
                    }, 100);
                });

                base.$el.find(".color_chooser").click(function () {
                    base.$el.find(".ent_sch_dv_colorpicker").show();
                });

                base.$el.find(".ent_sch_dv_toolsize").change(function () {
                    var elt = $(this);
                    base.current_tool.setSize(elt.val());
                })
                base.$el.find(".ent_sch_dv_toolsize").keyup(function () {
                    var elt = $(this);
                    base.current_tool.setSize(elt.val());
                });
                base.drawing = false;

                base.canvas.mousedown(function (e) {
                    clearTimeout(base.share_timer)
                    base.drawing = true;
                    base.current_tool.mousedown(e);
                    var x = e.pageX - base.canvas.offset().left;
                    var y = e.pageY - base.canvas.offset().top;
                    base.SmartBlocks.sendWs("schemas", {
                        action: "mousedown",
                        user: base.SmartBlocks.current_user.get('session_id'),
                        x: x,
                        y: y,
                        size: base.current_tool.size,
                        color: base.$el.find(".color_chooser").css("background-color"),
                        tool_id: base.tool_id
                    }, base.schema.get('sessions'));
                });
                var lastx = 0;
                var lasty = 0;

                var lastms = (new Date()).getTime();
                base.canvas.mousemove(function (e) {
                    if (base.drawing) {
//                        clearTimeout(base.share_timer)
                        var ms =  (new Date()).getTime();
                        var x = e.pageX - base.canvas.offset().left;
                        var y = e.pageY - base.canvas.offset().top;
                        console.log(ms);
                        console.log(ms > lastms + 50);
                        if (ms > lastms + 50){
                            lastx = x;
                            lasty = y;
                            lastms = ms;
                            base.current_tool.mousemove(e);
                            base.SmartBlocks.sendWs("schemas", {
                                action: "mousemove",
                                user: base.SmartBlocks.current_user.get('session_id'),
                                x: x,
                                y: y,
                                size: base.current_tool.size,
                                color: base.$el.find(".color_chooser").css("background-color"),
                                tool_id: base.tool_id
                            }, base.schema.get('sessions'));
                        }

                    }

                });

                $(document).mouseup(function (e) {
                    if (base.drawing) {
                        base.current_tool.mouseup(e);
                        base.drawing = false;
                        var x = e.pageX - base.canvas.offset().left;
                        var y = e.pageY - base.canvas.offset().top;
                        base.SmartBlocks.sendWs("schemas", {
                            action: "mouseup",
                            user: base.SmartBlocks.current_user.get('session_id'),
                            x: x,
                            y: y,
                            size: base.current_tool.size,
                            color: base.$el.find(".color_chooser").css("background-color"),
                            tool_id: base.tool_id
                        }, base.schema.get('sessions'));
                        base.setImage();
                        base.saveState();

                    }
                });

                base.$el.find(".ent_sch_dv_save_button").click(function () {
                    base.save();
                });

                base.$el.find('.ent_sch_dv_undo_button').click(function (e) {

                    base.undo();
                });

                base.$el.find('.ent_sch_dv_redo_button').click(function (e) {

                    base.redo();
                });

                base.setImage();
                base.saveState();


                base.SmartBlocks.events.on("ws_notification", function (message) {
                    console.log("recepted");
                    if (message.app == "schemas") {
                        if (message.user != base.SmartBlocks.current_user.get('session_id')) {

                            if (message.image) {
                                var image = new Image();
                                console.log(message);
                                image.src = message.image;
                                image.onload = function () {
                                    base.context.drawImage(image, 0, 0);
                                }
                            } else {
                                if (message.action == "mousedown") {

                                    console.log("user", base.users[message.user]);
                                    base.users[message.user].tool = new base.base_tools[message.tool_id](base);
                                    if (!base.context) {
                                        return;
                                    }
                                    var previous_color =  base.context.strokeStyle;
                                    base.context.strokeStyle = message.color;
                                    base.users[message.user].tool.size = message.size;
                                    base.users[message.user].tool.mousedown(null, message.x, message.y);
                                    base.context.strokeStyle = previous_color;
                                    base.setImage();
                                }
                                if (message.action == "mousemove") {
                                    var previous_color =  base.context.strokeStyle;
                                    base.context.strokeStyle = message.color;
                                    console.log(message.color);
                                    base.users[message.user].tool.size = message.size;
                                    base.users[message.user].tool.mousemove(null, message.x, message.y);
                                    base.context.strokeStyle = previous_color;
                                }
                                if (message.action == "mouseup") {
                                    var previous_color =  base.context.strokeStyle;
                                    base.context.strokeStyle = message.color;
                                    base.users[message.user].tool.size = message.size;
                                    base.users[message.user].tool.mouseup(null, message.x, message.y);
                                    base.context.strokeStyle = previous_color;
                                    base.setImage();
                                    base.saveState();
                                }
                            }
                        }
                    }
                });
            },
            users: {},
            load: function (id) {
                var base = this;
                base.schema = new Schema({ id: id });
                base.schema.fetch({
                    success: function (o) {
                        base.schema = o;
                        base.setImage(base.schema.get('data'), function () {
                            base.resetImage();
                        });
                        base.users = {};
                        var sessions = base.schema.get('sessions')
                        for (var k in sessions){
                            base.users[sessions[k]] = {};
                        }
                    }
                });

            },
            save: function () {
                var base = this;
                base.schema.save();
            }

        })
        ;

    return DrawView;
})
;