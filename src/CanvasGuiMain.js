"use strict";

define([
	'gui/GuiConfigLoader',
	'gui/CanvasGuiState',
	'gui/CanvasCalls',
	'gui/GuiBusSends',
	'gui/io/InputState',
	'gui/io/PointerCursor',
	'gui/io/GameScreen'
],
	function(
		GuiConfigLoader,
		CanvasGuiState,
		CanvasCalls,
		GuiBusSends,
		InputState,
		PointerCursor,
		GameScreen
		) {


		var CanvasGuiMain = function() {
			GameScreen.registerAppContainer(document.body);
			this.inputState = new InputState();
			this.pointerCursor = new PointerCursor(this.inputState);
			this.guiConfigLoader = new GuiConfigLoader();
		};

		CanvasGuiMain.prototype.loadMasterConfig = function(masterUrl, ok, fail) {
			this.guiConfigLoader.initConfigs(masterUrl, ok, fail);
		};

		CanvasGuiMain.prototype.initGuiMain = function(cameraEntity, callbackMap, uiResolution) {
			this.canvasCalls = new CanvasCalls(cameraEntity, uiResolution, callbackMap);
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

		CanvasGuiMain.prototype.adjustCanvasBlendMode = function(modeValue, callback) {
			this.canvasCalls.canvasGui3d.applyBlendModeSelection(modeValue, callback);
		};

		CanvasGuiMain.prototype.tickGuiMain = function(tpf) {
			this.inputState.initFrameSample();
			this.canvasGuiState.updateGuySystems(tpf, this.inputState);
			this.inputState.updateInputState(tpf, this.pointerCursor);
			this.canvasGuiState.drawLayers(tpf)

		};

		CanvasGuiMain.prototype.addGuiStateTransitionCallback = function(transitionId, callback) {
			this.pointerCursor.addGuiStateTransitionCallback(transitionId, callback)
		};



		CanvasGuiMain.prototype.setGuiTextureScale = function(txScale) {
			this.canvasCalls.applyTextureScale(txScale);
		};

		return CanvasGuiMain;

});