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

		CanvasGuiAPI.prototype.initCanvasGui = function(masterUrl, camera, callbackMap, onReady, onError) {
			var masterLoaded = function() {
				this.canvasGuiMain.initGuiMain(camera, callbackMap, this.uiTxResolution, this.pointerCursor);
				onReady();
			}.bind(this);
			this.canvasGuiMain.loadMasterConfig(masterUrl, masterLoaded, onError);
		};

		CanvasGuiAPI.prototype.setUiToStateId = function(state) {
			this.canvasGuiMain.setMainUiState(state);
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


		return CanvasGuiAPI;

	});