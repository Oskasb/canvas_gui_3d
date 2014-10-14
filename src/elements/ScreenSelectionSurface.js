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

		var ScreenSelectionSurface = function(data) {
			this.guiBusSends = new GuiBusSends(data);
			this.data = data;
			this.name = data.name;
			this.state = 0;
			this.states = [
				    data.closed,
					data.active
				];
			this.controls = {}
		};

		ScreenSelectionSurface.prototype.registerControlTargets = function(screenControlTarget) {
			this.controls[screenControlTarget.control] = screenControlTarget;
			screenControlTarget.onControlEnable();
		};

		ScreenSelectionSurface.prototype.updateBusSendData = function() {
			this.guiBusSends.data = this.states[this.state];
		};

		ScreenSelectionSurface.prototype.onControlEnable = function() {

			this.state = 0;
			this.updateBusSendData();
		};

		ScreenSelectionSurface.prototype.onControlHover = function() {
			this.state = 1;
			this.updateBusSendData();
		};

		ScreenSelectionSurface.prototype.checkHoverHit = function(xf, yf, hits) {
			if (hits.length != 0) return;
			if (xf > this.states[this.state].xMin && xf < this.states[this.state].xMax && yf > this.states[this.state].yMin && yf < this.states[this.state].yMax) {
				this.onControlHover();

				for (var index in this.controls) {
					this.controls[index].checkHoverHit(xf, yf, hits);
				}

			} else {
				this.onControlEnable();
			}
			return this.state;
		};

		ScreenSelectionSurface.prototype.showControlStates = function() {
			for (var index in this.controls) {
				this.controls[index].onControlEnable();
				this.controls[index].showControlState();
			}
		};

		ScreenSelectionSurface.prototype.showSelectionSurface = function(color) {
			this.guiBusSends.showMenuButton(color);
			if (this.state == 1) this.showControlStates();
		};

		return ScreenSelectionSurface;

	});