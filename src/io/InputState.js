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
			    lastAction:[0, 0],
			    visualXY: null
		    };
		    this.elementListeners = new ElementListeners(this.mouseState);
		    this.interactionTargets = [];
		    this.buttonDownTargets = [];
	    };


		InputState.prototype.updateInputState = function(tpf, pointerCursor) {
			this.elementListeners.sampleMouseState(this.mouseState);
			this.mouseState.visualXY = pointerCursor.moveTo(this.mouseState.x, this.mouseState.y);
			this.processMouseTargets(pointerCursor, this.mouseState.visualXY);
			this.processHoverTargets();
			if (this.mouseState.action[0] + this.mouseState.action[1]) {
				pointerCursor.inputMouseAction(this.mouseState.action);
				this.mouseButtonEmployed();
			} else {
				if (this.buttonDownTargets.length) {
					this.handleReleaseTargets();
				}
			}

		};

		InputState.prototype.handleReleaseTargets = function() {

			for (var i = 0 ; i < this.buttonDownTargets.length; i++) {
				this.buttonDownTargets[i].triggerOnApply();
			}
		};


		InputState.prototype.mouseButtonEmployed = function() {

			if (this.mouseState.action[0]) {
				this.handleLeftButtonPress();
			}
		};

		InputState.prototype.handleLeftButtonPress = function() {
			this.mouseState.lastAction[0] = this.mouseState.action[0];
			this.buttonDownTargets.length = 0;
			for (var i = 0; i < this.interactionTargets.length; i++) {
				this.interactionTargets[i].onControlActive(this.buttonDownTargets);
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