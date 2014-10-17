"use strict";

define([
	'gui/io/GameScreen',
	'gui/io/MouseActionListener',
	'goo/entities/SystemBus'

],
	function(
		GameScreen,
		MouseActionListener,
		SystemBus
		) {


		var x;
		var y;
		var dx;
		var dy;
		var wheelDelta;

		var ElementListeners = function() {
			this.mouseActionListener = new MouseActionListener();
			this.setupMouseListener();
		};



		ElementListeners.prototype.setupMouseListener = function() {
			this.mouseActionListener.setupElementClickListener(GameScreen.getElement());
			GameScreen.getElement().addEventListener('mousemove', function(e) {
				e.stopPropagation();
				x = (e.clientX);
				y = (e.clientY);
				dx = 2 * ((x) - GameScreen.getWidth() / 2) / GameScreen.getWidth();
				dy = 2 * ((y) - GameScreen.getHeight() / 2) / GameScreen.getHeight();
			});

			GameScreen.getElement().addEventListener('mouseout', function(e) {
				e.stopPropagation();
				dx = 0;
				dy = 0;
			});

			var zoomTimeout;

			GameScreen.getElement().addEventListener('mousewheel', function(e) {
				e.stopPropagation();
				if (zoomTimeout) return;
				wheelDelta = e.wheelDelta / 1200;
				setTimeout(function() {
					zoomTimeout = false;
				}, 100);
				zoomTimeout = true;
			});
		};


		ElementListeners.prototype.sampleMouseState = function(mouseStore) {
			this.mouseActionListener.sampleMouseAction(mouseStore);
			mouseStore.x = x;
			mouseStore.y = y;
			mouseStore.dx = dx;
			mouseStore.dy = dy;
			mouseStore.wheelDelta = wheelDelta;

			wheelDelta = 0;
			dx = 0;
			dy = 0;

		};



		return ElementListeners;




	});