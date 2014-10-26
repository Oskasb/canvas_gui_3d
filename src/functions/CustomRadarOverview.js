"use strict";

define([
	'gui/functions/CustomGraphCallbacks'
],
	function(
		CustomGraphCallbacks
		) {

		var toRgba = function(color) {
			var r = ""+Math.floor(color[0]*255);
			var g = ""+Math.floor(color[1]*255);
			var b = ""+Math.floor(color[2]*255);
			var a = ""+color[3];
			return 'rgba('+r+', '+g+', '+b+', '+a+')';
		};

		var CustomRadarOverview = function() {

		};

		var tempRect = {
			left:0,
			top:0,
			width:0,
			height:0
		};

		var path = [];
		var wait = false;
		var zLine = zLine;
		CustomRadarOverview.drawRadarContent = function(gamePieces, ctx, element, playerEntity) {

			var pos = element.pos.final;
			var size = element.size;

			ctx.strokeStyle = toRgba(element.callbackData.color);
			ctx.lineWidth = 1;

			var curveCount = 0;

			var centerX = playerEntity.spatial.pos.data[0];
			var centerZ = playerEntity.spatial.pos.data[2];



			if (!wait) {
				path.push(centerX,playerEntity.spatial.pos.data[1], centerZ);
				wait = true;
			}


			var pathPlotTO = setTimeout(function() {
				wait = false;
				zLine = true;
			}, 1500);

			var xMax = centerX+25000;
			var xMin = centerX-25000;
			var yMax = centerZ+25000;
			var yMin = centerZ-25000;

			for (var index in gamePieces) {
				curveCount += 1;
				if (gamePieces[index].spatial.pos.data[0] > xMin)  {
					xMin = gamePieces[index].spatial.pos.data[0];
				}

				if (gamePieces[index].spatial.pos.data[0] < xMax)  {
					xMax = gamePieces[index].spatial.pos.data[0];
				}

				if (gamePieces[index].spatial.pos.data[2] > xMin)  {
					xMin = gamePieces[index].spatial.pos.data[2];
				}

				if (gamePieces[index].spatial.pos.data[2] < xMax)  {
					xMax = gamePieces[index].spatial.pos.data[2];
				}
			}

			yMax = xMax;
			yMin = xMin;

			var rangeX = xMax - xMin;
			var rangeY = xMax - xMin;
			var playerX = pos.top + size.height*0.5;
			var playerY = pos.left + size.width*0.5;

			if (path.length > 6) {
				ctx.beginPath();
				ctx.strokeStyle = toRgba([0.1, 0.4, 0.6, 0.5]);
				var top = ( path[0]-centerX)*(size.height/(rangeX*2)) +  pos.top + size.height*0.5 ;
				var left = (  path[2]-centerZ)*(size.width/(rangeY*2)) + pos.left + size.width * 0.5;


				CustomGraphCallbacks.startGraph(ctx, left, top)




				for (var i = 0; i < path.length; i++) {

					top = ( path[i]-centerX)*(size.height/(rangeX*2)) +  pos.top + size.height*0.5 ;
					i++

					i++
					left = (  path[i]-centerZ)*(size.width/(rangeY*2)) + pos.left + size.width * 0.5;
					CustomGraphCallbacks.addPointToGraph(ctx, left, top-path[i-1]*0.02);

					if (i%62==1) {
						CustomGraphCallbacks.addPointToGraph(ctx, left, top);
						CustomGraphCallbacks.startGraph(ctx, left, top-path[i-1]*0.02);
					}

				}

				if (path.length > 6000) {
					path.shift()
					path.shift()
					path.shift()
				}
				ctx.stroke();
			}



			tempRect.left 	= playerY -4;
			tempRect.top 	= playerX -4 ;
			tempRect.width 	= 8;
			tempRect.height = 8;
			//	tempRect[params.target] *= state * params.factor;

			/*
			 ctx.fillStyle = 'rgba(245, 220, 180, 0.6)';

			 ctx.fillRect(
			 tempRect.left ,
			 tempRect.top  ,
			 tempRect.width,
			 tempRect.height
			 );

			 ctx.font = "16px Russo One"
			 ctx.textAlign = "center"
			 ctx.fillText(
			 playerEntity.id,
			 tempRect.left,
			 tempRect.top - 10
			 );

			 */
			var entCount = 0;
			for (index in gamePieces) {
				entCount += 1;

				var spat = gamePieces[index].spatial;

				top = ( spat.pos.data[0]-centerX)*(size.height/(rangeX*2)) +  pos.top + size.height*0.5 ;
				left = (  spat.pos.data[2]-centerZ)*(size.width/(rangeY*2)) + pos.left + size.width * 0.5;



				if (gamePieces[index].geometries[0]) {
					tempRect.left 	= left -2;
					tempRect.top 	= top -2 -spat.pos[1]*0.02;
					tempRect.width 	= 4;
					tempRect.height = 4;

					ctx.fillStyle = toRgba([0.6+Math.sin(entCount*0.25)*0.4, 0.6+Math.sin(entCount*0.15)*0.4, 0.6+Math.cos(entCount*0.25)*0.4, 1]);

			/*
					ctx.strokeStyle =  toRgba([0.6+Math.sin(entCount*0.25)*0.4, 0.6+Math.sin(entCount*0.15)*0.4, 0.6+Math.cos(entCount*0.25)*0.4, 1]);


					ctx.font = "10px Russo One"
					ctx.textAlign = "center"
					ctx.fillText(
						gamePieces[index].id,
						tempRect.left,
						tempRect.top - 6
					);
			*/
				} else {
					tempRect.left 	= left -1;
					tempRect.top 	= top -1 -spat.pos[1]*0.02;
					tempRect.width 	= 2;
					tempRect.height = 2;
					ctx.fillStyle = toRgba([0.9, 0.6, 0.4, 0.8]);
					ctx.strokeStyle = toRgba([0.9, 0.4, 0.3, 0.2]);
				}


				ctx.fillRect(
					tempRect.left ,
					tempRect.top  ,
					tempRect.width,
					tempRect.height
				);




				ctx.beginPath();
				CustomGraphCallbacks.startGraph(ctx, left, top);
				CustomGraphCallbacks.addPointToGraph(ctx, left, top-spat.pos[1]*0.02);
				ctx.stroke();

			}


		};


		return CustomRadarOverview

	});

