"use strict";

define([
	'gui/io/GameScreen',
	'gui/io/MouseActionListener',
	'gui/io/TouchActionListener'
],
	function(
		GameScreen,
		MouseActionListener,
		TouchActionListener
		) {


		var x;
		var y;
		var dx;
		var dy;
		var wheelDelta;

		var ElementListeners = function() {
			this.mouseActionListener = new MouseActionListener();
			this.touchActionListener = new TouchActionListener();
			this.setupMouseListener();
			this.setupTouchListener();
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

		ElementListeners.prototype.setupTouchListener = function() {
			this.touchActionListener.setupElementTouchListener(GameScreen.getElement());
			GameScreen.getElement().addEventListener('touchstart', function(e) {
				e.preventDefault();
				x = (e.touches[0].clientX);
				y = (e.touches[0].clientY);
				dx = 0;
				dy = 0;
			});

			GameScreen.getElement().addEventListener('touchmove', function(e) {
				e.preventDefault();
				x = (e.touches[0].clientX);
				y = (e.touches[0].clientY);
				dx = 2 * ((x) - GameScreen.getWidth() / 2) / GameScreen.getWidth();
				dy = 2 * ((y) - GameScreen.getHeight() / 2) / GameScreen.getHeight();
			});


			GameScreen.getElement().addEventListener('touchend', function(e) {
				e.preventDefault();
				dx = 0;
				dy = 0;
			});
		};


		ElementListeners.prototype.sampleMouseState = function(mouseStore) {
			this.mouseActionListener.sampleMouseAction(mouseStore);
			this.touchActionListener.sampleTouchAction(mouseStore);

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