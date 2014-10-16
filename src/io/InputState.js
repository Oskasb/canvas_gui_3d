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
			    action:[0, 0]
		    };
		    this.elementListeners = new ElementListeners(this.mouseState);

	    };


		InputState.prototype.updateInputState = function(tpf, pointerCursor) {
			this.elementListeners.sampleMouseState(this.mouseState);
			pointerCursor.moveTo(this.mouseState.x, this.mouseState.y);
			pointerCursor.inputMouseAction(this.mouseState.action);
		};

		InputState.prototype.getMouseState = function() {
			return this.mouseState;
		};

		return InputState;




	});