"use strict";

define([
	'gui/elements/CanvasGuiLayer'
],
	function(
		CanvasGuiLayer
		) {


		var UiParent = function(canvasCalls) {
			this.layer = new CanvasGuiLayer({"shape":"canvas_parent"}, null, canvasCalls)

		};



		return UiParent

	});