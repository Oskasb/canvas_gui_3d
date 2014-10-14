"use strict";

define([
	'io/canvas/elements/CanvasGuiLayer'
],
	function(
		CanvasGuiLayer
		) {


		var UiParent = function(canvasCalls) {
			this.layer = new CanvasGuiLayer({"shape":"canvas_parent"}, null, canvasCalls)

		};



		return UiParent

	});