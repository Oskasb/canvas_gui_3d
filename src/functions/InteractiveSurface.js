"use strict";

define([
	'gui/functions/UiCallbacks'
],
	function(
		UiCallbacks
		) {

		var InteractiveSurface = function(canvasGuiLayer, onStateChange, layerKeys) {

			this.onStateChange = onStateChange;
			this.canvasGuiLayer = canvasGuiLayer;
			this.renderStates = canvasGuiLayer.renderStates;
			this.onApplyCallbacks = {};
			this.onDragCallbacks = [];
			this.min = 0;
			this.max = 1;
			this.dragDist = 0;
			this.currentState = 0;
			this.currentDrag = [0, 0];
			this.startDrag = [0, 0];
			if (layerKeys.on_apply) {
				this.registerOnApplyCalls(layerKeys.on_apply);
			}
			if (layerKeys.on_drag) {
				this.registerOnDragCalls(layerKeys.on_drag);
			}
		};


		InteractiveSurface.prototype.triggerOnApply = function() {
			for (var key in this.onApplyCallbacks) {
				this.onApplyCallbacks[key]();
			}
		};

		InteractiveSurface.prototype.registerApplyCallback = function(callId, callback) {
			this.onApplyCallbacks[callId] = callback;
		};

		InteractiveSurface.prototype.setupApplyCallback = function(callId, params) {
			var gameCall = UiCallbacks.getCallById(callId);
			var callback = function() {
				gameCall(params);
			};
			this.registerApplyCallback(callId, callback);
		};

		InteractiveSurface.prototype.registerOnApplyCalls = function(calls) {
			this.onApplyCallbacks = [];
			if (calls.length) {
				for (var i = 0; i < calls.length; i++) {
					this.setupApplyCallback(calls[i].call, calls[i].params);
				}
			} else {
				this.setupApplyCallback(calls.call, calls.params);
			}
		};

		InteractiveSurface.prototype.triggerOnDragUpdate = function(dragXY) {
			for (var i = 0; i < this.onDragCallbacks.length; i++) {

				var params = this.onDragCallbacks[i].params;

				if (params.axis == 0) {
					this.dragDist = this.renderStates[this.canvasGuiLayer.state].renderData.size.width
				} else {
					this.dragDist = this.renderStates[this.canvasGuiLayer.state].renderData.size.height
				}

				this.currentDrag[params.axis] = this.onDragCallbacks[i].startDrag[params.axis] + dragXY[params.axis] / this.dragDist;
				params.value = this.currentDrag[params.axis];

				this.currentState = params.value;

				this.onDragCallbacks[i].callback(params);
			}
		};

		InteractiveSurface.prototype.registerDragCallback = function(callback, params) {
			params.value = 0;
			this.onDragCallbacks.push({callback:callback, params:params, startDrag:[0, 0]});
		//	this.triggerOnDragUpdate([0, 0]);
		};

		InteractiveSurface.prototype.setupDragCallback = function(callId, params) {




			var gameCall = UiCallbacks.getCallById(callId);
			var callback = function(inputParams) {
				gameCall(inputParams);
			};
			this.registerDragCallback(callback, params);
		};


		InteractiveSurface.prototype.registerOnDragCalls = function(calls) {
			this.onDragCallbacks = [];
			if (calls.length) {
				for (var i = 0; i < calls.length; i++) {
					this.setupDragCallback(calls[i].call, calls[i].params);
				}
			} else {
				this.setupDragCallback(calls.call, calls.params);
			}
		};

		InteractiveSurface.prototype.propagateStateChange = function(state) {
			if (this.canvasGuiLayer.state == this.canvasGuiLayer.guiStateKeys.hidden) return;
			if (this.canvasGuiLayer.state == 'on_enabled') return;
			if (this.canvasGuiLayer.state != state) {
				this.canvasGuiLayer.setRenderState(state);
			}

		};

		InteractiveSurface.prototype.surfaceStateCheck = function(state) {
			if (this.canvasGuiLayer.state != state) {
				this.propagateStateChange(state);
			}
		};

		InteractiveSurface.prototype.setDragValue = function(dragDelta) {
			 this.triggerOnDragUpdate(dragDelta);
		};


		InteractiveSurface.prototype.showControlState = function() {

		};

		InteractiveSurface.prototype.beginValueManipulation = function() {
			for (var i = 0; i < this.onDragCallbacks.length; i++) {
				this.onDragCallbacks[i].startDrag[this.onDragCallbacks[i].params.axis] = UiCallbacks.getCallById('fetchControlState')(this.onDragCallbacks[i].params.control);
			}
		};


		InteractiveSurface.prototype.onControlActive = function(targetArray) {
			if (this.canvasGuiLayer.state == 'on_enabled') return;
			targetArray.push(this);
			this.propagateStateChange('on_active');
		};


		InteractiveSurface.prototype.onInputActivate = function() {
			this.onControlActive();
		};

		InteractiveSurface.prototype.onInputRelease = function() {
			this.endValueManipulation();
		};


		InteractiveSurface.prototype.endValueManipulation = function() {
			if (this.canvasGuiLayer.state == 'on_active') {
				this.triggerOnApply();
			}

			if (this.canvasGuiLayer.state != 'passive') {
				this.surfaceStateCheck('passive');
			}
		};

		InteractiveSurface.prototype.onControlHover = function() {
			this.surfaceStateCheck('on_hover')
		};

		InteractiveSurface.prototype.updateSurface = function(tpf, mouseState) {
			if (this.canvasGuiLayer.state == this.canvasGuiLayer.guiStateKeys.hidden) return;

			this.data = this.renderStates[this.canvasGuiLayer.state].renderData.data;
			if (mouseState.visualXY.x > this.data.xMin
				&& mouseState.visualXY.x < this.data.xMax
				&& mouseState.visualXY.y > this.data.yMin
				&& mouseState.visualXY.y < this.data.yMax) {
				mouseState.interactionTargets.push(this);
			} else {
				if (this.canvasGuiLayer.state == 'on_hover' || this.canvasGuiLayer.state == 'on_active') {
					this.surfaceStateCheck('passive');
				}
			}
		};

		return InteractiveSurface;

	});