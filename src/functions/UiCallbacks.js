"use strict";

define([],
	function() {

		var UiCallbacks = function() {};


		var drawCallbacks = {

		};



		UiCallbacks.registerDrawCallback = function(id, callback) {
			drawCallbacks[id] = callback;
		};

		UiCallbacks.addDrawCallbacks = function(callbackMap) {
			for (var key in callbackMap) {
				UiCallbacks.registerDrawCallback(key, callbackMap[key]);
			}
		};

		UiCallbacks.getCallById = function(id) {
			if (!drawCallbacks[id]) {
				console.error("No Ui callback with id: ", id)
				return function() {};
			}
			return drawCallbacks[id]
		};


		return UiCallbacks
	});
