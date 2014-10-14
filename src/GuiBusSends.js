"use strict";

define([
	'goo/entities/SystemBus'
],

	function(
		SystemBus
		) {

		var GuiBusSends = function(data) {
			this.data = data;
			this.range = this.data.max - this.data.min;
		};

		GuiBusSends.prototype.showControlWidget = function(color) {
			SystemBus.emit('guiFlash', {
			//	rect:{x:this.data.xMin, y:this.data.yMin, w:this.data.xMax-this.data.xMin, h:this.data.yMax-this.data.yMin, color:[color[0]*0.3,color[1]*0.3, color[2]*0.3, color[3]]},
				box: {x:this.data.xMin, y:this.data.yMin, w:this.data.xMax-this.data.xMin, h:this.data.yMax-this.data.yMin, color:color, lineW:2},
		//		text:{label:this.data.name, font:17, x:this.data.xMin-0.2, y:this.data.yMin-2, color:[Math.sqrt(color[0]), Math.sqrt(color[1]), Math.sqrt(color[2]), Math.sqrt(color[3])]}
			});
		};

		GuiBusSends.prototype.axisFrom = function(fraction) {
			if (this.data.axis) {
				return this.data.yMax-fraction*(this.data.yMax-this.data.yMin);
			}
			return this.data.xMax-fraction*(this.data.xMax-this.data.xMin);
		};

		GuiBusSends.prototype.showMenuButton = function(color) {
			SystemBus.emit('guiFlash', {
		    	rect:{x:this.data.xMin, y:this.data.yMin, w:this.data.xMax-this.data.xMin, h:this.data.yMax-this.data.yMin, color:[color[0]*0.3,color[1]*0.6, color[2]*0.7, color[3]]},
				box: {x:this.data.xMin, y:this.data.yMin, w:this.data.xMax-this.data.xMin, h:this.data.yMax-this.data.yMin, color:color, lineW:2},
	//			text:{label:this.data.name, font:25, x:this.data.xMin+0.6, y:this.data.yMin+0.4, color:[Math.sqrt(color[0]*0.5)+0.5, Math.sqrt(color[1]*0.6)+0.4, Math.sqrt(color[2]), Math.sqrt(color[3])]}
			});
		};

		GuiBusSends.prototype.showControlAxisHorizontal = function(fraction, color) {
			SystemBus.emit('guiFlash', {
				line:{
					fromX:this.data.xMin,
					fromY:this.axisFrom(fraction),
					toX:this.data.xMax,
					toY:this.axisFrom(fraction),
					w:4,
					color:color
				},
				/*
				text:{
					label:this.data.label,
					font:15,
					x:this.data.xMin+0.4,
					y:this.axisFrom(fraction)+0.2,
					color:color
				}
                */
			});
		};

		GuiBusSends.prototype.showControlDiffHorizontal = function(color, appliedFraction, fraction) {
			SystemBus.emit('guiFlash', {
				rect:{
					x:this.data.xMin,
					y:this.axisFrom(appliedFraction),
					w:this.data.xMax-this.data.xMin,
					h:this.data.yMax-this.axisFrom(appliedFraction-fraction),
					color:color

				}
			});
		};

		GuiBusSends.prototype.showAppliedStateHorizontal = function(color, appliedFraction) {
			SystemBus.emit('guiFlash', {
				rect:{
					x:this.data.xMin,
					y:this.axisFrom((appliedFraction/(this.data.max-this.data.min))-(this.data.max-(this.data.max-this.data.min))/(this.data.max-this.data.min)),
					w:this.data.xMax-this.data.xMin,
					h:-(this.data.yMin-this.data.yMax)*appliedFraction/(this.data.max-this.data.min),
					color:color
				},
			/*
				line:{
					fromY:this.axisFrom((appliedFraction/(this.data.max-this.data.min))-(this.data.max-(this.data.max-this.data.min))/(this.data.max-this.data.min)),
					fromX:this.data.xMin,
					toY:this.axisFrom((appliedFraction/(this.data.max-this.data.min))-(this.data.max-(this.data.max-this.data.min))/(this.data.max-this.data.min)),
					toX:this.data.xMax,
					w:4,
					color:color
				},
            */
			});
		};

		GuiBusSends.prototype.showAppliedStateVertical = function(color, appliedFraction) {
			SystemBus.emit('guiFlash', {
				rect:{
					x:this.axisFrom((appliedFraction/(this.data.max-this.data.min))-(this.data.max-(this.data.max-this.data.min))/(this.data.max-this.data.min)),
					y:this.data.yMin,
					w:-(this.data.xMin-this.data.xMax)*appliedFraction/(this.data.max-this.data.min),
					h:this.data.yMax-this.data.yMin,
					color:color
				},
			/*
				line:{
					fromX:this.axisFrom((appliedFraction/(this.data.max-this.data.min))-(this.data.max-(this.data.max-this.data.min))/(this.data.max-this.data.min)),
					fromY:this.data.yMin,
					toX:this.axisFrom((appliedFraction/(this.data.max-this.data.min))-(this.data.max-(this.data.max-this.data.min))/(this.data.max-this.data.min)),
					toY:this.data.yMax,
					w:4,
					color:color
				}
            */
			});
		};

		GuiBusSends.prototype.showControlAxisVertical = function(fraction, color) {
			SystemBus.emit('guiFlash', {
				line:{
					fromX:this.axisFrom(fraction),
					fromY:this.data.yMin,
					toX:this.axisFrom(fraction),
					toY:this.data.yMax,
					w:4,
					color:color
				},

			/*
				text:{
					label:this.data.label,
					font:15,
					x:this.axisFrom(fraction)+0.5,
					y:this.data.yMin+0.2,
					color:color
				}

				*/
			});
		};

		GuiBusSends.prototype.showControlDiffVertical = function(color, appliedFraction, fraction) {
			SystemBus.emit('guiFlash', {
				rect:{
					x:this.axisFrom(appliedFraction),
					y:this.data.yMin,
					w:this.data.xMax-this.axisFrom(appliedFraction-fraction),
					h:this.data.yMax-this.data.yMin,
					color:color
				}
			});
		};

		GuiBusSends.prototype.showControlButtonState = function(color) {
			SystemBus.emit('guiFlash', {
				box:{
					x:this.data.xMin,
					y:this.data.yMin,
					w:this.data.xMax-this.data.xMin,
					h:this.data.yMax-this.data.yMin,
					color:color
				}
			});
		};



		return GuiBusSends
	});
