var localeConf = [
    { "code": "en", "name": "English" },
    { "code": "zh", "name": "中文" }
];
try {
    var plugins = require('../../plugins/pluginManager.js');
    plugins.extendModule("locale.conf", localeConf);
}
catch (_) {
    //silent try
}
module.exports = localeConf;