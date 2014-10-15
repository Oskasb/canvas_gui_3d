"use strict";

define([
	'gui/GuiConfigLoader',
	'gui/CanvasGuiState',
	'gui/CanvasCalls',
	'gui/GuiBusSends',
	'gui/PointerCursor',
	'gui/GameScreen'
],
	function(
		GuiConfigLoader,
		CanvasGuiState,
		CanvasCalls,
		GuiBusSends,
		PointerCursor,
		GameScreen
		) {


		var CanvasGuiMain = function() {
			this.pointerCursor = new PointerCursor();
			this.guiConfigLoader = new GuiConfigLoader();
		};

		CanvasGuiMain.prototype.loadMasterConfig = function(masterUrl, ok, fail) {
			this.guiConfigLoader.initConfigs(masterUrl, ok, fail);
		};

		CanvasGuiMain.prototype.initGuiMain = function(camera, callbackMap, uiResolution) {
			console.log("Ini main: ", camera)
			GameScreen.registerAppContainer(document.body);
			this.canvasCalls = new CanvasCalls(camera, uiResolution, callbackMap);
			this.canvasGuiState = new CanvasGuiState(this.canvasCalls, this.pointerCursor);
			var reset = function() {
				this.canvasGuiState.rebuildGuiLayers();
			}.bind(this);
			this.canvasCalls.registerResetCallback(reset);

		};




		CanvasGuiMain.prototype.setMainUiState = function(state) {
			this.canvasGuiState.loadMainState(state);
		};

		CanvasGuiMain.prototype.addUiSubstateId = function(state) {
			this.canvasGuiState.attachMainStateId(state);
		};

		CanvasGuiMain.prototype.addUiSubstateConfig = function(config) {
			this.canvasGuiState.attachMainConfig(config);

		};

		CanvasGuiMain.prototype.tickGuiMain = function(time) {
			this.canvasGuiState.update(time)
		};

		return CanvasGuiMain;

});