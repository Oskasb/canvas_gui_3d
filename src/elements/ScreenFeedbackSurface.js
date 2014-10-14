"use strict";

define([
	'goo/entities/SystemBus',
	'application/EventManager',
	'io/GameScreen'
],
	function(
		SystemBus,
		event,
		GameScreen
		) {


		var topBar = {
				box:{xMin:0, yMin:0, xMax:18, yMax:4},
				tpf:{xMin:0.5, yMin:0.5, xMax:6, yMax:3.5},
				values:{xMin:0, yMin:8, xMax:12, yMax:25}
			};

		var textColor = [1, 0.6, 0.5, 1];
		var canvasCalls;
		var tpfStack = [0];

		var ScreenFeedbackSurface = function(cCalls) {
			canvasCalls = cCalls;
			this.id = "top_bar";
			this.name = 'TopBar';
			this.state = 0;
			this.states = [
				topBar.box,
				topBar.tpf
			];
			this.stackIndex = 0;
			this.tfpGraphSize = 200;
		};

		ScreenFeedbackSurface.prototype.renderFeedbackSurface = function(color, text) {
			var draw = {
				rect:{x:this.states[this.state].xMin, y:this.states[this.state].yMin, w:this.states[this.state].xMax-this.states[this.state].xMin, h:this.states[this.state].yMax-this.states[this.state].yMin, color:[color[0]*color[0],color[1]*0.4, color[2]*0.8,  color[3]]},
				box: {x:this.states[this.state].xMin, y:this.states[this.state].yMin, w:this.states[this.state].xMax-this.states[this.state].xMin, h:this.states[this.state].yMax-this.states[this.state].yMin, color:color, lineW:2}
			};
			if (text) draw.text = {label:text, font:16, x:this.states[this.state].xMin+0.3, y:this.states[this.state].yMin+1, color:[Math.sqrt(color[0])*0.5 + 0.5, Math.sqrt(color[1])*0.5 + 0.5, Math.sqrt(color[2])*0.5 + 0.5, Math.sqrt(color[3])]};
			SystemBus.emit('guiFlash', draw);
		};

		ScreenFeedbackSurface.prototype.renderFeedbackText = function(x, y, color, text) {

			SystemBus.emit('guiFlash', {text:{label:text, font:22, x:x, y:y, color:color}});
		};


		ScreenFeedbackSurface.prototype.renderTpfLine = function(lineNr, tpf, color) {
			SystemBus.emit('guiFlash', {
				line:{
					fromX:1+topBar.tpf.xMax+(lineNr*0.4),
					fromY:topBar.tpf.yMax,
					toX:1+topBar.tpf.xMax+(lineNr*0.4),
					toY:topBar.tpf.yMax-((topBar.tpf.yMax-topBar.tpf.yMin)*16/tpf),
					w:2,
					color:color
				}
			});
		};


		ScreenFeedbackSurface.prototype.drawTpfGraph = function() {

			var drawGraph = function(ctx, canvasCalls) {
				     ctx.moveTo(
					canvasCalls.percentToX(0.1+topBar.tpf.xMax),
					canvasCalls.percentToY(topBar.tpf.yMax-((topBar.tpf.yMax-topBar.tpf.yMin)*16/tpfStack[0]))
				);
				for (var i = 0; i < tpfStack.length; i++) {
					ctx.lineTo(
						canvasCalls.percentToX(0.1+topBar.tpf.xMax+(i*12/this.tfpGraphSize)),
						canvasCalls.percentToY(topBar.tpf.yMax-((topBar.tpf.yMax-topBar.tpf.yMin)*16/tpfStack[i]))
					);
					if (i == this.tfpGraphSize) tpfStack.shift();
				}
			}.bind(this);

			var graphCallback = function(ctx, canvasCalls) {
				ctx.strokeStyle = canvasCalls.toRgba([0.8, 0, 0.4, 1]);
				ctx.lineWidth = canvasCalls.pxToX(1.5);
				ctx.beginPath();
				drawGraph(ctx, canvasCalls);
				ctx.stroke();
			};

			SystemBus.emit('guiFlash', {
				callback:{callback:graphCallback}
			});

			this.stackIndex-=1;

		};

		ScreenFeedbackSurface.prototype.updateGuiSystem = function(tpf) {
			tpfStack.push(tpf);
			this.state = 0;
			this.renderFeedbackSurface([0.1, 0.3, 0.4, 1]);
			this.state = 1;
			this.renderFeedbackSurface([0.2, 0.3, 0, 1], 'ms:'+Math.ceil(tpf));
			this.drawTpfGraph();
			this.drawPlayerValues();
		};

		ScreenFeedbackSurface.prototype.drawPlayerValues = function() {

			for (var i = 0; i < playerValues.length; i++) {

				var amount = Math.round(playerValues[i].amount*100) / 100;
				if (Math.abs(amount) > 10) amount = Math.round(amount);
				this.renderFeedbackText(8, 25+i*3, textColor, labelMap[playerValues[i].value].label+': '+amount+' '+labelMap[playerValues[i].value].unit)
			}
			playerValues = [];
		};

		var playerValues = [];

		var labelMap = {
			speed:		{label:'IAS', unit:'km/h'},
			throttle:	{label:'THR', unit:'kN'},
			altitude:	{label:'ALT', unit:'m'},
			airflowx:   {label:'AFX', unit:'deg'},
			airflowy:   {label:'AFY', unit:'deg'},
			airflowz:   {label:'AFZ', unit:'deg'},
			gForce:     {label:'G', unit:''}
		};

		var handlePlayerValue = function(e) {
			playerValues.push({value:event.eventArgs(e).value, amount:event.eventArgs(e).amount});
	  /*
			if (event.eventArgs(e).value == 'gForce' && event.eventArgs(e).amount > 2) {
				if (event.eventArgs(e).amount > 8) {
					canvasCalls.setAttenuateColor([0.1, 0.2, 0.7, 1]);
				} else {
					canvasCalls.setAttenuateColor([Math.min(1, (event.eventArgs(e).amount-3))*0.5, 0, 0, Math.min(1,(event.eventArgs(e).amount-3)*0.3)]);
				}

			} else {
				canvasCalls.setAttenuateColor([0, 0, 0, 0.15]);

			}
	  */
		};

		event.registerListener(event.list().PLAYER_VALUE_UPDATE, handlePlayerValue);


		return ScreenFeedbackSurface;
	});