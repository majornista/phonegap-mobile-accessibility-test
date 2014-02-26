cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.phonegap.plugin.mobile-accessibility/www/mobile-accessibility.js",
        "id": "com.phonegap.plugin.mobile-accessibility.mobile-accessibility",
        "clobbers": [
            "window.MobileAccessibility"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/network.js",
        "id": "org.apache.cordova.network-information.network",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/Connection.js",
        "id": "org.apache.cordova.network-information.Connection",
        "clobbers": [
            "Connection"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.phonegap.plugin.mobile-accessibility": "0.1.0",
    "org.apache.cordova.device": "0.2.8",
    "org.apache.cordova.network-information": "0.2.7"
}
// BOTTOM OF METADATA
});