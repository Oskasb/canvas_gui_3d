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
		var useDebugGui = true;

		var CanvasGuiMain = function(camera, callbackMap) {
			this.canvasCalls = new CanvasCalls(camera, uiResolution, callbackMap);

			this.canvasGuiState = new CanvasGuiState(this.canvasCalls);

			var reset = function() {
				this.canvasGuiState.rebuildGuiLayers();
			}.bind(this);

			this.canvasCalls.registerResetCallback(reset);
			this.setupEventListener();
		};

		CanvasGuiMain.prototype.addUiCallbacks = function(callbackMap) {
			this.canvasCalls.registerUiCallbacks(callbackMap);
		};

		CanvasGuiMain.prototype.setupEventListener = function() {

			var handleSetControlledEntity = function(e) {
				this.canvasGuiState.applyPlayerPiece(event.eventArgs(e).entity);
				if (useDebugGui) {
					this.canvasGuiState.enableDebugGui();
				}
			}.bind(this);

			this.canvasGuiState.loadMainState('state_flight');

			event.registerListener(event.list().SET_PLAYER_CONTROLLED_ENTITY, handleSetControlledEntity);
		};

		CanvasGuiMain.prototype.tickGuiMain = function(time) {
			this.canvasGuiState.update(time)
		};

		return CanvasGuiMain;

});