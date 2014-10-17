"use strict";

define([
	'gui/functions/CustomGraphCallbacks',
	'gui/functions/CustomRadarOverview'
	],
	function(
		CustomGraphCallbacks,
		CustomRadarOverview
		) {

		var DrawFunctionShapes = function() {

		};

		var toRgba = function(color) {
			var r = ""+Math.floor(color[0]*255);
			var g = ""+Math.floor(color[1]*255);
			var b = ""+Math.floor(color[2]*255);
			var a = ""+color[3];
			return 'rgba('+r+', '+g+', '+b+', '+a+')';
		};

		DrawFunctionShapes.drawGraphArray = function(graphArray, ctx, element, topValue, playerEntity) {
			CustomGraphCallbacks.drawGraphArray(graphArray, ctx, element, topValue, playerEntity)
		};

		DrawFunctionShapes.drawGraph = function(valueArray, ctx, element, topValue) {
			CustomGraphCallbacks.drawGraph(valueArray, ctx, element, topValue)
		};

		DrawFunctionShapes.drawRadarContent = function(gamePieces, ctx, element, playerEntity) {
			CustomRadarOverview.drawRadarContent(gamePieces, ctx, element, playerEntity)
		};


		var tempRect = {
			left:0,
			top:0,
			width:0,
			height:0
		};

		DrawFunctionShapes.drawControlState = function(state, ctx, element, params) {
			var pos = element.pos.final;
			var size = element.size;

			tempRect.left 	= pos.left;
			tempRect.top 	= pos.top;
			tempRect.width 	= size.width;
			tempRect.height = -size.height;
			tempRect[params.target] *= state * params.factor;

			if (!params.color) {
				ctx.fillStyle = 'rgba(245, 220, 80, 0.6)';
			} else if (params.color.length) {
				if (params.color[0].length) {
					var colors = params.color;
					var grd=ctx.createLinearGradient(tempRect.top-tempRect.height, 0, tempRect.top-tempRect.height, tempRect.top);

					for (var i = 0; i < colors.length; i++) {
						var fact = i / (colors.length-1); // ((i+1)/colors.length);
						grd.addColorStop(1-fact, toRgba(colors[i]));
					}
					ctx.fillStyle = grd;
				} else {
					ctx.fillStyle = toRgba(params.color);
				}
			}



			ctx.fillRect(
				tempRect.left ,
				tempRect.top  ,
				tempRect.width,
				tempRect.height
			);

		};


		return DrawFunctionShapes
	});