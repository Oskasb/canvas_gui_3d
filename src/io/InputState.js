"use strict";

define([
	'gui/io/ElementListeners'
],
	function(
		ElementListeners

		) {

	    var InputState = function() {
		    this.mouseState = {
			    x:0,
			    y:0,
			    dx:0,
			    dy:0,
			    wheelDelta:0,
			    action:[0, 0],
			    visualXY: null
		    };
		    this.elementListeners = new ElementListeners(this.mouseState);
		    this.interactionTargets = [];
	    };


		InputState.prototype.updateInputState = function(tpf, pointerCursor) {
			this.elementListeners.sampleMouseState(this.mouseState);
			this.mouseState.visualXY = pointerCursor.moveTo(this.mouseState.x, this.mouseState.y);
			this.processMouseTargets(pointerCursor, this.mouseState.visualXY);
			this.processHoverTargets();
			if (this.mouseState.action[0] + this.mouseState.action[1]) {
				pointerCursor.inputMouseAction(this.mouseState.action);
			}
		};


		InputState.prototype.getMouseState = function() {
			return this.mouseState;
		};

		InputState.prototype.processMouseTargets = function(pointerCursor, xy) {
			this.interactionTargets.length = 0;
			for (var index in pointerCursor.interactiveLayers) {
				pointerCursor.interactiveLayers[index].checkHoverHit(xy.x, xy.y, this.interactionTargets);
			}
		};

		InputState.prototype.processHoverTargets = function() {
			if (this.interactionTargets.length > 0) {
				for (var i = 0; i < this.interactionTargets.length; i++) {
					this.interactionTargets[i].onControlHover();
				}
			}
		};

		return InputState;
	});