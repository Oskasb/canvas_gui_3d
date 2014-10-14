"use strict";

define([
	'goo/entities/SystemBus',
	'application/EventManager',
	'io/GameScreen',
	'gui/GuiBusSends'
],
	function(
		SystemBus,
		event,
		GameScreen,
		GuiBusSends
		) {



		var ScreenControlTarget = function(entity, control, data) {
			this.entity = entity;
			this.control = control;
			this.data = data;
			this.guiBusSends = new GuiBusSends(this.data);

			this.range = this.data.max - this.data.min;
			this.intensity = 1;

			this.buttonStates = [
				[0.8, 0.7, 0.4,0.8],
				[0.5, 0.6, 0.7,0.3]
			];

			this.states = [
				{id:'disabled', intensity:0.3, color:{rect:[0.1, 0.2, 0.7,0.6], box:[0.1, 0.2, 0.7,0.6], axis:[0.1, 0.2, 0.7,1], diff:[0.1, 0.2, 0.7,1], active:[0.1, 0.2, 0.7,0.6]}},
				{id:'enabled',  intensity:0.3, color:{rect:[0.0, 0.1, 0.2,0.2], box:[0.3, 0.5, 0.6,0.4], axis:[0.7, 0.6, 0.3,1], diff:[0.5, 0.4, 0.3,1], active:[0.2, 0.5, 0.2,0.6]}},
				{id:'hover',    intensity:0.5, color:{rect:[0.0, 0.1, 0.2,0.2], box:[0.4, 0.6, 0.7,0.5], axis:[0.8, 0.7, 0.4,1], diff:[0.5, 0.4, 0.3,1], active:[0.2, 0.5, 0.2,0.6]}},
				{id:'active',   intensity:0.7, color:{rect:[0.0, 0.1, 0.2,0.2], box:[0.5, 0.7, 0.8,0.6], axis:[0.9, 0.8, 0.5,1], diff:[0.5, 0.4, 0.3,1], active:[0.2, 0.5, 0.2,0.6]}},
			];

			this.state = 0;

			this.stateHover = false;
			this.stateActive = false;
			this.startFromValue = 0;
			this.triggerTime = 0;
	//		console.log("Screen Control: ", control, this);
			this.value = this.entity.pieceInput.readControlValue(this.control);

		};

		ScreenControlTarget.prototype.onControlDisable = function() {
			this.state = 0;
		};

		ScreenControlTarget.prototype.onControlEnable = function() {
			this.state = 1;
		};

		ScreenControlTarget.prototype.onControlHover = function() {
			this.state = 2;
		};

		ScreenControlTarget.prototype.onControlHoverEnd = function() {
			this.state = 1;
		};

		ScreenControlTarget.prototype.onControlActive = function() {
			this.state = 3;
		};

		ScreenControlTarget.prototype.onControlRelease = function() {
			this.state = 1;
		};

		ScreenControlTarget.prototype.beginValueManipulation = function() {
			var now =  new Date().getTime();
			this.startFromValue = this.entity.pieceInput.readControlValue(this.control);
			if (this.value == 1 && this.data.axis == 2) return;
			this.triggerTime = now;
			this.onControlActive();
		};

		ScreenControlTarget.prototype.endValueManipulation = function() {
			var now =  new Date().getTime();
			if (now - this.triggerTime < 200 && this.data.axis != 2) {
				this.entity.pieceInput.controls[this.control].value = 0;
				this.entity.pieceInput.controls[this.control].update = false;
				event.fireEvent(event.list().PLAYER_CONTROL_EVENT, {control:this.control, value:0});
				this.value = 0;
			}
			this.stateActive = false;
		};

		ScreenControlTarget.prototype.applyControlState = function(value){
			event.fireEvent(event.list().PLAYER_CONTROL_EVENT, {control:this.control, value:value});
			this.entity.pieceInput.setInputState(this.control, value);
			this.value = value;
			this.showControlState();
		};

		ScreenControlTarget.prototype.setDragValue = function(xy) {
			if (this.data.axis == 2) return;
			var width = GameScreen.getWidth();
			var height = GameScreen.getHeight();
			var rectScale = [width*((this.data.xMax-this.data.xMin)/100), height*((this.data.yMax-this.data.yMin)/100)];

			var value = this.startFromValue + xy[this.data.axis] / rectScale[this.data.axis];
			value = Math.max(value, this.data.min);
			value = Math.min(value, this.data.max);
			this.applyControlState(value);

		};

		ScreenControlTarget.prototype.showControlWidget = function(color) {
			this.guiBusSends.showControlWidget(color);
		};

		ScreenControlTarget.prototype.showControlAxisHorizontal = function(fraction, color) {
			this.guiBusSends.showControlAxisHorizontal(fraction, color);
		};

		ScreenControlTarget.prototype.showControlAxisVertical = function(fraction, color) {
			this.guiBusSends.showControlAxisVertical(fraction, color);
		};

		ScreenControlTarget.prototype.updateAppliedState = function() {
			this.appliedState = this.entity.pieceInput.getAppliedState(this.control);
			this.appliedFraction = ((this.appliedState / this.range) - (this.data.min / this.range));
		};

		ScreenControlTarget.prototype.updateInputState = function() {
			this.controlState = this.entity.pieceInput.getInputState(this.control);
			this.controlState = Math.max(this.controlState, this.data.min);
			this.controlState = Math.min(this.controlState, this.data.max);
			this.fraction = ((this.controlState / this.range) - (this.data.min / this.range));
			this.updateAppliedState();
		};

		ScreenControlTarget.prototype.showControlAxis = function() {
			this.updateInputState();
			if (this.data.axis == 1) {
				this.guiBusSends.showControlDiffHorizontal(this.states[this.state].color.diff, this.appliedFraction, this.fraction);
				this.guiBusSends.showControlAxisHorizontal(this.fraction, this.states[this.state].color.axis);
				this.guiBusSends.showAppliedStateHorizontal(this.states[this.state].color.active, this.appliedState);
			} else if (this.data.axis == 2){
			//	this.showControlDiffButton([1, 0.6, 0, 0.4*Math.sqrt(Math.abs(this.appliedState-this.controlState))]);

				this.guiBusSends.showAppliedStateHorizontal(this.states[this.state].color.active, this.appliedState);
				this.guiBusSends.showControlAxisHorizontal(this.appliedState, this.states[this.state].color.axis);
				this.guiBusSends.showControlButtonState(this.buttonStates[Math.floor(1-this.appliedState)]);

			//	if (this.state == 3) this.guiBusSends.showControlWidget(this.states[this.state].color.active)

			} else {
				this.guiBusSends.showControlDiffVertical(this.states[this.state].color.diff, this.appliedFraction, this.fraction);
				this.guiBusSends.showControlAxisVertical(this.fraction, this.states[this.state].color.axis);
				this.guiBusSends.showAppliedStateVertical(this.states[this.state].color.active, this.appliedState);

			}
		};

		ScreenControlTarget.prototype.showControlButtonState = function( color) {
			this.guiBusSends.showControlButtonState(color);
		};

		ScreenControlTarget.prototype.showControlState = function() {
			this.showControlWidget(this.states[this.state].color.box);
			this.showControlAxis();
		};

		ScreenControlTarget.prototype.checkHoverHit = function(xf, yf, hits) {
			if (xf > this.data.xMin && xf < this.data.xMax && yf > this.data.yMin && yf < this.data.yMax) {
				this.onControlHover();
				hits.push(this);
			}
		};

		return ScreenControlTarget;
	});