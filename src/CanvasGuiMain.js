"use strict";

define([
	'gui/GuiConfigLoader',
	'gui/CanvasGuiState',
	'gui/CanvasCalls'
],
	function(
		GuiConfigLoader,
		CanvasGuiState,
		CanvasCalls
		) {


		var uiResolution = 1024;


		var CanvasGuiMain = function() {
			this.guiConfigLoader = new GuiConfigLoader();
		};

		CanvasGuiMain.prototype.loadMasterConfig = function(masterUrl, ok, fail) {
			this.guiConfigLoader.initConfigs(masterUrl, ok, fail);
		};

		CanvasGuiMain.prototype.initCanvasGui = function(camera, callbackMap) {
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