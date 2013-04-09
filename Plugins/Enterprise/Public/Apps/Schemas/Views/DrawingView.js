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
            init: function (SmartBlocks, SchemaController, id) {
                var base = this;
                base.SmartBlocks = SmartBlocks;
                base.schema = new Schema();
                base.controller = SchemaController;
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
            image_ready: false,
            setImage: function (dataUrl, callback, above) {
                var base = this;
                base.current_image = new Image();
                base.image_ready = false;
                if (dataUrl !== undefined) {
                    if (above) {
                        var image = new Image();
                        image.src = dataUrl;
                        image.onload = function () {
                            base.image_ready = true;
                            base.context.drawImage(image, 0, 0);
                            base.current_image.src = base.canvas[0].toDataURL("image/png");
                        };

                    } else {
                        base.current_image.src = dataUrl;
                    }

                } else {
                    var dataUrle = base.canvas[0].toDataURL("image/png");
                    base.current_image.src = dataUrle;
                    base.schema.set('data', dataUrle);
                    console.log("SEt image");
                }
                base.current_image.onload = function () {
                    base.image_ready = true;
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
            drawing: false,
            mouseDown: function (e, xx, yy) {
                var base = this;
                clearTimeout(base.share_timer)
                base.drawing = true;
                base.setImage(undefined, function () {
                    base.current_tool.mousedown(e, xx, yy);
                    var x = 0;
                    var y = 0;
                    if (xx !== undefined && yy !== undefined) {
                        x = xx;
                        y = yy;
                    } else {
                        x = e.pageX - base.canvas.offset().left;
                        y = e.pageY - base.canvas.offset().top;
                    }

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

            },
            mouseMove: function (e, xx, yy) {
                var base = this;
                if (base.drawing) {
                    var ms = (new Date()).getTime();
                    var x = 0;
                    var y = 0;
                    if (xx !== undefined && yy !== undefined) {
                        x = xx;
                        y = yy;
                    } else {
                        x = e.pageX - base.canvas.offset().left;
                        y = e.pageY - base.canvas.offset().top;
                    }
                    console.log(ms);
                    console.log(ms > base.lastms + 50);
                    if (ms > base.lastms + 10) {
                        lastx = x;
                        lasty = y;
                        base.lastms = ms;
                        base.current_tool.mousemove(e, xx, yy);
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
            },
            mouseUp: function (e, xx, yy) {
                var base = this;
                if (base.drawing) {
                    base.current_tool.mouseup(e, xx, yy);
                    base.drawing = false;
                    var x = 0;
                    var y = 0;
                    if (xx !== undefined && yy !== undefined) {
                        x = xx;
                        y = yy;
                    } else {
                        x = e.pageX - base.canvas.offset().left;
                        y = e.pageY - base.canvas.offset().top;
                    }
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
            },
            initializeEvents: function () {
                var base = this;

                base.$el.find(".ent_sch_dv_backtomenu_button").click(function () {
                    base.controller.Menu();
                });

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
                    base.mouseDown(e);
                });
                var lastx = 0;
                var lasty = 0;

                base.lastms = (new Date()).getTime();
                base.canvas.mousemove(function (e) {
                    base.mouseMove(e);

                });

                $(document).mouseup(function (e) {
                    base.mouseUp(e);
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
                                    var previous_color = base.context.strokeStyle;
                                    base.context.strokeStyle = message.color;
                                    var previous_width = base.context.lineWidth;
                                    base.users[message.user].tool.size = message.size;
                                    base.context.lineWidth = message.size;
                                    base.users[message.user].tool.mousedown(null, message.x, message.y);
                                    base.context.strokeStyle = previous_color;
                                    base.context.lineWidth = previous_width;
                                    base.setImage();
                                }
                                if (message.action == "mousemove") {
                                    if (base.image_ready) {
                                        var previous_color = base.context.strokeStyle;
                                        base.context.strokeStyle = message.color;
                                        var previous_width = base.context.lineWidth;
                                        console.log(message.color);
                                        base.users[message.user].tool.size = message.size;
                                        base.context.lineWidth = message.size;
                                        base.users[message.user].tool.mousemove(null, message.x, message.y);
                                        base.context.strokeStyle = previous_color;
                                        base.context.lineWidth = previous_width;
                                    }

//                                    base.setImage();
                                }
                                if (message.action == "mouseup") {
                                    var previous_color = base.context.strokeStyle;
                                    var previous_width = base.context.lineWidth;
                                    base.context.strokeStyle = message.color;
                                    base.users[message.user].tool.size = message.size;
                                    base.context.lineWidth = message.size;
                                    base.users[message.user].tool.mouseup(null, message.x, message.y);
                                    base.context.strokeStyle = previous_color;
                                    base.context.lineWidth = previous_width;
                                    base.saveState();
                                }
                            }
                        }
                    }
                });
                $(document).keyup(function (e) {
                    if (e.keyCode == 79) {
                        base.launchSimulation();
                        base.simulation = true;
                    }
                });
                $(document).keyup(function (e) {
                    if (e.keyCode == 70) {
                        base.simulateMouseUp();
                        base.simulation = false;
                    }
                });
            },
            simulation: false,
            simx: 50,
            simy: 50,
            launchSimulation: function () {
                var base = this;
                base.simulateMouseDown();
                setInterval(function () {
                    base.simulateMouseMove();
                    base.simx++;
                    if (base.simx > 400) {
                        base.simx = 50;
                        base.simy += 20;
                    }
                }, 50);

            },
            simulateMouseDown: function () {
                var base = this;
                base.mouseDown(null, base.simx, base.simy);
            },
            simulateMouseMove: function () {
                var base = this;
                if (base.simulation)
                    base.mouseMove(null, base.simx, base.simy);
            },
            simulateMouseUp: function () {
                var base = this;
                if (base.simulation)
                    base.mouseUp(null, base.simx, base.simy);
                base.simx = 0;
                base.simy = 0;
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
                        for (var k in sessions) {
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