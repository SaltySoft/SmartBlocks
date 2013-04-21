define([
    'jquery',
    'underscore',
    'backbone',
    'text!Enterprise/Apps/Schemas/Templates/draw_view.html',
    'Enterprise/Apps/Schemas/Business/Tools',
    'Enterprise/Apps/Schemas/Models/Schema',
    'text!Enterprise/Apps/Schemas/Templates/text_overlay.html',
    'Enterprise/Apps/Schemas/Models/SchemaText',
    'Enterprise/Apps/Schemas/Views/TextOverlayView',
    'Enterprise/Apps/Schemas/Business/State'
], function ($, _, Backbone, DrawTemplate, Tools, Schema, TextOverlayTemplate, TextOverlay, TextOverlayView, State) {
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
            base.$el.find(".ent_sch_dv_clrpicker").change(function () {
                var elt = $(this);
                base.context.strokeStyle = elt.val();
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
            }
            base.current_image.onload = function () {
                base.image_ready = true;
                if (callback !== undefined)
                    callback();
            };
        },
        updateTextOverlays: function () {
            var base = this;
            base.$el.find(".canvas_container").find(".text_overlay").remove();

            var texts = base.schema.get("texts").models;
            for (var k in base.saved_states) {
                if (base.saved_states[k].schema.get("texts") !== undefined)
                    console.log(k, base.saved_states[k].schema.get("texts").models[0]);
            }
            for (var k in texts) {
                var text = texts[k];
                var overlay_view = new TextOverlayView();
                base.$el.find(".canvas_container").append(overlay_view.init(text, base));
            }
        },
        resetImage: function (above) {
            var base = this;
            if (above === undefined || above == false)
                base.context.clearRect(0, 0, base.canvas[0].width, base.canvas[0].height);
            base.context.drawImage(base.current_image, 0, 0);
            base.updateTextOverlays();
        },
        undo: function () {
            var base = this;

            if (base.current_state < base.saved_states.length && base.current_state >= 0) {
                if (base.saved_states[base.current_state - 1] !== undefined) {
                    --base.current_state;
                    base.setImage(base.saved_states[base.current_state].image, function () {
                        base.resetImage();
                    });
                    base.schema = base.saved_states[base.current_state].schema;
                    base.updateTextOverlays();

                }
            }
        },
        redo: function () {
            var base = this;

            if (base.current_state < base.saved_states.length && base.current_state >= 0) {
                if (base.saved_states[base.current_state + 1] !== undefined) {
                    ++base.current_state
                    base.setImage(base.saved_states[base.current_state].image, function () {
                        base.resetImage();
                    });
                    base.schema = base.saved_states[base.current_state].schema;
                    base.updateTextOverlays();
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
            base.schema.get("texts").models[0].time = new Date().getTime();
            var state = new State(base.schema, base.current_image.src);
            base.saved_states.push(state);

//            console.log("-----------------------------------");
//            for (var k in base.saved_states) {
//                console.log("DISPLAYING");
//                var texts = base.saved_states[k].schema.get("texts").models;
//                for (var j in texts)
//                    console.log(texts[j].get("x"));
//            }
            base.schema.save({}, {
                success: function () {
                    console.log("saved schema");
                }
            });
            base.current_state = base.saved_states.length - 1;
        },
        drawing: false,
        mouseDown: function (e, xx, yy) {
            var base = this;
            base.$el.find(".draw_view_container").attr("onselectstart", "return false;");

            clearTimeout(base.share_timer)
            base.drawing = true;
            base.$el.find(".text_overlay").css("pointer-events", "none");
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
                    schema_id: base.schema.get("id"),
                    size: base.current_tool.size,
                    color: base.$el.find(".ent_sch_dv_clrpicker").val(),
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
                if (ms > base.lastms + 25) {
                    lastx = x;
                    lasty = y;
                    base.lastms = ms;

                    base.current_tool.mousemove(e, xx, yy);

                    base.SmartBlocks.sendWs("schemas", {
                        action: "mousemove",
                        user: base.SmartBlocks.current_user.get('session_id'),
                        x: x,
                        y: y,
                        schema_id: base.schema.get("id"),
                        size: base.current_tool.size,
                        color: base.$el.find(".ent_sch_dv_clrpicker").val(),
                        tool_id: base.tool_id
                    }, base.schema.get('sessions'));
                }


            }
        },
        mouseUp: function (e, xx, yy) {
            var base = this;
            base.$el.find(".draw_view_container").attr("onselectstart", "");
            base.$el.find(".text_overlay").css("pointer-events", "auto");
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
                    schema_id: base.schema.get("id"),
                    size: base.current_tool.size,
                    color: base.$el.find(".ent_sch_dv_clrpicker").val(),
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
                base.$el.find(".ent_sch_dv_clrpicker").val(color);
                base.context.strokeStyle = color;
            });

            base.$el.find(".tool").click(function () {
                var elt = $(this);

                if (elt.attr("data-id") !== undefined) {
                    base.tool_id = elt.attr("data-id");
                    base.current_tool = base.tools[base.tool_id];
                    base.$el.find(".ent_sch_dv_toolsize").val(base.current_tool.size);
                }
            });

            base.$el.delegate(".text_tool", "click", function () {
                var text = new TextOverlay({
                    content: "New text",
                    x: base.canvas.width() / 2,
                    y: base.canvas.height() / 2,
                    schema_id: base.schema.get("id")
                });
                base.schema.get("texts").add(text);
                base.schema.save({}, {
                    success: function () {
                        base.updateTextOverlays();
                        base.saveState();
                    }
                });

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
//            base.saveState();


            base.SmartBlocks.events.on("ws_notification", function (message) {
                if (message.app == "schemas" && message.schema_id == base.schema.get('id')) {
                    if (message.user != base.SmartBlocks.current_user.get('session_id')) {
                        if (message.action == "update_text") {
                            base.schema.fetch({
                                success: function () {
                                    base.updateTextOverlays();
                                }
                            });
                        }
                        if (message.image) {
                            var image = new Image();
                            image.src = message.image;
                            image.onload = function () {
                                base.context.drawImage(image, 0, 0);
                            }
                        } else {
                            if (message.action == "mousedown") {
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
//                    if (e.keyCode == 79) {
//                        base.launchSimulation();
//                        base.simulation = true;
//                    }
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
                    base.updateTextOverlays();
                }
            });
        },
        save: function () {
            var base = this;
            base.schema.save();
        }
    });
    return DrawView;
});