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
		};

		CanvasGuiAPI.prototype.initCanvasGui = function(masterUrl, camera, callbackMap, onReady, onError) {
			var masterLoaded = function() {
				this.canvasGuiMain.initGuiMain(camera, callbackMap, this.uiTxResolution);
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

		return CanvasGuiAPI;

	});