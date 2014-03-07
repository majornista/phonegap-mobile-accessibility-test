/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // "load", "deviceready", "offline", and "online".
    bindEvents: function() {
        document.addEventListener("deviceready", this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of "this" is the event. In order to call the "receivedEvent"
    // function, we must explicity call "app.receivedEvent(...);"
    onDeviceReady: function(event) {
        app.receivedEvent("deviceready");
        document.addEventListener("pause", app.onPause, false);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        document.removeEventListener("deviceready", app.onDeviceReady);

        if (typeof device !== "undefined") {
            document.body.className +=  " " + device.platform.toLowerCase().replace(" ", "-");
        }

        app.toggleDivs("deviceready", true);

        app.toggleAccessibilityStatusMonitoring(true);
    },
    onPause: function(event) {
        document.removeEventListener("pause", app.onPause);
        document.addEventListener("resume", app.onResume, false);
        app.toggleAccessibilityStatusMonitoring(false);
    },
    onResume: function(event) {
        setTimeout(function(app) {
            document.removeEventListener("resume", app.onResume);
            document.addEventListener("pause", app.onPause, false);
            app.toggleAccessibilityStatusMonitoring(true);
        }, 0, app);
    },
    toggleAccessibilityStatusMonitoring: function(bool) {
        if (typeof MobileAccessibility === "undefined") return;
        var preferredtextzoomInput = document.getElementById("preferredtextzoom");
        if (bool) {
            MobileAccessibility.isScreenReaderRunning(app.isScreenReaderRunningCallback);
            MobileAccessibility.isClosedCaptioningEnabled(app.isClosedCaptioningEnabledCallback);
            window.addEventListener("screenreaderstatuschanged", app.onScreenReaderStatusChanged, false);
            window.addEventListener("closedcaptioningstatuschanged", app.onClosedCaptioningStatusChanged, false);
            if (device.platform === "iOS") {
                MobileAccessibility.isGuidedAccessEnabled(app.isGuidedAccessEnabledCallback);
                MobileAccessibility.isInvertColorsEnabled(app.isInvertColorsEnabledCallback);
                MobileAccessibility.isMonoAudioEnabled(app.isMonoAudioEnabledCallback);
                window.addEventListener("guidedaccessstatuschanged", app.onGuidedAccessStatusChanged, false);
                window.addEventListener("invertcolorsstatuschanged", app.onInvertColorsStatusChanged, false);
                window.addEventListener("monoaudiostatuschanged", app.onMonoAudioStatusChanged, false);
            } else if (device.platform === "Android") {
                MobileAccessibility.isTouchExplorationEnabled(app.isTouchExplorationEnabledCallback);
                window.addEventListener("touchexplorationstatechanged", app.onTouchExplorationStateChanged, false);
            }
            if (preferredtextzoomInput) {
            	preferredtextzoomInput.checked = MobileAccessibility.usePreferredTextZoom();
            	preferredtextzoomInput.addEventListener("change", app.usePreferredTextZoom, false);
            	app.usePreferredTextZoom();
            }
        } else {
            window.removeEventListener("screenreaderstatuschanged", app.onScreenReaderStatusChanged);
            window.removeEventListener("closedcaptioningstatuschanged", app.onClosedCaptioningStatusChanged);
            if (device.platform === "iOS") {
                window.removeEventListener("guidedaccessstatuschanged", app.onGuidedAccessStatusChanged);
                window.removeEventListener("invertcolorsstatuschanged", app.onInvertColorsStatusChanged);
                window.removeEventListener("monoaudiostatuschanged", app.onMonoAudioStatusChanged);
            } else if (device.platform === "Android") {
                window.removeEventListener("touchexplorationstatechanged", app.onTouchExplorationStateChanged);
            }
            if (preferredtextzoomInput) {
            	preferredtextzoomInput.removeEventListener("change", app.usePreferredTextZoom);
            }
        }
    },
    onScreenReaderStatusChanged: function(info) {
        if (info && typeof info.isScreenReaderRunning !== "undefined") {
            app.isScreenReaderRunningCallback(info.isScreenReaderRunning);
        }
    },
    onClosedCaptioningStatusChanged: function(info) {
        if (info && typeof info.isClosedCaptioningEnabled !== "undefined") {
            app.isClosedCaptioningEnabledCallback(info.isClosedCaptioningEnabled);
        }
    },
    onGuidedAccessStatusChanged: function(info) {
        if (info && typeof info.isGuidedAccessEnabled !== "undefined") {
            app.isGuidedAccessEnabledCallback(info.isGuidedAccessEnabled);
        }
    },
    onInvertColorsStatusChanged: function(info) {
        if (info && typeof info.isInvertColorsEnabled !== "undefined") {
            app.isInvertColorsEnabledCallback(info.isInvertColorsEnabled);
        }
    },
    onMonoAudioStatusChanged: function(info) {
        if (info && typeof info.isMonoAudioEnabled !== "undefined") {
            app.isMonoAudioEnabledCallback(info.isMonoAudioEnabled);
        }
    },
    onTouchExplorationStateChanged: function(info) {
        if (info && typeof info.isTouchExplorationEnabled !== "undefined") {
            app.isTouchExplorationEnabledCallback(info.isTouchExplorationEnabled);
        }
    },
    isScreenReaderRunning: false,
    isScreenReaderRunningCallback: function (bool) {
        app.toggleDivs("screenreader", bool);
        app.toggleNotificationButtons(bool);
        app.isScreenReaderRunning = bool;
        if (device.platform === "Android" && bool) {
            var chromevoxstatus = document.getElementById("chromevoxstatus");
            setTimeout(function() {
                if (typeof cvox !== "undefined" && cvox.ChromeVox.host.ttsLoaded()) {
                    cvox.AbstractTts.PRONUNCIATION_DICTIONARY["PhoneGap"] = "Phone Gap";
                    chromevoxstatus.setAttribute("hidden","hidden");
                } else {
                    chromevoxstatus.removeAttribute("hidden");
                    MobileAccessibility.speak(chromevoxstatus.textContent);
                }
            }, 5000);
        }
    },
    isClosedCaptioningEnabled: false,
    isClosedCaptioningEnabledCallback: function (bool) {
        if (bool === app.isClosedCaptioningEnabled) return;
        app.toggleDivs("closedcaptioning", bool);
        app.isClosedCaptioningEnabled = bool;
    },
    isInvertColorsEnabled: false,
    isInvertColorsEnabledCallback: function (bool) {
        if (bool === app.isInvertColorsEnabled) return;
        app.toggleDivs("invertcolors", bool);
        app.isInvertColorsEnabled = bool;
    },
    isMonoAudioEnabled: false,
    isMonoAudioEnabledCallback: function (bool) {
        if (bool === app.isMonoAudioEnabled) return;
        app.toggleDivs("monoaudio", bool);
        app.isMonoAudioEnabled = bool;
    },
    isGuidedAccessEnabled: false,
    isGuidedAccessEnabledCallback: function (bool) {
        if (bool === app.isGuidedAccessEnabled) return;
        app.toggleDivs("guidedaccess", bool);
        app.isGuidedAccessEnabled = bool;
    },
    isTouchExplorationEnabled: false,
    isTouchExplorationEnabledCallback: function (bool) {
        if (bool === app.isTouchExplorationEnabled) return;
        app.toggleDivs("touchexploration", bool);
        app.isTouchExplorationEnabled = bool;
    },
    toggleDivs: function (className, bool) {
        var onElement = document.body.querySelector("." + className + ".on"),
        offElement = document.body.querySelector("." + className + ".off");
        if (bool) {
            onElement.setAttribute("style", "display:block;");
            offElement.setAttribute("style", "display:none;");
        } else {
            offElement.setAttribute("style", "display:block;");
            onElement.setAttribute("style", "display:none;");
        }
    },
    toggleNotificationButtons: function (bool) {
        var btns = document.body.querySelectorAll(".postnotificationbutton"),
            i,
            btn;
        for (i = 0; i < btns.length; i++) {
            btn = btns[i];
            btn.disabled = !bool;
            if (bool) {
                btn.removeAttribute("disabled");
                btn.addEventListener("click", app.handleNotificationButtonClick);
            } else {
                btn.removeEventListener("click", app.handleNotificationButtonClick);
            }
        }
    },
    usePreferredTextZoom: function (event) {
    	var preferredtextzoomInput = document.getElementById("preferredtextzoom");
        if (preferredtextzoomInput) {
        	// console.log("app.usePreferredTextZoom " + preferredtextzoomInput.checked);
        	MobileAccessibility.usePreferredTextZoom(preferredtextzoomInput.checked);
        }
    },
    timeoutId: null,
    handleNotificationButtonClick: function (event) {
        if (event.target.value) {
            var notificationType = null,
                value = event.target.value;
            if (app.timeoutId) {
                clearTimeout(app.timeoutId);
                app.timeoutId = null;
            }
            switch (event.target.id)
            {
                case "postlayoutchangednotification":
                    notificationType = MobileAccessibility.MobileAccessibilityNotifications.LAYOUT_CHANGED;
                    break;
                case "postpagescrollednotification":
                    notificationType = MobileAccessibility.MobileAccessibilityNotifications.PAGE_SCROLLED;
                    break;
                case "postscreenchangednotification":
                    notificationType = MobileAccessibility.MobileAccessibilityNotifications.SCREEN_CHANGED;
                    break;
                case "postannouncementnotification":
                case "speak":
                    notificationType = MobileAccessibility.MobileAccessibilityNotifications.ANNOUNCEMENT;
                    app.timeoutId = setTimeout(function() {
                            MobileAccessibility.speak(value);
                        }, 150);
                    return;
                case "stop":
                    app.timeoutId = setTimeout(function() {
                            MobileAccessibility.speak(value);
                            app.timeoutId = setTimeout(function() {
                                MobileAccessibility.stop();
                            }, 9000);
                        }, 150);
                    return;
            }
            if (notificationType) {
                MobileAccessibility.postNotification(notificationType, event.target.value,
                    function(info) {
                        if (info) {
                            console.log("Screen Reader announced \"" + info.stringValue + "\" success : " + info.wasSuccessful);
                        }
                    });
            }
        }
    }
};
