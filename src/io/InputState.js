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
				drag:false,
				startDrag:[0, 0],
				dragDistance:[0, 0],
			    action:[0, 0],
			    lastAction:[0, 0],
			    visualXY: {x:0, y:0},
				interactionTargets:[],
				pressingButton:false
		    };
		    this.elementListeners = new ElementListeners(this.mouseState);
		    this.buttonDownTargets = [];
			this.dragTargets = [];
	    };

		InputState.prototype.processDragState = function(pointerCursor) {
			if (this.dragTargets.length) {
				pointerCursor.inputVector(
					this.mouseState.startDrag[0],
					this.mouseState.startDrag[1],
					this.mouseState.x,
					this.mouseState.y
				);
				this.buttonDownTargets.length = 0;
			}

			if (this.buttonDownTargets.length) {
				if (this.mouseState.dx || this.mouseState.dy) {
					if (!this.mouseState.drag) {
						this.mouseState.startDrag[0] = this.mouseState.x;
						this.mouseState.startDrag[1] = this.mouseState.y;
						this.mouseState.drag = true;
						for (var i = 0; i < this.buttonDownTargets.length; i++) {
							if (this.buttonDownTargets[i].onDragCallbacks.length) {
								this.dragTargets.push(this.buttonDownTargets[i]);
								this.buttonDownTargets[i].beginValueManipulation();
							}
						}
					}
				}
			}

			this.mouseState.dragDistance[0] = this.mouseState.startDrag[0] - this.mouseState.x;
			this.mouseState.dragDistance[1] = this.mouseState.startDrag[1] - this.mouseState.y;
			for (i = 0; i < this.dragTargets.length; i++) {
				this.dragTargets[i].setDragValue(this.mouseState.dragDistance);
				this.dragTargets[i].onControlHover();
			}

		};

		InputState.prototype.updateInputState = function(tpf, pointerCursor) {
			this.mouseState.lastAction[0] = this.mouseState.action[0];
			this.mouseState.lastAction[1] = this.mouseState.action[1];

			this.processDragState(pointerCursor);

			this.elementListeners.sampleMouseState(this.mouseState);
			this.mouseState.visualXY = pointerCursor.moveTo(this.mouseState.x, this.mouseState.y);
			this.processHoverTargets();



			if (this.mouseState.lastAction[0] != this.mouseState.action[0] || this.mouseState.lastAction[1] != this.mouseState.action[1]) {
				this.dragEnded();
				pointerCursor.inputMouseAction(this.mouseState.action);

				if (this.mouseState.action[0] + this.mouseState.action[1]) {
					this.mouseButtonEmployed();
				} else {
					if (this.mouseState.pressingButton == true) {
						this.handleReleaseTargets();
					}
				}
			}

			if (this.mouseState.action[0] + this.mouseState.action[1]) {

					this.showActivatedHovered();

			}

			if (!this.buttonDownTargets.length) {
				this.mouseState.pressingButton = false;
			}
		};

		InputState.prototype.dragEnded = function() {
			this.mouseState.drag = false;
			this.dragTargets.length = 0;
		};

		InputState.prototype.handleReleaseTargets = function() {

			for (var i = 0 ; i < this.buttonDownTargets.length; i++) {
				this.buttonDownTargets[i].triggerOnApply();
			}
		};


		InputState.prototype.mouseButtonEmployed = function() {

			if (this.mouseState.action[0]) {
				this.handleLeftButtonPress();
			} else {
				this.dragEnded();
			}
		};

		InputState.prototype.showActivatedHovered = function() {
			this.buttonDownTargets.length = 0;
			if (this.mouseState.pressingButton == true) {
				for (var i = 0; i < this.mouseState.interactionTargets.length; i++) {
					this.mouseState.interactionTargets[i].onControlActive(this.buttonDownTargets);
				}
			}
		};

		InputState.prototype.handleLeftButtonPress = function() {
			this.mouseState.pressingButton = true;
			this.mouseState.lastAction[0] = this.mouseState.action[0];
			this.showActivatedHovered()
		};

		InputState.prototype.initFrameSample = function() {
			this.mouseState.interactionTargets.length = 0;
		};

		InputState.prototype.processHoverTargets = function() {
			if (this.mouseState.interactionTargets.length > 0) {
				for (var i = 0; i < this.mouseState.interactionTargets.length; i++) {
					this.mouseState.interactionTargets[i].onControlHover();
				}
			}

		};

		return InputState;
	});