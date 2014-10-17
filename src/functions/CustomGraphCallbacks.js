"use strict";

define([],
	function(

		) {

		var CustomUiGraphs = function() {

		};

		var toRgba = function(color) {
			var r = ""+Math.floor(color[0]*255);
			var g = ""+Math.floor(color[1]*255);
			var b = ""+Math.floor(color[2]*255);
			var a = ""+color[3];
			return 'rgba('+r+', '+g+', '+b+', '+a+')';
		};

		CustomUiGraphs.drawGraphArray = function(graphArray, ctx, element, topValue, playerEntity) {
			var pos = element.pos.final;
			var size = element.size;

			ctx.strokeStyle = toRgba(element.callbackData.color);
			ctx.lineWidth = 1;

			var curveCount = 0;
			for (var index in graphArray) {
				curveCount += 1;
			}

			var wingsByCurveMap = {};
			if (playerEntity.wings) {
				for (var index in playerEntity.wings) {
					var curveId = playerEntity.wings[index].sourceData.liftCurveId;
					if (!wingsByCurveMap[curveId]) {
						wingsByCurveMap[curveId] = [];
					}
					wingsByCurveMap[curveId].push(playerEntity.wings[index]);
				}
			}



			ctx.beginPath();
			ctx.strokeStyle = toRgba([0.2, 0.5, 0.6, 1]);




			CustomUiGraphs.startGraph(ctx, pos.left + (size.width*0.5), pos.top);
			CustomUiGraphs.addPointToGraph(ctx, pos.left + (size.width*0.5), pos.top+size.height);

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
				ctx.strokeStyle = toRgba([0.2, 0.5, 0.6, 0.6]);
				CustomUiGraphs.startGraph(ctx, pos.left , startT);
				CustomUiGraphs.addPointToGraph(ctx, pos.left + (size.width), startT);
				ctx.stroke();

				var color = toRgba([0.7+(Math.sin(1*graphCount))*0.3, 0.7+(Math.cos(2*graphCount))*0.3, 0.7+(Math.sin(2*graphCount)*0.3), 0.4]);

				ctx.font = "16px Russo One"
				ctx.textAlign = "start"
				ctx.fillStyle = color
				ctx.fillText(
					graphName,
					pos.left + 5,
					startT-5
				);

				ctx.strokeStyle = color
				ctx.beginPath();
				ctx.lineWidth = 1;
				CustomUiGraphs.startGraph(ctx, startL, startT);


				for (var i = 0; i < valuesXY.length; i++) {

					var left = pos.left + (size.width / (max-min)) * ((valuesXY[i][0])-min);
					var top  = pos.top + (valuesXY[i][1] * size.height/7)+(size.height/5)*graphCount;

					CustomUiGraphs.addPointToGraph(ctx, left, top);

				}
				ctx.stroke();


				if (wingsByCurveMap[graphName]) {
					var wingCount = wingsByCurveMap[graphName].length

					for (var i = 0; i < wingCount; i++) {
						var wing = wingsByCurveMap[graphName][i];

						left = pos.left + (size.width * 0.5);

						left += (wing.angleOfAttack * (size.width/(2*Math.PI)));

						var fontSize = 10;

						var offsetH = -2*fontSize -wingCount - (i)*fontSize*0.7;

						ctx.font = fontSize+"px Russo One"
						ctx.textAlign = "center"
						ctx.fillStyle = toRgba([0.7+(Math.sin(1*graphCount))*0.3, 0.7+(Math.cos(2*graphCount))*0.3, 0.7+(Math.sin(2*graphCount)*0.3), 0.4]);

						ctx.fillText(
							wing.wingId,
							left,
							startT+offsetH+(fontSize*1)
						);




						ctx.lineWidth = 1;
						CustomUiGraphs.startGraph(ctx, left, startT+offsetH+(fontSize*1.2));
						CustomUiGraphs.addPointToGraph(ctx, left, startT);
						//	ctx.stroke();

						var yawMod = (wing.angleOfAttackYaw * (size.height*0.5));

						//	ctx.lineWidth = 3;
						CustomUiGraphs.startGraph(ctx, left, startT);
						CustomUiGraphs.addPointToGraph(ctx, left-40, startT+yawMod);
						//	ctx.stroke();

						var dragMod = -(wing.force.data[2] * 1);

						CustomUiGraphs.startGraph(ctx, left, startT);
						CustomUiGraphs.addPointToGraph(ctx, left+dragMod, startT+dragMod);
						//	ctx.stroke();


						var liftMod = -(wing.force.data[1] * 0.1);

						CustomUiGraphs.startGraph(ctx, left, startT);
						CustomUiGraphs.addPointToGraph(ctx, left-liftMod, startT+liftMod);
						ctx.stroke();

					}
				}
			}
		};

		CustomUiGraphs.startGraph = function(ctx, left, top) {
			ctx.moveTo(left, top)
		};

		CustomUiGraphs.addPointToGraph = function(ctx, left, top) {
			ctx.lineTo(left, top)
		};

		CustomUiGraphs.renderGraph = function(valueArray, pos, size, offset, topValue,  ctx, element) {
			var count = valueArray.length;
			if (count == 0) count = 1;
			var pxPerPoint = size.width/count;

			var drawGraph = function() {
				CustomUiGraphs.startGraph(ctx, pos.left, pos.top+size.height-(size.height*topValue/valueArray[0]));
				for (var i = 0; i < count; i++) {
					CustomUiGraphs.addPointToGraph(ctx, pos.left+i*pxPerPoint, pos.top+size.height-(size.height*topValue/valueArray[i]));
				}
			};

			ctx.strokeStyle = toRgba(element.callbackData.color);
			ctx.lineWidth = element.callbackData.line_width;
			ctx.beginPath();
			drawGraph();
			ctx.stroke();
		};

		CustomUiGraphs.drawGraph = function(valueArray, ctx, element, topValue) {
			var pos = element.pos.final;
			var size = element.size;
			var offset = 0;
			CustomUiGraphs.renderGraph(valueArray, pos, size, offset, topValue,  ctx, element)


		};

		var tempRect = {
			left:0,
			top:0,
			width:0,
			height:0
		};

		CustomUiGraphs.drawControlState = function(state, ctx, element, params) {
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


		return CustomUiGraphs
	});