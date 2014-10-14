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



		var MenuButton = function(control, data) {
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
			console.log("Screen Control: ", control, this);

		};

		MenuButton.prototype.onControlDisable = function() {
			this.state = 0;
		};

		MenuButton.prototype.onControlEnable = function() {
			this.state = 1;
		};

		MenuButton.prototype.onControlHover = function() {
			this.state = 2;
		};

		MenuButton.prototype.onControlHoverEnd = function() {
			this.state = 1;
		};

		MenuButton.prototype.onControlActive = function() {
			this.state = 3;
		};

		MenuButton.prototype.onControlRelease = function() {
			this.data.callback();
			this.state = 1;
		};

		MenuButton.prototype.beginValueManipulation = function() {

		};

		MenuButton.prototype.endValueManipulation = function() {

		};

		MenuButton.prototype.applyControlState = function(value){

		};

		MenuButton.prototype.setDragValue = function(xy) {

		};

		MenuButton.prototype.showMenuButton = function(color) {
			this.guiBusSends.showMenuButton(color);
		};

		MenuButton.prototype.showControlAxisHorizontal = function(fraction, color) {
			this.guiBusSends.showControlAxisHorizontal(fraction, color);
		};

		MenuButton.prototype.showControlAxisVertical = function(fraction, color) {
			this.guiBusSends.showControlAxisVertical(fraction, color);
		};

		MenuButton.prototype.updateAppliedState = function() {

		};

		MenuButton.prototype.updateInputState = function() {
			this.updateAppliedState();
		};

		MenuButton.prototype.showControlAxis = function() {
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

		MenuButton.prototype.showControlButtonState = function( color) {
			this.guiBusSends.showControlButtonState(color);
		};

		MenuButton.prototype.showControlState = function() {
			this.showMenuButton(this.states[this.state].color.box);
			this.showControlAxis();
		};

		MenuButton.prototype.checkHoverHit = function(xf, yf, hits) {
			if (xf > this.data.xMin && xf < this.data.xMax && yf > this.data.yMin && yf < this.data.yMax) {
				this.onControlHover();
				hits.push(this);
			}
		};

		return MenuButton;
	});