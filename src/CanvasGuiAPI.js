"use strict";

define([
	'gui/CanvasGuiMain'
],
	function(
		CanvasGuiMain
		) {

		var defaultResolution = 1024;

		var CanvasGuiAPI = function(uiTxResolution) {
			this.canvasGuiMain = new CanvasGuiMain();
			this.uiTxResolution = uiTxResolution || defaultResolution;
			this.pointerCursor = this.canvasGuiMain.pointerCursor;
		};

		CanvasGuiAPI.prototype.initCanvasGui = function(masterUrl, cameraEntity, callbackMap, onReady, onError) {
			var masterLoaded = function(srcKey, data) {
				this.canvasGuiMain.initGuiMain(cameraEntity, callbackMap, this.uiTxResolution, this.pointerCursor);
				onReady(srcKey, data);
			}.bind(this);
			this.canvasGuiMain.loadMasterConfig(masterUrl, masterLoaded, onError);
		};

		CanvasGuiAPI.prototype.setUiToStateId = function(state) {
			this.canvasGuiMain.setMainUiState(state);
		};

		CanvasGuiAPI.prototype.adjustCanvasBlendMode = function(modeValue, callback) {
			this.canvasGuiMain.adjustCanvasBlendMode(modeValue, callback);
		};

		CanvasGuiAPI.prototype.attachUiSubstateId = function(state) {
			this.canvasGuiMain.addUiSubstateId(state);
		};

		CanvasGuiAPI.prototype.updateCanvasGui = function(tpf) {
			this.canvasGuiMain.tickGuiMain(tpf)
		};

		CanvasGuiAPI.prototype.getPointerCursor = function() {
			return this.pointerCursor;
		};

		CanvasGuiAPI.prototype.addGuiStateTransitionCallback = function(transitionId, callback) {
			this.canvasGuiMain.addGuiStateTransitionCallback(transitionId, callback)
		};

		CanvasGuiAPI.prototype.setGuiTextureScale = function(txScale) {
			this.canvasGuiMain.setGuiTextureScale(txScale)
		};

		CanvasGuiAPI.prototype.getPointerState = function() {
			return this.getPointerCursor().getPointerState();
		};

		return CanvasGuiAPI;

	});