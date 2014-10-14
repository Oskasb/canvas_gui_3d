"use strict";

define([
	'goo/entities/SystemBus',

	'gui/CanvasGuiWidget',
	'gui/CanvasGuiImages',
	'data_pipeline/data/ConfigCache',

	'data_pipeline/GameDataPipeline'

],
	function(
		SystemBus,

		CanvasGuiWidget,
		CanvasGuiImages,
		ConfigCache,
		GameDataPipeline
		) {




		var CanvasGuiState = function(canvasCalls, dataLoaderOptions) {
			this.uiParent = canvasCalls.uiParent;
			this.dataLoaderOptions = dataLoaderOptions;
			this.pointerX = 50;
			this.pointerY = 50;
			this.canvasCalls = canvasCalls;
			this.registerListeners();
			this.builtTemplates = {};
			this.activeTemplates = {};
			this.idLayers = {};
		};

		CanvasGuiState.prototype.enableDebugGui = function() {
			var pieceConfigUpdated = function(confs) {
				this.attachMainConfig(confs);
			}.bind(this);

			ConfigCache.subscribeToCategoryKey('main_gui_states', "debug_state", pieceConfigUpdated);
		};



		CanvasGuiState.prototype.attachGuiTemplate = function(templateId, templateActive) {
			var updateTmpData = function(data) {
				console.log("Template updated:", templateId, data)
				this.builtTemplates[templateId] = new CanvasGuiWidget(templateId, this.uiParent, this.canvasCalls, data);
				templateActive(templateId)
			}.bind(this);
			console.log("Request template: ", templateId)
			ConfigCache.subscribeToCategoryKey('template', templateId, updateTmpData);
		};


		CanvasGuiState.prototype.attachMainConfig = function(config) {

			var templateActive = function(id) {
				this.activeTemplates[id] = this.builtTemplates[id];
			}.bind(this);

			for (var i = 0; i < config.templates.length; i++) {
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

		CanvasGuiState.prototype.loadMainState = function(state) {

			var mainConfigUpdated = function(confs) {
				console.log("Main conf updated:", confs);
				this.attachMainConfig(confs);
			}.bind(this);

			ConfigCache.subscribeToCategoryKey('main_gui_states', state, mainConfigUpdated);

			var masterReset = function() {
				ConfigCache.fireCategoryCallbacks('shapes')
			};

			ConfigCache.registerCategoryUpdatedCallback('layout_key_maps', masterReset);
			ConfigCache.registerCategoryUpdatedCallback('layout_constants', masterReset);

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

		CanvasGuiState.prototype.update = function(tpf) {


			for (var key in this.activeTemplates) {
				this.activeTemplates[key].updateGuiSystem(tpf);
			}
			GameDataPipeline.tickDataLoader(tpf);
			this.canvasCalls.updateCanvasCalls(tpf);
		};

		return CanvasGuiState

	});