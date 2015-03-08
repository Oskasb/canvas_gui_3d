"use strict";

define([
	'gui/io/VisualCursor'
],
	function(
	    VisualCursor
		) {

		var PointerCursor = function(inputState) {

			this.guiStateTransitionCallbacks = {
				passive:[],
				on_hover:[],
				on_active:[],
				on_applied:[],
				on_message:[]
			};

			this.pointerStateTransitionCallbacks = {
				press_0:[],
				press_1:[],
				press_2:[],
				release_0:[],
				release_1:[],
				release_2:[]
			};

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

		PointerCursor.prototype.addGuiStateTransitionCallback = function(transitionId, callback) {

			if (!this.guiStateTransitionCallbacks[transitionId]) {
				this.guiStateTransitionCallbacks[transitionId] = [];
			}

			if (this.guiStateTransitionCallbacks[transitionId].indexOf(callback) != -1) {
				console.error("Function for Gui transition state callback already registered");
			} else {
				this.guiStateTransitionCallbacks[transitionId].push(callback);
			}
		};



		PointerCursor.prototype.notifyInputStateTransition = function(transitionId) {

			if (this.guiStateTransitionCallbacks[transitionId]) {
				for (var i = 0 ; i < this.guiStateTransitionCallbacks[transitionId].length; i++) {
					this.guiStateTransitionCallbacks[transitionId][i]();
				}
			}
		};

		return PointerCursor;
	});