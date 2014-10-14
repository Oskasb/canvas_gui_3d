"use strict";

define([
	'io/canvas/functions/GameUiCallbacks',
	'io/canvas/functions/DrawFunctionShapes',
	'io/data/ConfigCache'

],
	function(
		GameUiCallbacks,
		DrawFunctionShapes,
		ConfigCache
		) {

		var getGuiDrawCallback = function(drawCallback) {
			switch (drawCallback) {
				case "random_test":
					return function() {
						return Math.random();
					};
					break;
				case "frame_tpf":
					return function() {
						return 'ms:'+GameUiCallbacks.fetchFrameTpf();
					};
					break;
				case "more_stats":
					return function() {
						return GameUiCallbacks.fetchFrameStats();
					};
					break;
				case "channel":
					return function(callback, pos, size) {
					//	return callback(GameUiCallbacks.fetchChannelData(), pos, size);
					};
					break;
				case "tpf_graph":
					return function(ctx, element) {
						DrawFunctionShapes.drawGraph(GameUiCallbacks.fetchTpfStack(), ctx, element, element.callbackData.top_value)
					};
					break;
				case "aerodynamic_curves":
					return function(ctx, element) {
						DrawFunctionShapes.drawGraphArray(GameUiCallbacks.fetchAerodynamicCurves(), ctx, element, element.callbackData.top_value)
					};
					break;
				case "player_control_update":
					return function(ctx, element) {
						DrawFunctionShapes.drawControlState(
							GameUiCallbacks.fetchControlState(element.callbackData.params.control),
							ctx,
							element,
							element.callbackData.params
						);
					};
					break;
				case "applied_control_update":
					return function(ctx, element) {
						DrawFunctionShapes.drawControlState(
							GameUiCallbacks.fetchAppliedState(element.callbackData.params.control),
							ctx,
							element,
							element.callbackData.params
						);
					};
					break;
				default: console.error("No gui drawCallback registered for: ", drawCallback);
			}
		};

		var registerMessageElement = function(element, channel, state) {
			GameUiCallbacks.registerMessageTarget(element, channel, state)

		};


		var fetchChannelData = function(channel) {
			return function() {
				return GameUiCallbacks.getChannelMessage(channel)
			}
		};

		var fetchGuiText = function(key) {
			return ConfigCache.getConfigKey('text_keys', key);
		};

		return {

			getGuiDrawCallback:getGuiDrawCallback,
			registerMessageElement:registerMessageElement,
			fetchChannelData:fetchChannelData,
			fetchGuiText:fetchGuiText
		}
	});
