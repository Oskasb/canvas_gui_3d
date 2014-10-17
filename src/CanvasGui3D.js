"use strict";

define([
	'goo/renderer/Texture',
	'goo/renderer/Material',
	'goo/entities/components/MeshRendererComponent',
	'goo/shapes/Quad',
	'goo/renderer/shaders/ShaderLib',
	'goo/renderer/pass/FullscreenUtil',
	'data_pipeline/PipelineAPI'

],
	function(
		Texture,
		Material,
		MeshRendererComponent,
		Quad,
		ShaderLib,
		FullscreenUtil,
		PipelineAPI
		) {

	    var CanvasGui3D = function(camera, resolution) {
			console.log("Canvas Gui camera: ", camera);
			this.camera = camera;
			this.resolution = resolution;
		    this.size = 1;
			this.aspect = 1;
		    this.scalePercentToX = 1;
		    this.scalePxToX = 1;
		    this.scalePercentToY = 1;

			this.materialSettings = {
				blending : 'CustomBlending',
				blendEquation: 'AddEquation',
				blendSrc : 'SrcColorFactor',
				blendDst : 'SrcAlphaFactor'
			};

			this.setupParts(camera);
			this.constructCanvas();

			this.onUpdateCallbacks = [];

			var configUpdated = function(url, config) {
				this.handleConfigUpdate(url, config);
			}.bind(this);

		   PipelineAPI.subscribeToCategoryKey('setup', 'page', configUpdated);


		};

		CanvasGui3D.prototype.setupParts = function(camera) {
			this.uiQuad = this.createQuadEntity(camera.entity);
			this.material = this.createCanvasMaterial(ShaderLib.textured);
		};

		CanvasGui3D.prototype.constructCanvas = function() {
			this.top = 0;
			this.left = 0;
			this.aspectMarginTop = 0;
			this.aspectMarginLeft = 0;
			this.ctx = this.setupCanvas(this.camera, this.resolution);
		};

		CanvasGui3D.prototype.createCanvasMaterial = function(shader) {
			var material = new Material('canvas_gui_mat', shader);
			material.cullState.enabled = false;
			material.cullState.frontFace = 'CW';
			material.cullState.cullFace = 'Front';
			material.depthState.write = false;
			material.renderQueue = 4000;
			material.blendState.blending = this.materialSettings.blending;
			material.blendState.blendEquation = this.materialSettings.blendEquation;
			material.blendState.blendSrc = this.materialSettings.blendSrc;
			material.blendState.blendDst = this.materialSettings.blendDst;
			material.shader.uniforms.color = [1, 1, 1]
			return material;
		};

		CanvasGui3D.prototype.createQuadEntity = function(parent) {
			var meshData = FullscreenUtil.quad;
			var entity = parent._world.createEntity('canvas_gui_quad', meshData);
			entity.addToWorld();
			return entity;
		};

		CanvasGui3D.prototype.attachQuad = function(quad, parent, material) {
			quad.set(new MeshRendererComponent(material));
			quad.meshRendererComponent.cullMode = 'Never';
			quad.meshRendererComponent.isReflectable = false;
			parent.transformComponent.attachChild(quad.transformComponent, false);
			return quad;
		};

		CanvasGui3D.prototype.setupMesh = function() {
			this.texture = new Texture(this.canvas, null, this.canvas.width, this.canvas.height);
			this.material.setTexture('DIFFUSE_MAP', this.texture);

		};

		CanvasGui3D.prototype.resolutionUpdated = function() {
			this.canvas.width = this.resolution;
			this.canvas.height = this.resolution;
			this.setupMesh();
			this.top = 0;
			this.updateFrustum();

		};

		CanvasGui3D.prototype.setupCanvas = function(camera, resolution) {
			this.canvas = document.createElement("canvas");
			this.canvas.id = 'canvas_gui_id';
			this.canvas.width = resolution;
			this.canvas.height = resolution;
			this.canvas.dataReady = true;
			this.ctx = this.canvas.getContext('2d');
			this.setupMesh()
			this.attachQuad(this.uiQuad, camera.entity, this.material);
			this.ctx.globalCompositeOperation = 'source-over';
			return this.ctx;
		};

		CanvasGui3D.prototype.updateFrustum = function() {
			if (this.top === this.camera._frustumTop && this.left === Math.abs(this.camera._frustumLeft)) {
				return;
			}

			this.top = this.camera._frustumTop;
			this.left = Math.abs(this.camera._frustumLeft);

			if (this.top < this.left) {
				this.aspectMarginTop = 2 * (this.left - this.top);
				this.aspectMarginLeft = 0;
				this.size = this.left;
				this.uiQuad.transformComponent.transform.translation.set(0, -this.aspectMarginTop*0.5*1.01, -this.camera.near*1.01);
				this.scalePxToX =  this.top / this.size;
			} else {
				this.aspectMarginLeft = 2 * (this.top - this.left);
				this.aspectMarginTop = 0;
				this.size = this.top;
				this.uiQuad.transformComponent.transform.translation.set(this.aspectMarginLeft*0.5*1.01, 0, -this.camera.near*1.01);
				this.scalePxToX = this.left / this.size;
			}

			this.aspect = this.left / this.top;

			this.scalePercentToX = 0.01*this.canvas.width / (this.size / this.left);
			this.scalePercentToY = 0.01*this.canvas.height / (this.size / this.top);

		//	this.canvasCalls.frustumUpdated(this.resolution, this.scalePercentToX, this.scalePercentToY, this.scalePxToX);
			//	this.canvas.width = this.resolution;
			//	this.canvas.height = Math.floor(Math.abs(this.resolution/this.aspect));

			this.uiQuad.transformComponent.transform.rotation.fromAngles(0, 0, 0);
			this.uiQuad.transformComponent.transform.scale.set(this.size*1.01, this.size*1.01, -1);
			this.uiQuad.transformComponent.setUpdated();
			this.onFrustumUpdate();
		};


		CanvasGui3D.prototype.handleConfigUpdate = function(url, config) {

			var select = config.blending.default;

			var opts = config.blending.modes[select];

			if (!this.material) {
				this.materialSettings = {
					blending : opts['blending'],
					blendEquation: opts['blendEquation'],
					blendSrc : opts['blendSrc'],
					blendDst : opts['blendDst']
				};
			} else {
				for (var index in opts) {
					this.material.blendState[index] = opts[index];
				}
			}

			if (config.resolution != this.resolution) {
				this.resolution = config.resolution;
				if (this.ctx) this.resolutionUpdated();
			}
		};

		CanvasGui3D.prototype.updateCanvasGui = function() {
			this.updateFrustum();
			this.texture.setNeedsUpdate();

		};

		CanvasGui3D.prototype.onFrustumUpdate = function() {
			for (var i = 0; i < this.onUpdateCallbacks.length; i++) {
				this.onUpdateCallbacks[i]();
			}
		};

		return CanvasGui3D

	});