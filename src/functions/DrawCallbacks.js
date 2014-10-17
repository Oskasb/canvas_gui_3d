"use strict";

define([
	'gui/functions/UiCallbacks',
	'gui/functions/DrawFunctionShapes',
	'data_pipeline/data/ConfigCache'

],
	function(
		UiCallbacks,
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
						return 'ms:'+UiCallbacks.getCallById('frame_tpf')();
					};
					break;
				case "more_stats":
					return function() {
						return UiCallbacks.getCallById('more_stats')();
					};
					break;
				case "tpf_graph":
					return function(ctx, element) {
						DrawFunctionShapes.drawGraph(UiCallbacks.getCallById('fetchTpfStack')(), ctx, element, element.callbackData.top_value)
					};
					break;
				case "aerodynamic_curves":
					return function(ctx, element) {

						DrawFunctionShapes.drawGraphArray(UiCallbacks.getCallById('fetchAerodynamicCurves')(), ctx, element, element.callbackData.top_value, UiCallbacks.getCallById('fetchPlayerPiece')())
					};
					break;
				case "radar_overview":
					return function(ctx, element) {

						DrawFunctionShapes.drawRadarContent(UiCallbacks.getCallById('fetchActiveGamePieces')(), ctx, element, UiCallbacks.getCallById('fetchPlayerPiece')())
					};
					break;
				case "player_control_update":
					return function(ctx, element) {
						DrawFunctionShapes.drawControlState(
							UiCallbacks.getCallById('fetchControlState')(element.callbackData.params.control),
							ctx,
							element,
							element.callbackData.params
						);
					};
					break;
				case "applied_control_update":
					return function(ctx, element) {
						DrawFunctionShapes.drawControlState(
							UiCallbacks.getCallById('applied_control_update')(element.callbackData.params.control),
							ctx,
							element,
							element.callbackData.params
						);
					};
					break;
				case "registerMessageElement":
					return function(element, channel, state) {
						UiCallbacks.getCallById('registerMessageElement')(element, channel, state)
					};

					break;
				case "fetchChannelData":
					return function(channel) {
						return function() {
							return UiCallbacks.getCallById('getChannelMessage')(channel)
						}
					};
					break;
				case "fetchGuiText":
					return function(key) {
						return ConfigCache.getConfigKey('text_keys', key);
					};

					break;
				default: console.error("No gui drawCallback registered for: ", drawCallback);
			}
		};





		return {
			getGuiDrawCallback:getGuiDrawCallback
		}
	});
