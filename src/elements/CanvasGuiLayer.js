"use strict";

define([
	'goo/entities/SystemBus',
	'gui/layout/CanvasLayoutInterpreter',
	'gui/layout/ElementLayout',
	'gui/functions/InteractiveSurface',
	'gui/layout/GuiConstants'

],
	function(
		SystemBus,
		CanvasLayoutInterpreter,
		ElementLayout,
		InteractiveSurface,
		GuiConstants
		) {

		var guiStates = {
			hidden:'hidden',
			passive:'passive',
			on_hover:'on_hover',
			on_message:'on_message',
			on_active:'on_active',
			on_applied:'on_applied'
		};

		var RenderCall = function() {
			this.renderData = {};
			this.zIndex = 0;
		};

		var CanvasGuiLayer = function(layerKeys, parent, cursor, canvasCalls, data) {
			this.pointerCursor = cursor;
			this.renderCall = new RenderCall();
			if (parent) {
				this.parentLayout = parent.renderStates.passive;
				this.zIndex = parent.zIndex;
			} else {
				this.parentLayout = new ElementLayout();
				this.zIndex = 0;
			}

			this.zIndex += layerKeys.zIndex || 0;

			if (layerKeys.id) {
				this.id = layerKeys.id;
				SystemBus.emit("registerGuiElementId",{id:this.id, layer:this});
			} else {
				this.id = layerKeys.shape;
			}




			this.layerKeys = layerKeys;
			this.canvasCalls = canvasCalls;
			this.guiStateKeys = guiStates;
			this.state = this.guiStateKeys.passive;
			this.renderStates = {};



			var onStateChange = function(state) {
				this.setRenderState(state);
			}.bind(this);
			this.interactiveSurface = new InteractiveSurface(this, onStateChange, this.layerKeys);

			if (data) {

				this.setupElementLayout(data);
			} else {
				this.renderStates[this.state] = new ElementLayout(this.layerKeys.shape, null);
			}


			this.setRenderState(this.guiStateKeys.passive);

		};

		CanvasGuiLayer.prototype.onInputActivate = function() {
			this.interactiveSurface.onInputActivate();
		};

		CanvasGuiLayer.prototype.onInputRelease = function() {
			this.interactiveSurface.onInputRelease();
		};

		CanvasGuiLayer.prototype.checkHoverHit = function(xf, yf, hits) {
			this.interactiveSurface.checkHoverHit(xf, yf, hits);
		};

		CanvasGuiLayer.prototype.endValueManipulation = function() {
			this.interactiveSurface.endValueManipulation();
		};


		CanvasGuiLayer.prototype.updateInteractiveState = function(tpf, mouseState) {
			if (this.renderStates.on_hover){
				this.interactiveSurface.updateSurface(tpf, mouseState)
			}

		};

		CanvasGuiLayer.prototype.updateRenderData = function() {
			this.renderCall.renderData = this.renderStates[this.state].renderData;
			this.renderCall.zIndex = this.zIndex;
			this.canvasCalls.drawToCanvasGui(this.renderCall);
		};

		CanvasGuiLayer.prototype.drawCanvasLayer = function(tpf, mouseState) {
			if (this.state == this.guiStateKeys.hidden) return;
			this.updateInteractiveState(tpf, mouseState);
			this.updateRenderData();
			this.notifyRenderedState(this.state);
		};

		CanvasGuiLayer.prototype.setRenderState = function(state) {
			if (state == this.guiStateKeys.hidden) this.state = state;
			if (!this.renderStates[state]) return;

			this.state = state;
		};

		CanvasGuiLayer.prototype.notifyRenderedState = function(state) {
			if (this.renderedDtate != state) {
				if (this.pointerCursor) {
					this.pointerCursor.notifyInputStateTransition(state);
				}
			}
			this.renderedDtate = state;
		};


		CanvasGuiLayer.prototype.combineDataForState = function(property, delta, targetState) {
			var combine = function(prop, source, target) {

				for (var key in source) {

					if (key == 'image_svg') {

					}

					if (typeof(source[key]) == 'object') {
						var next = key;
						if (!target[key]) {
							target[key] = {}
						}
						combine(next, source[key], target[key])
					} else {

						target[key] = source[key];
					}
				}
			};
			combine(property, delta, targetState);
		};

		CanvasGuiLayer.prototype.addLayerState = function(state, data) {

			this.renderStates[state] = new ElementLayout(this.layerKeys.shape, this.interactiveSurface.onStateChange, data);
			this.renderStates[state].registerElementState(state);
			CanvasLayoutInterpreter.setupDrawShape(this.renderStates[state].drawData, this.renderStates[state], this.parentLayout, this.canvasCalls);
		};

		CanvasGuiLayer.prototype.cookData = function(data) {
			var clone = GuiConstants.clone(data);
			this.attachConstantRules(clone);
			GuiConstants.applyConstantValues(clone);
			return clone;
		};


		CanvasGuiLayer.prototype.addPassiveLayer = function(data) {
			this.addLayerState(this.guiStateKeys.passive, this.cookData(data).passive);
		};

		CanvasGuiLayer.prototype.addActiveLayer = function(data) {
			var addStateData = this.cookData(data).passive;

			this.combineDataForState(this.guiStateKeys.on_active, this.cookData(data).on_active, addStateData);
			this.addLayerState(this.guiStateKeys.on_active, addStateData);
		};

		CanvasGuiLayer.prototype.addAppliedLayer = function(data) {
			var addStateData = this.cookData(data).passive;

			this.combineDataForState(this.guiStateKeys.on_applied, this.cookData(data).on_applied, addStateData);
			this.addLayerState(this.guiStateKeys.on_applied, addStateData);
		};

		CanvasGuiLayer.prototype.addMessageLayer = function(data) {
			var addStateData =this.cookData(data).passive;
			this.combineDataForState(this.guiStateKeys.on_message, this.cookData(data).on_message, addStateData);
			this.addLayerState(this.guiStateKeys.on_message, addStateData);
			if (this.layerKeys.on_message) {
				CanvasLayoutInterpreter.applyMessageCallback(this.layerKeys.on_message, this.renderStates.on_message);
			}
		};


		CanvasGuiLayer.prototype.addHoverLayer = function(data) {

			var addStateData = this.cookData(data).passive;
			this.combineDataForState(this.guiStateKeys.on_hover, this.cookData(data).on_hover, addStateData);

			this.addLayerState(this.guiStateKeys.on_hover, addStateData);
			this.pointerCursor.registerInteractiveLayer(this);
		};


		CanvasGuiLayer.prototype.addTextLabels = function() {
			for (var index in this.renderStates) {
				if (this.layerKeys.text[index]) {
					CanvasLayoutInterpreter.buildTextLabel(this.layerKeys.text[index], this.renderStates[index].renderData);
				} else {
					CanvasLayoutInterpreter.buildTextLabel(this.layerKeys.text, this.renderStates[index].renderData);
				}
			}
		};


		CanvasGuiLayer.prototype.attachConstantRules = function(data) {
			GuiConstants.applyLayoutRules(data)
		};

		CanvasGuiLayer.prototype.setupElementLayout = function(data) {
		//
		//	var orig = GuiConstants.clone(data);
		//	this.attachConstantRules(orig);


			this.addPassiveLayer(data);

			if (data.on_active) {
				this.addActiveLayer(data);
			}

			if (data.on_applied) {
				this.addAppliedLayer(data);
			}

			if (data.on_message) {
				this.addMessageLayer(data)
			}

			if (data.on_hover) {
			    this.addHoverLayer(data)
			}

			if (this.layerKeys.text) {
				this.addTextLabels()
			}

		};

		return CanvasGuiLayer
	});