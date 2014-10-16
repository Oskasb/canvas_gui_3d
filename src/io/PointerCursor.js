"use strict";

define([
	'gui/io/VisualCursor'
],
	function(
	    VisualCursor
		) {

		var PointerCursor = function(inputState) {
			this.inputState = inputState;
			this.visualCursor = new VisualCursor();
			this.interactiveLayers = {};
			this.x = 0;
			this.y = 0;
		};

		PointerCursor.prototype.moveTo = function(x, y, hoverCount) {
			this.x = x;
			this.y = y;
			return this.visualCursor.moveTo(x, y, hoverCount);
		};

		PointerCursor.prototype.inputVector = function(fromX, fromY, toX, toY) {
			this.visualCursor.visualizeVector(fromX, fromY, toX, toY);
		};

		PointerCursor.prototype.inputMouseAction = function(action) {
			this.visualCursor.visualizeMouseAction(action);
		};

		PointerCursor.prototype.registerInteractiveLayer = function(canvasGuiLayer) {
			this.interactiveLayers[canvasGuiLayer.id] = canvasGuiLayer;
		};

		PointerCursor.prototype.getPointerState = function() {
			return this.inputState.mouseState;
		};


		return PointerCursor;
	});