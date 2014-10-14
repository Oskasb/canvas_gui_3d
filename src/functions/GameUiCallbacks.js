"use strict";

define([
	'application/PerfMon',
	'application/EventManager',
	'goo/entities/SystemBus',
	'data_pipeline/data/ConfigCache',
	'data_pipeline/DataPipelineMessageHandler'
],
	function(
		PerfMon,
		event,
		SystemBus,
		ConfigCache,
		DataPipelineMessageHandler
		) {

		var GameUiCallbacks = function() {};

		var playerPiece;

		GameUiCallbacks.fetchFrameTpf = function() {
			var tpfStack = PerfMon.getTpfStack();
			return Math.ceil(tpfStack[tpfStack.length-1]);
		};

		GameUiCallbacks.fetchTpfStack = function() {
			return PerfMon.getTpfStack();
		};

		GameUiCallbacks.fetchAerodynamicCurves = function() {
			return ConfigCache.getConfigKey('game_data', 'aerodynamic_curves').wings;
		};

		GameUiCallbacks.fetchAppliedState = function(control) {
			return playerPiece.pieceInput.getAppliedState(control);
		};

		GameUiCallbacks.fetchControlState = function(control) {
			return playerPiece.pieceInput.getInputState(control);
		};

		GameUiCallbacks.fetchFrameStats = function() {
			var stats = PerfMon.getStatsCollection();
			return [
				'Tpf: '+Math.round(stats.tpf)*0.001+'s',
				'Shaders: '+stats.cachedShaders,
			//	'RenderCalls: '+stats.drawCalls,
			//	'Vertices: '+stats.verts,
			//	'Indices: '+stats.indices,
				'Ents (all): '+stats.allentities,
				'Ents (world): '+stats.entities,
				'Ents (animated): '+stats.animations,
				'TrxUpdates: '+stats.transforms,
				'Lights: '+stats.lights,
				'Comps: '+stats.composers+' Passes: '+stats.passes,
				'Gui Calls: '+stats.guiCalls
			];
		};


		var channels = {};

		GameUiCallbacks.setChannelMessage = function(channel, message) {
			channels[channel] = message;
		};

		GameUiCallbacks.getChannelMessage = function(channel) {
			return channels[channel] || 'Channel: '+channel+' is silent';
		};

		var messageElements = {};



		GameUiCallbacks.registerMessageTarget = function(element, channel, state) {

			if (!messageElements[channel]) {
				messageElements[channel] = {}
			}
			messageElements[channel][element.shape+'_'+channel+'_'+state] = element;
		};

		GameUiCallbacks.processCallbacks = function(tpf) {
			for (var channel in messageElements) {
				for (var elemKey in messageElements[channel]) {
					var element = messageElements[channel][elemKey];
					if (element.stateTieout > 0) {
						element.stateTieout -= tpf;
						element.notifyStateChange(element.messageChannels[channel]);
						if (element.stateTieout < 0 ) {
							element.notifyStateChange(element.states.passive);
						}
					}
				}
			}
		};

		GameUiCallbacks.handleGuiMessage = function(args) {
			GameUiCallbacks.setChannelMessage(args.channel, args.message);
			if (messageElements[args.channel]) {
				for (var key in messageElements[args.channel]) {
					var element = messageElements[args.channel][key];
					element.notifyStateChange(element.messageChannels[args.channel]);
					element.stateTieout = element.messageData.duration*1000;
				}
			}
		};

		SystemBus.addListener("message_to_gui", GameUiCallbacks.handleGuiMessage);


		var channels = ["system_channel", "hint_channel"];

		var messages = [
			[
				"sys_test_1",
				"sys_test_2",
				"sys_test_3"
			],
		//	[
		//		"alert_test_1",
		//		"alert_test_2",
		//		"alert_test_3"
		//	],
			[
				"hint_test_1",
				"hint_test_2",
				"hint_test_3"
			]
		];

	//	setInterval(function() {
	//		var chan = Math.floor(Math.random()*channels.length);
	//		var msg = Math.floor(Math.random()*messages[chan].length);
	//		SystemBus.emit("message_to_gui", {channel:channels[chan], message:ConfigCache.getConfigKey('text_keys', messages[chan][msg])})
	//	}, 1400 + 1500*Math.random());


		GameUiCallbacks.fetchCallById = function(id) {

			switch (id) {
				case "player_control_event":
					return function(params) {
						event.fireEvent(event.list().PLAYER_CONTROL_EVENT, {control:params.control, value:params.value});
						if (params.enabler) {
							SystemBus.emit("guiToggleEnabler", {value:params.value, enabler:params.enabler})
						}
					};
					break;
				case "gui_toggle_template":
					return function(params) {
						SystemBus.emit("guiToggleTemplate", {template:params.template, enabler:params.enabler})
					};
					break;
				default:


			}

		};

		GameUiCallbacks.getPlayerPieceControlId = function(id) {
			return playerPiece.pieceInput.controls[id];
		};

		GameUiCallbacks.handleSetPlayerPiece = function(e) {
			playerPiece = event.eventArgs(e).entity;
		};

		event.registerListener(event.list().SET_PLAYER_CONTROLLED_ENTITY, GameUiCallbacks.handleSetPlayerPiece);

		return GameUiCallbacks
	});
