"use strict";

define([
	'goo/entities/SystemBus',
	'io/GameScreen',
	"game/GameUtil"

],
	function(
		SystemBus,
		GameScreen,
		GameUtil
		) {

		var PointerCursor = function(parentDiv) {
			this.parentDiv = parentDiv;
			this.vectorColor = [0.3, 0.9, 0.8, 1];
			this.x = 0;
			this.y = 0;
		};

		PointerCursor.prototype.pxXtoPercentX = function(x) {
			var width = GameScreen.getWidth();
			return 100*x/width
		};

		PointerCursor.prototype.pxYtoPercentY = function(y) {
			var height = GameScreen.getHeight();
			return 100*y/height;
		};

		PointerCursor.prototype.moveTo = function(x, y, hoverCount) {
			this.x = x;
			this.y = y;
			SystemBus.emit('pointerGuiState', {pointer:{x:x, y:y, hidden:hoverCount}});
		};

		PointerCursor.prototype.transformConnector = function(x1, y1, x2, y2, distance) {
			var width = GameScreen.getWidth();
			var height = GameScreen.getHeight();
			SystemBus.emit('guiFlash', {
				renderData:{
				line:{
					fromX:x1*100/width,
					fromY:y1*100/height,
					toX:x2*100/width,
					toY:y2*100/height,
					w: 2*1+(distance+0.4),
					color:this.vectorColor
				},
				zIndex:1000}
			});
		};

		PointerCursor.prototype.showDragToPoint = function(x, y, distance, angle) {
			var width = GameScreen.getWidth();
			var height = GameScreen.getHeight();
			SystemBus.emit('guiFlash', {
				renderData:{
				arc:{
					x:100*x/width,
					y:100*y/height,
					radius:8+12*(distance),
					start:-Math.PI*0.5+angle+(Math.PI*distance),
					end:-Math.PI*0.5+angle-(Math.PI*distance),
					w: 2*1+(distance+0.4),
					color:this.vectorColor
				},
					zIndex:1000}

			});
		};

		PointerCursor.prototype.showStartDragPoint = function(x, y, distance, angle) {

			var width = GameScreen.getWidth();
			var height = GameScreen.getHeight();

			SystemBus.emit('guiFlash', {
				renderData:{
				arc:{
					x:100*x/width,
					y:100*y/height,
					radius:4/(distance+0.1),
					start:-Math.PI*0.5+angle+(Math.PI*distance),
					end:-Math.PI*0.5+angle-(Math.PI*distance),
					w: 2+(distance+0.4),
					color:this.vectorColor
				},
				line:{
					x:100*x/width,
					y:100*y/height,
					toX:100*x/width+20*distance,
					toY:100*y/height,
					w: 2+(distance+0.4),
					color:this.vectorColor
				},
				zIndex:1000}
			});
			SystemBus.emit('guiFlash', {
				renderData:{
				line:{
					x:100*x/width,
					y:100*y/height,
					toX:100*x/width,
					toY:100*y/height+20*distance,
					w: 2+(distance+0.4),
					color:this.vectorColor
				},
					zIndex:1000}
			});
		};

		PointerCursor.prototype.showPressPoint = function(state, x, y) {
			var width = GameScreen.getWidth();
			var height = GameScreen.getHeight();

			SystemBus.emit('guiFlash', {
				renderData:{
				arc:{
					x:100*x/width,
					y:100*y/height,
					radius:5+4*state,
					start:2*Math.PI,
					end:0,
					w: 5+2*state,
					color:this.vectorColor
				},
					zIndex:1000}
			});
		};

		PointerCursor.prototype.inputMouseAction = function(action, xy) {
		//	console.log("mouse:", action, xy);
			this.vectorColor[0]=0.5+action[0]*0.5;
			this.vectorColor[1]=0.5+action[1]*0.5;
			this.showPressPoint(action[0]+action[1], xy[0], xy[1]);

		};


		PointerCursor.prototype.inputVector = function(fromX, fromY, toX, toY) {
			var distance = 0.008*this.pxXtoPercentX(GameUtil.lineDistance(fromX, fromY, toX, toY));
			this.vectorColor[0]=0.5+distance*0.5;
			this.vectorColor[1]=1-distance*0.5;
			this.vectorColor[2]=1-distance*0.5;
			this.showStartDragPoint(fromX, fromY, distance, Math.atan2( toX - fromX, fromY - toY));
			this.transformConnector(fromX, fromY, toX, toY, distance);
			this.showDragToPoint(toX, toY, distance , Math.atan2(fromX - toX, toY - fromY) );
		};



		return PointerCursor;
	});