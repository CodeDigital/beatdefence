const filesystem = require('fs');

module.exports.setSettings = function(newSettings) {
    var settingsBuffer = JSON.stringify(newSettings);

    if (fs.existsSync(__dirname + "\\settings.json")) {
        fs.writeFileSync(__dirname + "\\settings.json", settingsBuffer);
    } else {
        fs.readFile(__dirname + "\\defaultSettings.json", function (err, data) {
            if (err) {

            } else {
                var createStream = fs.createWriteStream(__dirname + "\\settings.json");
                createStream.end();

                fs.writeFileSync(__dirname + "\\settings.json", settingsBuffer);
            }
        });
    }
}

module.exports.getSettings = function(callback) {
    let settings;
    var settingsBuffer;

    filesystem.readFile(__dirname + "\\settings.json", function(err, data) {
        if(data != ""){
            settingsBuffer = data;
            settings = JSON.parse(settingsBuffer);
            callback(settings);
        }else{
            fs.readFile(__dirname + "\\defaultSettings.json", function (err, data) {
                if (err){

                }else{
                    var createStream = fs.createWriteStream(__dirname + "\\settings.json");
                    createStream.end();

                    settingsBuffer = data;
                    var newSettings = JSON.parse(settingsBuffer);
                    setSettings(newSettings);

                    callback(newSettings);
                }
            });
        }
    });

    return settings;
}