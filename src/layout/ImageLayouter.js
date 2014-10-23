"use strict";

define([
	'gui/functions/DrawCallbacks',
	'data_pipeline/data/ConfigCache'
],
	function(
		DrawCallbacks,
		ConfigCache
		) {

		var ImageLayouter = function() {

		};

		var backgroundCallback = function(image, finalPos, finalSize) {
			return function(ctx) {
				ctx.drawImage(image,  finalPos.left, finalPos.top, finalSize.width, finalSize.height);
			}
		};

		var setupImageCallbacks = function(id, data, target) {

			var setTheCallback = function(srcKey, imgRef) {
				target.callback = target.callbacks;
				// Will overwrite if there are other callbacks on the same element...
				target.callbacks = [{callback:backgroundCallback(imgRef.image, target.pos.final, target.size)}];
			};

			if (target.backgroundSvg) {
				ConfigCache.subscribeToImageId(id, target.backgroundSvg, setTheCallback);
			}

			if (target.backgroundBin) {
				ConfigCache.subscribeToImageId(id, target.backgroundBin, setTheCallback);
			}

		};

		ImageLayouter.setupDrawImage = function(id, data, target) {
			setupImageCallbacks(id, data, target)
		};

		return ImageLayouter
	});
