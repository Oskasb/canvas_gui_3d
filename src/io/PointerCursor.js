"use strict";

define([
	'gui/io/VisualCursor'
],
	function(
	    VisualCursor
		) {

		var PointerCursor = function() {
			this.visualCursor = new VisualCursor();
			this.interactiveLayers = {};

			this.x = 0;
			this.y = 0;
		};

		PointerCursor.prototype.moveTo = function(x, y, hoverCount) {
			this.x = x;
			this.y = y;
			this.visualCursor.moveTo(x, y);
		};

		VisualCursor.prototype.inputVector = function(fromX, fromY, toX, toY) {
			VisualCursor.visualizeVector(fromX, fromY, toX, toY);
		};


		PointerCursor.prototype.inputMouseAction = function(action, xy) {
			//	console.log("mouse:", action, xy);
			VisualCursor.visualizeMouseAction(action, xy);
		};

		PointerCursor.prototype.registerInteractiveLayer = function(canvasGuiLayer) {
			this.interactiveLayers[canvasGuiLayer.id] = canvasGuiLayer;
		};

		return PointerCursor;
	});