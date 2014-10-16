"use strict";

define([

],
	function(
		) {

		var gameScreen;
		var width;
		var height;

		var registerAppContainer = function(element) {
			gameScreen = element;
			gameScreen.style.pointerEvents = 'auto';
			width = gameScreen.offsetWidth;
			height = gameScreen.offsetHeight;

			window.addEventListener('resize', function(){
				handleResize()
			});
		};

		var handleResize = function() {
			width = gameScreen.offsetWidth;
			height = gameScreen.offsetHeight;
		};

		var getElement = function() {
			return gameScreen;
		};

		var getWidth = function() {
			return width;
		};

		var getHeight = function() {
			return height;
		};

		return {
			registerAppContainer:registerAppContainer,
			getElement:getElement,
			getWidth:getWidth,
			getHeight:getHeight
		}

	});