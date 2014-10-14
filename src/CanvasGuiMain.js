"use strict";

define([
	'application/EventManager',
	'gui/CanvasGuiState',
	'gui/CanvasCalls'
],
	function(
		event,
		CanvasGuiState,
		CanvasCalls
		) {


		var uiResolution = 1024;


		var CanvasGuiMain = function(camera, callbackMap) {
			this.canvasCalls = new CanvasCalls(camera, uiResolution, callbackMap);

			this.canvasGuiState = new CanvasGuiState(this.canvasCalls);

			var reset = function() {
				this.canvasGuiState.rebuildGuiLayers();
			}.bind(this);

			this.canvasCalls.registerResetCallback(reset);
		};

		CanvasGuiMain.prototype.setMainUiState = function(state) {
			this.canvasGuiState.loadMainState(state);
		};

		CanvasGuiMain.prototype.addUiSubstateConfig = function(config) {
			this.canvasGuiState.attachMainConfig(config);

		};

		CanvasGuiMain.prototype.tickGuiMain = function(time) {
			this.canvasGuiState.update(time)
		};

		return CanvasGuiMain;

});