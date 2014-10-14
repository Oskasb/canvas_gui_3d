"use strict";

define([],
	function(

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

		DrawFunctionShapes.drawGraphArray = function(graphArray, ctx, element, topValue) {
			var pos = element.pos.final;
			var size = element.size;

			ctx.strokeStyle = toRgba(element.callbackData.color);
			ctx.lineWidth = element.callbackData.line_width;


			ctx.beginPath();
			ctx.strokeStyle = toRgba([0.2, 0.5, 0.6, 1]);

			DrawFunctionShapes.startGraph(ctx, pos.left + (size.width*0.5), pos.top);
			DrawFunctionShapes.addPointToGraph(ctx, pos.left + (size.width*0.5), pos.top+size.height);

			ctx.stroke();


			var graphCount = 0;

			for (var index in graphArray) {
				graphCount += 1;

				var graphName = index;
				var valuesXY = graphArray[index];
				var min = valuesXY[0][0];
				var max = valuesXY[valuesXY.length -1][0];

				var startL = pos.left + (size.width / valuesXY.length) * ((valuesXY[0][0]-min)) // (max-min))));

				var startT = pos.top + (valuesXY[0][1] * 25)+(size.height/5)*graphCount;

				ctx.beginPath();
				ctx.strokeStyle = toRgba([0.2, 0.5, 0.6, 1]);
				DrawFunctionShapes.startGraph(ctx, pos.left , startT);
				DrawFunctionShapes.addPointToGraph(ctx, pos.left + (size.width), startT);
				ctx.stroke();


				var color = toRgba([0.7+(Math.sin(1*graphCount))*0.3, 0.7+(Math.cos(2*graphCount))*0.3, 0.7+(Math.sin(2*graphCount)*0.3), 1]);

				ctx.font = "20px Russo One"
				ctx.textAlign = "right"
				ctx.fillStyle = color
				ctx.fillText(
					graphName,
					pos.left - 5,
					startT
				);

				ctx.strokeStyle = color
				ctx.beginPath();

				DrawFunctionShapes.startGraph(ctx, startL, startT);

				for (var i = 0; i < valuesXY.length; i++) {

					var left = pos.left + (size.width / (max-min)) * ((valuesXY[i][0])-min);
					var top  = pos.top + (valuesXY[i][1] * size.height/7)+(size.height/5)*graphCount;

					DrawFunctionShapes.addPointToGraph(ctx, left, top);

				}
				ctx.stroke();
			}




		};

		DrawFunctionShapes.startGraph = function(ctx, left, top) {
			ctx.moveTo(left, top)
		};

		DrawFunctionShapes.addPointToGraph = function(ctx, left, top) {
			ctx.lineTo(left, top)
		};

		DrawFunctionShapes.renderGraph = function(valueArray, pos, size, offset, topValue,  ctx, element) {
			var count = valueArray.length;
			if (count == 0) count = 1;
			var pxPerPoint = size.width/count;

			var drawGraph = function() {
				DrawFunctionShapes.startGraph(ctx, pos.left, pos.top+size.height-(size.height*topValue/valueArray[0]));
				for (var i = 0; i < count; i++) {
					DrawFunctionShapes.addPointToGraph(ctx, pos.left+i*pxPerPoint, pos.top+size.height-(size.height*topValue/valueArray[i]));
				}
			};

			ctx.strokeStyle = toRgba(element.callbackData.color);
			ctx.lineWidth = element.callbackData.line_width;
			ctx.beginPath();
			drawGraph();
			ctx.stroke();
		};

		DrawFunctionShapes.drawGraph = function(valueArray, ctx, element, topValue) {
			var pos = element.pos.final;
			var size = element.size;
			var offset = 0;
			DrawFunctionShapes.renderGraph(valueArray, pos, size, offset, topValue,  ctx, element)


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