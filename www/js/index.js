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

/*jslint browser: true, devel: true*/
/*global cvox, device, MobileAccessibility, MobileAccessibilityNotifications*/

var app = {
    // Application Constructor
    initialize: function () {
        "use strict";
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // "load", "deviceready", "offline", and "online".
    bindEvents: function () {
        "use strict";
        document.addEventListener("deviceready", this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of "this" is the event. In order to call the "receivedEvent"
    // function, we must explicity call "app.receivedEvent(...);"
    onDeviceReady: function (event) {
        "use strict";
        app.receivedEvent("deviceready");
        document.addEventListener("pause", app.onPause, false);
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        "use strict";
        document.removeEventListener("deviceready", app.onDeviceReady);

        if (typeof device !== "undefined") {
            var classList = document.body.classList;
            classList.add(device.platform.toLowerCase().replace(" ", "-"));
        }

        app.toggleDivs("deviceready", true);

        app.toggleAccessibilityStatusMonitoring(true);
    },
    onPause: function (event) {
        "use strict";
        console.log("onPause");
        document.removeEventListener("pause", app.onPause);
        document.addEventListener("resume", app.onResume, false);
        app.toggleAccessibilityStatusMonitoring(false);
    },
    onResume: function (event) {
        "use strict";
        setTimeout(function (app) {
            console.log("onResume");
            document.removeEventListener("resume", app.onResume);
            document.addEventListener("pause", app.onPause, false);
            app.toggleAccessibilityStatusMonitoring(true);
        }, 0, app);
    },
    toggleAccessibilityStatusMonitoring: function (bool) {
        "use strict";
        if (typeof MobileAccessibility === "undefined") {
            return;
        }
        var preferredtextzoomInput = document.getElementById("preferredtextzoom"),
            platform = device.platform.toLowerCase();
        if (bool) {
            MobileAccessibility.isScreenReaderRunning(app.isScreenReaderRunningCallback);
            MobileAccessibility.isClosedCaptioningEnabled(app.isClosedCaptioningEnabledCallback);
            window.addEventListener(MobileAccessibilityNotifications.SCREEN_READER_STATUS_CHANGED, app.onScreenReaderStatusChanged, false);
            window.addEventListener(MobileAccessibilityNotifications.CLOSED_CAPTIONING_STATUS_CHANGED, app.onClosedCaptioningStatusChanged, false);
            if (platform === "ios") {
                MobileAccessibility.isGuidedAccessEnabled(app.isGuidedAccessEnabledCallback);
                MobileAccessibility.isInvertColorsEnabled(app.isInvertColorsEnabledCallback);
                MobileAccessibility.isMonoAudioEnabled(app.isMonoAudioEnabledCallback);
                window.addEventListener(MobileAccessibilityNotifications.GUIDED_ACCESS_STATUS_CHANGED, app.onGuidedAccessStatusChanged, false);
                window.addEventListener(MobileAccessibilityNotifications.INVERT_COLORS_STATUS_CHANGED, app.onInvertColorsStatusChanged, false);
                window.addEventListener(MobileAccessibilityNotifications.MONO_AUDIO_STATUS_CHANGED, app.onMonoAudioStatusChanged, false);
            } else if (platform === "windows") {
                MobileAccessibility.isHighContrastEnabled(app.isHighContrastEnabledCallback);
                window.addEventListener(MobileAccessibilityNotifications.HIGH_CONTRAST_CHANGED, app.onHighContrastChanged, false);
            } else {
                MobileAccessibility.isTouchExplorationEnabled(app.isTouchExplorationEnabledCallback);
                window.addEventListener(MobileAccessibilityNotifications.TOUCH_EXPLORATION_STATUS_CHANGED, app.onTouchExplorationStateChanged, false);
            }
            if (preferredtextzoomInput) {
                preferredtextzoomInput.checked = MobileAccessibility.usePreferredTextZoom();
                preferredtextzoomInput.addEventListener("change", app.usePreferredTextZoom, false);
                app.usePreferredTextZoom();
            }
        } else {
            window.removeEventListener(MobileAccessibilityNotifications.SCREEN_READER_STATUS_CHANGED, app.onScreenReaderStatusChanged);
            window.removeEventListener(MobileAccessibilityNotifications.CLOSED_CAPTIONING_STATUS_CHANGED, app.onClosedCaptioningStatusChanged);
            if (device.platform === "ios") {
                window.removeEventListener(MobileAccessibilityNotifications.GUIDED_ACCESS_STATUS_CHANGED, app.onGuidedAccessStatusChanged);
                window.removeEventListener(MobileAccessibilityNotifications.INVERT_COLORS_STATUS_CHANGED, app.onInvertColorsStatusChanged);
                window.removeEventListener(MobileAccessibilityNotifications.MONO_AUDIO_STATUS_CHANGED, app.onMonoAudioStatusChanged);
            } else if (platform === "windows") {
                window.removeEventListener(MobileAccessibilityNotifications.HIGH_CONTRAST_CHANGED, app.onHighContrastChanged);
            } else {
                window.removeEventListener(MobileAccessibilityNotifications.TOUCH_EXPLORATION_STATUS_CHANGED, app.onTouchExplorationStateChanged);
            }
            if (preferredtextzoomInput) {
                preferredtextzoomInput.removeEventListener("change", app.usePreferredTextZoom);
            }
        }
    },
    onScreenReaderStatusChanged: function (info) {
        "use strict";
        if (info && typeof info.isScreenReaderRunning !== "undefined") {
            app.isScreenReaderRunningCallback(info.isScreenReaderRunning);
        }
    },
    onClosedCaptioningStatusChanged: function (info) {
        "use strict";
        if (info && typeof info.isClosedCaptioningEnabled !== "undefined") {
            app.isClosedCaptioningEnabledCallback(info.isClosedCaptioningEnabled);
        }
    },
    onGuidedAccessStatusChanged: function (info) {
        "use strict";
        if (info && typeof info.isGuidedAccessEnabled !== "undefined") {
            app.isGuidedAccessEnabledCallback(info.isGuidedAccessEnabled);
        }
    },
    onInvertColorsStatusChanged: function (info) {
        "use strict";
        if (info && typeof info.isInvertColorsEnabled !== "undefined") {
            app.isInvertColorsEnabledCallback(info.isInvertColorsEnabled);
        }
    },
    onMonoAudioStatusChanged: function (info) {
        "use strict";
        if (info && typeof info.isMonoAudioEnabled !== "undefined") {
            app.isMonoAudioEnabledCallback(info.isMonoAudioEnabled);
        }
    },
    onTouchExplorationStateChanged: function (info) {
        "use strict";
        if (info && typeof info.isTouchExplorationEnabled !== "undefined") {
            app.isTouchExplorationEnabledCallback(info.isTouchExplorationEnabled);
        }
    },
    onHighContrastChanged: function (info) {
        "use strict";
        if (info && typeof info.isHighContrastEnabled !== "undefined") {
            app.isHighContrastEnabledCallback(info.isHighContrastEnabled);
        }
    },
    isScreenReaderRunning: false,
    isScreenReaderRunningCallback: function (bool) {
        "use strict";
        var platform = device.platform.toLowerCase(), chromevoxstatus;
        app.toggleDivs("screenreader", bool);
        app.toggleNotificationButtons(bool || platform === "windows");
        app.isScreenReaderRunning = bool;
        if ((platform === "android" || platform === "amazon-fireos") && bool) {
            chromevoxstatus = document.getElementById("chromevoxstatus");
            setTimeout(function () {
                if (MobileAccessibility.isChromeVoxActive()) {
                    cvox.AbstractTts.PRONUNCIATION_DICTIONARY.PhoneGap = "Phone Gap";
                    chromevoxstatus.setAttribute("hidden", "hidden");
                } else {
                    chromevoxstatus.removeAttribute("hidden");
                    MobileAccessibility.speak(chromevoxstatus.textContent);
                }
            }, 5000);
        }
    },
    isClosedCaptioningEnabled: false,
    isClosedCaptioningEnabledCallback: function (bool) {
        "use strict";
        if (bool === app.isClosedCaptioningEnabled) {
            return;
        }
        app.toggleDivs("closedcaptioning", bool);
        app.isClosedCaptioningEnabled = bool;
    },
    isInvertColorsEnabled: false,
    isInvertColorsEnabledCallback: function (bool) {
        "use strict";
        if (bool === app.isInvertColorsEnabled) {
            return;
        }
        app.toggleDivs("invertcolors", bool);
        app.isInvertColorsEnabled = bool;

        var classList = document.body.classList;
        if (bool) {
            classList.add('invert');
        } else {
            classList.remove('invert');
        }
    },
    isMonoAudioEnabled: false,
    isMonoAudioEnabledCallback: function (bool) {
        "use strict";
        if (bool === app.isMonoAudioEnabled) {
            return;
        }
        app.toggleDivs("monoaudio", bool);
        app.isMonoAudioEnabled = bool;
    },
    isGuidedAccessEnabled: false,
    isGuidedAccessEnabledCallback: function (bool) {
        "use strict";
        if (bool === app.isGuidedAccessEnabled) {
            return;
        }
        app.toggleDivs("guidedaccess", bool);
        app.isGuidedAccessEnabled = bool;
    },
    isTouchExplorationEnabled: false,
    isTouchExplorationEnabledCallback: function (bool) {
        "use strict";
        if (bool === app.isTouchExplorationEnabled) {
            return;
        }
        app.toggleDivs("touchexploration", bool);
        app.isTouchExplorationEnabled = bool;
    },
    isHighContrastEnabled: false,
    isHighContrastEnabledCallback: function (bool) {
        "use strict";
        if (bool === app.isHighContrastEnabled) {
            return;
        }
        app.toggleDivs("highcontrast", bool);
        app.isHighContrastEnabled = bool;
    },
    toggleDivs: function (className, bool) {
        "use strict";
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
        "use strict";
        var btns = document.body.querySelectorAll(".postnotificationbutton"),
            i,
            btn;
        for (i = 0; i < btns.length; i += 1) {
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
        "use strict";
        var preferredtextzoomInput = document.getElementById("preferredtextzoom");
        if (preferredtextzoomInput) {
            // console.log("app.usePreferredTextZoom " + preferredtextzoomInput.checked);
            MobileAccessibility.usePreferredTextZoom(preferredtextzoomInput.checked);
        }
    },
    timeoutId: null,
    handleNotificationButtonClick: function (event) {
        "use strict";
        if (event.target.value) {
            var notificationType = null,
                value = event.target.value;
            if (app.timeoutId) {
                clearTimeout(app.timeoutId);
                app.timeoutId = null;
            }
            switch (event.target.id) {
            case "postlayoutchangednotification":
                notificationType = MobileAccessibilityNotifications.LAYOUT_CHANGED;
                break;
            case "postpagescrollednotification":
                notificationType = MobileAccessibilityNotifications.PAGE_SCROLLED;
                break;
            case "postscreenchangednotification":
                notificationType = MobileAccessibilityNotifications.SCREEN_CHANGED;
                break;
            case "postannouncementnotification":
            case "speak":
                notificationType = MobileAccessibilityNotifications.ANNOUNCEMENT;
                app.timeoutId = setTimeout(function () {
                    MobileAccessibility.speak(value);
                }, 150);
                return;
            case "stop":
                app.timeoutId = setTimeout(function () {
                    MobileAccessibility.speak(value);
                    app.timeoutId = setTimeout(function () {
                        MobileAccessibility.stop();
                    }, 9000);
                }, 150);
                return;
            }
            if (notificationType) {
                MobileAccessibility.postNotification(notificationType, event.target.value,
                    function (info) {
                        if (info) {
                            console.log("Screen Reader announced \"" + info.stringValue + "\" success : " + info.wasSuccessful);
                        }
                    });
            }
        }
    }
};
