"use strict";

define([
	'goo/entities/SystemBus',
	'gui/CanvasGuiWidget',
	'data_pipeline/data/ConfigCache',
	'data_pipeline/PipelineAPI',
	'data_pipeline/GameDataPipeline'

],
	function(
		SystemBus,

		CanvasGuiWidget,
		ConfigCache,
		PipelineAPI,
		GameDataPipeline
		) {




		var CanvasGuiState = function(canvasCalls, cursor) {
			this.uiParent = canvasCalls.uiParent;
			this.pointerCursor = cursor;
			this.pointerX = 50;
			this.pointerY = 50;
			this.canvasCalls = canvasCalls;
			this.registerListeners();
			this.builtTemplates = {};
			this.activeTemplates = {};
			this.idLayers = {};
		};

		/*
		CanvasGuiState.prototype.enableDebugGui = function() {
			var configUpdated = function(confs) {
				this.attachMainConfig(confs);
			}.bind(this);

			ConfigCache.subscribeToCategoryKey('main_gui_states', "debug_state", configUpdated);
		};
        */


		CanvasGuiState.prototype.attachGuiTemplate = function(templateId, templateActive) {
			var updateTmpData = function(srcKey, data) {
				if (this.activeTemplates[templateId]) {
					console.log("Template updated:", templateId, data)
					this.builtTemplates[templateId] = new CanvasGuiWidget(templateId, this.uiParent, this.pointerCursor, this.canvasCalls, data);
					templateActive(templateId)
				}
			}.bind(this);
			console.log("Request template: ", templateId)
			PipelineAPI.subscribeToCategoryKey('template', templateId, updateTmpData);
		};


		CanvasGuiState.prototype.attachMainConfig = function(config) {

			var templateActive = function(id) {
				this.activeTemplates[id] = this.builtTemplates[id];
			}.bind(this);

			for (var i = 0; i < config.templates.length; i++) {
				this.activeTemplates[config.templates[i]] = {};
				this.attachGuiTemplate(config.templates[i], templateActive);
			}

			var delayedReset = function() {
				this.rebuildGuiLayers();
			}.bind(this);

			var timeout;
			var masterReset = function() {
				clearTimeout(timeout);
				timeout = setTimeout(function() {
					delayedReset();
				}, 200)
			};

			ConfigCache.setMasterRestFunction(masterReset)
		};

		CanvasGuiState.prototype.clearCurrentGui = function() {
			this.activeTemplates = {};
		};




		CanvasGuiState.prototype.loadMainState = function(state) {
			this.clearCurrentGui();
			this.attachMainStateId(state);
		};

		CanvasGuiState.prototype.attachMainStateId = function(state) {
			var mainConfigUpdated = function(srcKey, confs) {
				console.log("Main conf updated:", srcKey, confs);
				this.attachMainConfig(confs);
			}.bind(this);

			PipelineAPI.subscribeToCategoryKey('main_gui_states', state, mainConfigUpdated);

			var masterReset = function() {
				ConfigCache.fireCategoryCallbacks('shapes')
			};

			PipelineAPI.subscribeToCategoryUpdate('layout_key_maps', masterReset);
			PipelineAPI.subscribeToCategoryUpdate('layout_constants', masterReset);

		};

		CanvasGuiState.prototype.rebuildGuiLayers = function() {
			var templateActive = function(id) {
				this.activeTemplates[id] = this.builtTemplates[id];
			}.bind(this);
			console.log("Rebuilding Gui Templates");
			for (var index in this.activeTemplates) {
				console.log("template:", index);
				this.attachGuiTemplate(index, templateActive)
			//	this.activeTemplates[index].buildCanvasWidget(ConfigCache.getConfigKey('template',index));
			}
		};


		CanvasGuiState.prototype.registerListeners = function() {




			var handleRegisterElementId = function(args) {
				this.idLayers[args.id] = args.layer;
			}.bind(this);

			SystemBus.addListener("registerGuiElementId", handleRegisterElementId);

			var handleGuiToggleEnabler = function(args) {

				if (args.value == 1 && this.idLayers[args.enabler].state != 'on_applied') {
					this.idLayers[args.enabler].setRenderState('on_applied');
				} else {
					this.idLayers[args.enabler].setRenderState('passive');
				}

			}.bind(this);
			SystemBus.addListener('guiToggleEnabler',  handleGuiToggleEnabler);


			var handleGuiToggleModal = function(args) {
				if (args.enabler) {
					var ownerElement = this.idLayers[args.enabler];
				}
				this.activeTemplates[args.template].toggleTemplate(ownerElement);

			}.bind(this);
			SystemBus.addListener('guiToggleTemplate',  handleGuiToggleModal);

			var handleGuiFlash = function(args) {
				this.flashGui(args)
			}.bind(this);
			SystemBus.addListener('guiFlash',  handleGuiFlash);

			var handlePointerState = function(args) {
				this.updatePointerState(args.pointer)
			}.bind(this);
			SystemBus.addListener('pointerGuiState',  handlePointerState);
		};

		CanvasGuiState.prototype.updatePointerState = function(pointer) {

			var draw = {
				line:{
					fromX:this.pointerX,
					fromY:this.pointerY,
					toX:pointer.x,
					toY:pointer.y,
					w:12,
					color:[0.6, 0.2, 0.9, 0.8]
				}
			};
			this.pointerX = pointer.x;
			this.pointerY = pointer.y;

			if (!pointer.hidden) this.canvasCalls.drawToCanvasGui({renderData:draw, zIndex:1000});
		};


		CanvasGuiState.prototype.flashGui = function(args) {
			this.canvasCalls.drawToCanvasGui(args);
		};

		CanvasGuiState.prototype.updateGuySystems = function(tpf, inputState) {
			for (var key in this.activeTemplates) {
				this.activeTemplates[key].updateGuiSystem(tpf, inputState.mouseState);
			}
		};

		CanvasGuiState.prototype.drawLayers = function(tpf) {
			this.canvasCalls.updateCanvasCalls(tpf);
			GameDataPipeline.tickDataLoader(tpf);
		};

		return CanvasGuiState

	});