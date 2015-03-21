"use strict";

define([
		'goo/math/MathUtils',
	'goo/renderer/Texture',
	'goo/renderer/Material',
	'goo/entities/components/MeshRendererComponent',
	'goo/shapes/Quad',
	'goo/renderer/shaders/ShaderLib',
	'goo/renderer/pass/FullscreenUtil',
	'data_pipeline/PipelineAPI'

],
	function(
		MathUtils,
		Texture,
		Material,
		MeshRendererComponent,
		Quad,
		ShaderLib,
		FullscreenUtil,
		PipelineAPI
		) {

	    var CanvasGui3D = function(cameraEntity, resolution) {
			console.log(cameraEntity)
			this.cameraEntity = cameraEntity;
			this.camera = cameraEntity.cameraComponent.camera;

			this.config = {
				resolution:resolution
			};

			this.blendModes = {};

			this.resolution = resolution;
		    this.size = 1;
			this.txScale = 1;
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

			this.setupParts();
			this.constructCanvas();

			this.onUpdateCallbacks = [];

			var configUpdated = function(url, config) {
				this.handleConfigUpdate(url, config);
			}.bind(this);

		   PipelineAPI.subscribeToCategoryKey('setup', 'page', configUpdated);


		};

		CanvasGui3D.prototype.setupParts = function() {
			this.uiQuad = this.createQuadEntity(this.cameraEntity);
			this.material = this.createCanvasMaterial(ShaderLib.uber);
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
			material.shader.uniforms.color = [1, 1, 1];
			material.uniforms.materialEmissive = [1, 1, 1, 1];
			material.uniforms.discardThreshold = 0.1;
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
			console.log("Setup gui TX: ", this.canvas.width, this.canvas.height)
			this.material.setTexture('DIFFUSE_MAP', this.texture);
			this.texture.setNeedsUpdate();
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
			this.setupMesh();
			this.attachQuad(this.uiQuad, this.cameraEntity, this.material);
			this.ctx.globalCompositeOperation = 'source-over';
			return this.ctx;
		};

		CanvasGui3D.prototype.updateFrustum = function() {


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

		CanvasGui3D.prototype.applyBlendModeSelection = function(floatValue, callback) {

			var selection = Math.floor(floatValue * this.config.blending.modes.length);
			this.setBlendModeId(this.config.blending.modes[selection].id);

			callback(this.config.blending.modes[selection].data);
		};

		CanvasGui3D.prototype.updateBlendMode = function() {
			var blendState = this.blendModes[this.blendModeId].blendState;
			var uniforms = this.blendModes[this.blendModeId].uniforms;

			if (!this.material) {
				this.materialSettings = {
					blending : blendState['blending'],
					blendEquation: blendState['blendEquation'],
					blendSrc : blendState['blendSrc'],
					blendDst : blendState['blendDst']
				};
			} else {
				for (var index in blendState) {
					this.material.blendState[index] = blendState[index];
				};
				for (var index in uniforms) {
					this.material.uniforms[index] = uniforms[index];
				}
			}
		};


		CanvasGui3D.prototype.setBlendModeId = function(blendModeId) {
			this.blendModeId = blendModeId;
			this.updateBlendMode();
		};

		CanvasGui3D.prototype.scaleCanvasGuiResolution = function(scale) {
			this.txScale = scale;
			var targetRes = MathUtils.nearestHigherPowerOfTwo(this.config.resolution * this.txScale);

			if (targetRes != this.resolution) {
				this.resolution = targetRes;
				this.resolutionUpdated();
			}
		};


		CanvasGui3D.prototype.handleConfigUpdate = function(url, config) {
			this.config = config;

			for (var i = 0; i < config.blending.modes.length; i++) {
				this.blendModes[config.blending.modes[i].id] = config.blending.modes[i].data;
			}

			this.updateBlendMode();
			this.scaleCanvasGuiResolution(this.txScale)
		};

		CanvasGui3D.prototype.updateCanvasGui = function() {
			if (this.top === this.camera._frustumTop && this.left === Math.abs(this.camera._frustumLeft)) {

			} else {
				this.updateFrustum();
			}
		};

	//	var cd = 59;
		CanvasGui3D.prototype.applyChanges = function() {
		//	       cd --
		//	if (cd > 0) return;
			//	var buffer = new Uint8Array(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data);
				//	console.log(this.texture)
			//		this.texture.addSubImageDataUpdate(0, 0, this.canvas.width, this.canvas.height, null, null, buffer)
			//				this.texture.addSubImageDataUpdate(0, 0,null, null, null, null, this.canvas)
					this.texture.setNeedsUpdate();
		};

		CanvasGui3D.prototype.onFrustumUpdate = function() {
			for (var i = 0; i < this.onUpdateCallbacks.length; i++) {
				this.onUpdateCallbacks[i]();
			}
		};

		return CanvasGui3D

	});