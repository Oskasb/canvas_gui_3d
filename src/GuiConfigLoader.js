"use strict";

define([
	'data_pipeline/data/CanvasGuiImages',
	'data_pipeline/data/ConfigCache'

],
	function(
		CanvasGuiImages,
		ConfigCache
		) {

		var loaderOptions = {pollData:true};

		var GuiConfigLoader = function() {
			this.registryUrls = {};

			var applyOpts = function(srcKey, opts) {
				ConfigCache.applyDataPipelineOptions(opts);
			};

			ConfigCache.registerCategoryKeySubscriber('setup', 'pipeline', applyOpts);
			this.canvasGuiImages = new CanvasGuiImages();
		};

		GuiConfigLoader.prototype.grabSvgImages = function(data) {
			this.canvasGuiImages.registerSvgImageRefs(data);
		};

		GuiConfigLoader.prototype.grabBinaryImages = function(data) {
			this.canvasGuiImages.registerBinaryImageRefs(data);
		};

		GuiConfigLoader.prototype.loadConfigDataFile = function(url, ok, fail) {
			var success = function(srcUrl, data) {
				for (var i = 0; i < data.length; i++) {
					for (var index in data[i]) {
						ConfigCache.dataCombineToKey(index, srcUrl, data[i]);
						ok(data[i][index], srcUrl);
						ConfigCache.registerCategoryUpdatedCallback(index, ok);
						if (index == 'svg') {
							this.grabSvgImages(data[i][index]);
						}
						if (index == 'bin') {
							this.grabBinaryImages(data[i][index]);
						}
					}
				}
			}.bind(this);
			ConfigCache.cacheFromUrl(url, success, fail);
			//	GameDataPipeline.loadConfigFromUrl(url, success, fail, true);
		};


		GuiConfigLoader.prototype.loadFiles = function(data, srcUrl, registryUrls) {

			var dlCount = 0;

			var ok = function() {
				dlCount -= 1;
				if (dlCount == 0) {
				//	console.log("Great success: ", ConfigCache.getCachedConfigs(), srcUrl);
					if (!srcUrl) {

						return;
					}
					registryUrls[srcUrl].success(srcUrl);
				}
			}.bind(this);

			var fail = function(err) {
				console.error("Epic Fail: ", ConfigCache, this.registryUrls);
				this.registryUrls[srcUrl].fail(err);
			};

			for (var index in data) {
				for (var j = 0; j < data[index].length; j++) {
					dlCount += 1;
					this.loadConfigDataFile(data[index][j], ok, fail)
				}
			}
		};


		GuiConfigLoader.prototype.initConfigs = function(masterUrl, ok, fail) {
			this.registryUrls[masterUrl] = {success:ok, fail:fail};
			var loadFromMaster = function(data, srcUrl) {
				this.loadFiles(data, srcUrl, this.registryUrls)
			}.bind(this);
			this.loadConfigDataFile(masterUrl, loadFromMaster, fail);

		};




		return GuiConfigLoader
});