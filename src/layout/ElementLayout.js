"use strict";

define([
	'gui/layout/LayoutEnums',
	'data_pipeline/data/ConfigCache'
],
	function(
		LayoutEnums,
		ConfigCache
		) {

		var index = 0;

		var setDefault = function(layout) {
			layout.pos = {
				origin:{
					top:0,
					left:0
				},
				final:{
					top:0,
					left:0
				}
			};
			layout.size = {
				width:400,
				height:200
			};
			layout.data = {
				xMin: 0,
				xMax: 100,
				yMin: 0,
				yMax: 100
			};
			layout.callbacks = []
		};

		var ElementLayout = function(shape, onStateChange, drawData) {
			index +=1;
			this.id = shape+'_'+index;
			this.onStateChange = onStateChange;
			this.states = {
				passive:'passive'
			};
			this.state = this.states.passive;
			this.drawData = drawData;
			this.shape = shape;
			this.renderData = {};
			setDefault(this.renderData);
		};

		ElementLayout.prototype.valueYToUnitY = function(value, unit) {
			if (unit == LayoutEnums.units.pixels) {
				return this.renderData.pos.final.top + value;
			} else {
				return this.renderData.pos.final.top + (value*this.renderData.size.height*0.01);
			}
		};

		ElementLayout.prototype.valueXToUnitX = function(value, unit) {
			if (unit == LayoutEnums.units.pixels) {
				return this.renderData.pos.final.left + value;
			} else {
				return this.renderData.pos.final.left + (value*this.renderData.size.width*0.01);
			}
		};

		ElementLayout.prototype.valueToWidthPercent = function(value) {
			return this.renderData.size.width * 0.01 *value
		};

		ElementLayout.prototype.valueToHeightPercent = function(value) {
			return this.renderData.size.height * 0.01 *value
		};

		ElementLayout.prototype.registerElementState = function(state) {
			this.states[state] = state;
		};

		ElementLayout.prototype.imageCallback = function(image) {
			console.log("Call element image CB: ", image);
		};

		ElementLayout.prototype.getShapeData = function() {
			return this.drawData
		};

		ElementLayout.prototype.notifyStateChange = function(state) {
			this.state = state;
			this.onStateChange(state);
		};


		return ElementLayout

	});