(function () {
	"use strict";
	
	var addEvent, translateAttr, isDOMAttrModifiedSupported, ObserveAttrChange;
	
	addEvent = (function () {
		var tester, func, forceAttach, addListener, attachListener, unsupported;
		
		tester = document.createElement("div");
		forceAttach = {
			"propertychange": 1
		};
		addListener = function (element, eventName, callback) {
			element.addEventListener(eventName, callback, false);
		};
		attachListener = function (element, eventName, callback) {
			element.attachEvent("on" + eventName, callback);
		};
		unsupported = function () {
			return false;
		};
		
		if (tester.addEventListener) {
			func = addListener;
		} else if (tester.attachEvent) {
			func = attachListener;
		} else {
			func = unsupported;
		}
		
		return function (element, eventName, callback) {
			var success = true;
			if (eventName in forceAttach) {
				attachListener(element, eventName, callback);
			} else {
				if (func(element, eventName, callback) === false) {
					success = false;
				}
			}
			return success;
		};
	}());
	
	translateAttr = (function () {
		var hooks = {
			"className": "class"
		};
		return function (attr) {
			if (attr in hooks) {
				attr = hooks[attr];
			}
			return attr;
		};
	}());
	
	isDOMAttrModifiedSupported = (function () {
		var tester, flag, callback;
		
		tester = document.createElement("div");
		flag = false;
		callback = function () {
			flag = true;
		};
		
		if (!addEvent(tester, "DOMAttrModified", callback)) {
			return false;
		}
		tester.setAttribute("id", "target");
		
		return flag;
	}());
	
	ObserveAttrChange = (function () {
		var func, tester, observerName;
		tester = document.createElement("div");
		if ("MutationObserver" in window || "WebKitMutationObserver" in window) {
			observerName = "MutationObserver" in window ? "MutationObserver" : "WebKitMutationObserver";
			func = function (target, attr, callback) {
				var config, observer;
				config = {
					attributes: true,
					childList: true,
					characterData: true
				};
				observer = new window[observerName](function (mutations) {
					mutations.forEach(function (mutation) {
						if (translateAttr(mutation.attributeName) === translateAttr(attr)) {
							callback.call(target);
						}
					});
				});
				observer.observe(target, config);
			};
		} else if (isDOMAttrModifiedSupported) {
			observerName = "DOMAttrModified";
			func = function (target, attr, callback) {
				addEvent(target, "DOMAttrModified", function (e) {
					var evtTarget;
					e = e || window.event;
					evtTarget = e.target || e.srcElement;
					// Fix bubbling issue
					if (evtTarget == target) {
						if (translateAttr(e.attrName) === translateAttr(attr)) {
							callback.call(target);
						}
					}
				});
			};
		} else if ("onpropertychange" in tester) {
			observerName = "onpropertychange";
			func = function (target, attr, callback) {
				addEvent(target, "propertychange", function (e) {
					e = e || window.event;
					if (translateAttr(e.propertyName) === translateAttr(attr)) {
						callback.call(target);
					}
				});
			};
		} else {
			throw new Error("No hope for observing attribute changes");
		}
		console.log("##Observer Detection##:", observerName);
		return func;
	}());
	
	window.ObserveAttrChange = ObserveAttrChange;
}());
