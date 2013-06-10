define([
], function () {
    var external_module = {
        webshell: {
            exec: function (obj) {
                if (obj.code && obj.process) {
                    wsh.exec({
                        code: obj.code,
                        process: obj.process
                    });
                }
            }
        }
    };

    return external_module;
});