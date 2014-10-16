"use strict";

define([
	'gui/elements/CanvasGuiLayer',
	'gui/layout/GuiConstants',
	'data_pipeline/PipelineAPI'
],
	function(
		CanvasGuiLayer,
		GuiConstants,
		PipelineAPI
		) {

		var CanvasGuiWidget = function(id, parent, cursor, canvasCalls, data) {
			this.pointerCursor = cursor;
			this.id = id;
			this.parent = parent;
			this.canvasCalls = canvasCalls;
			this.data = data;
			this.layers = [];
			this.onApplyCallbacks = [];
			this.templateHidden = false;
			this.enablerFeedbackLayer = null;
			this.buildCanvasWidget(data);
		};

		CanvasGuiWidget.prototype.toggleTemplate = function(enablerFeedbackLayer) {
			if (enablerFeedbackLayer) this.enablerFeedbackLayer = enablerFeedbackLayer;

			this.templateHidden = !this.templateHidden;
			if (!this.templateHidden && enablerFeedbackLayer) {
				this.enablerFeedbackLayer.setRenderState('on_applied');
				for (var i = 0; i < this.layers.length; i++) {
					this.layers[i].setRenderState('passive');
				}
			} else {
				if (this.enablerFeedbackLayer) this.enablerFeedbackLayer.setRenderState('passive');
				this.enablerFeedbackLayer = null;

				for (var i = 0; i < this.layers.length; i++) {
					this.layers[i].setRenderState('hidden');
				}

			}


		};

		CanvasGuiWidget.prototype.addLayer = function(layer, parent, data) {

			if (! data) data = PipelineAPI.readCachedConfigKey('shapes', layer.shape);



			var newLayer = new CanvasGuiLayer(layer, parent, this.pointerCursor, this.canvasCalls, data);

			// injects new layers into the layers array to be added in next loop
			if (layer.feedback_gadgets) {
				this.processFeedbackGadgets(layer, newLayer)
			}
			if (layer.layers) {
				this.processLayers(layer.layers, newLayer)
			}
			this.layers.push(newLayer);

		};



		CanvasGuiWidget.prototype.processFeedbackGadgets = function(layer, parent) {

			var layerGadgets = layer.feedback_gadgets;
			for (var i = 0; i < layerGadgets.length; i++) {

				var config = PipelineAPI.readCachedConfigKey('gadgets', layerGadgets[i].gadget);

				var params = layerGadgets[i].params;

				for (var j = 0; j < config.length; j++) {

					for (var key in config[j]) {
						// clone it so reusing the same dosnt overwrite the dynamic parameters..
						var shape = JSON.parse(JSON.stringify(PipelineAPI.readCachedConfigKey('shapes', config[j][key])));

						GuiConstants.applyLayoutRules(shape);
						GuiConstants.applyConstantValues(shape);

						shape.passive.draw_callback.source = params[key];
						shape.passive.draw_callback.params.control = params.control;
						shape.passive.draw_callback.params.factor = params.factor;

						var shapeKey = "gadget_"+parent.id+params[key]+params.control;

						var newShape = {};
						newShape[shapeKey] = shape;

						PipelineAPI.getCachedConfigs()['shapes'][shapeKey] = shape;

						this.addLayer({shape:shapeKey}, parent, JSON.parse(JSON.stringify(shape)));
					}
				}
			}
		};

		CanvasGuiWidget.prototype.processLayers = function(layers, parent) {
			for (var i = 0; i < layers.length; i++) {
				this.addLayer(layers[i], parent);
			}
		};

		CanvasGuiWidget.prototype.buildCanvasWidget = function(data) {
			this.data = data;
			console.log("Building Widget: ", this.id);
			this.layers = [];



			var build = function() {
				if (this.data.layers) {
					this.processLayers(this.data.layers, this.parent.layer);
				}
			    if (this.data.hidden) {
					this.templateHidden = true;
				}
			}.bind(this);



		//	setTimeout(function() {
				build();
		//	}, 100)

		};


		CanvasGuiWidget.prototype.updateGuiSystem = function() {

			if (this.templateHidden) return;

			for (var i = 0; i < this.layers.length; i++) {
				this.layers[i].drawCanvasLayer();
			}
		};


		return CanvasGuiWidget;

});