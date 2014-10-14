"use strict";

define([
		'io/pipeline/GameDataPipeline',
		'io/data/ConfigCache'
	],
	function(
		GameDataPipeline,
		ConfigCache
		) {

		var CanvasGuiImages = function() {
			this.urls = {};
			this.data = {};
			this.svg = {};
		};

		CanvasGuiImages.prototype.getImageData = function(id) {
			return this.data[id];
		};


		CanvasGuiImages.prototype.downloadSvgImageRef = function(id, ref) {
			console.log("Request Svg download: ", id, ref);
			var dataUpdated = function(url, svgData) {
				console.log("Svg download Ok: ", id, url, ref);
				this.data[id].svg = svgData;
				this.data[id].image = new Image();

				this.data[id].loaded = false;
				this.data[id].image.onload = function() {
					this.data[id].loaded = true;
					ConfigCache.imageDataLoaded(id);
				}.bind(this);
				this.data[id].image.src = url;
			}.bind(this);

			var fail = function(err) {
				console.log("Image download fail", err)
			};
			GameDataPipeline.loadSvgFromUrl(ref, dataUpdated, fail, true)
		};


		CanvasGuiImages.prototype.registerSvgImageRefs = function(refs) {
			console.log("Image refs: ", refs, this.svg);
			for (var index in refs) {
				if (!this.data[index]) {
					ConfigCache.storeImageRef(index, {id:index, url:refs[index]});
					this.data[index] = ConfigCache.getImageRef(index);
					this.downloadSvgImageRef(index, refs[index]);

				}
			}
		};

		return CanvasGuiImages

	});