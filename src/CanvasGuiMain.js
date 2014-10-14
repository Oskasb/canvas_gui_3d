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

		var CanvasGuiMain = function(camera) {
			this.canvasCalls = new CanvasCalls(camera, uiResolution);
			this.canvasGuiState = new CanvasGuiState(this.canvasCalls);

			var reset = function() {
				this.canvasGuiState.rebuildGuiLayers();
			}.bind(this);

			this.canvasCalls.registerResetCallback(reset);
			this.setupEventListener();
		};

		CanvasGuiMain.prototype.tickGuiMain = function(time) {
			this.canvasGuiState.update(time)
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

		return CanvasGuiMain;

});