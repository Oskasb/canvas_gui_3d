"use strict";

define([
	'gui/layout/GuiConstants'
],
	function(
		GuiConstants
		) {

		var CanvasBoxLayout = function() {

		};




		CanvasBoxLayout.layoutBorder = function(canvasCalls, border, target) {
			target.box = {};
			target.box.y = target.pos.final.top;
			target.box.x = target.pos.final.left;
			target.box.w = target.size.width;
			target.box.h = target.size.height;
			target.box.color = canvasCalls.toRgba(border.color);
			target.box.lineW = canvasCalls.valueXToUnitX(border.line_width, border.unit);
		};

		CanvasBoxLayout.configureText = function(canvasCalls, text, target, parent) {
			target.text = {};
			target.text.y = parent.valueYToUnitY(text.top,  text.unit) + target.size.height*0.5;
			target.text.x = parent.valueXToUnitX(text.left, text.unit) + target.size.width*0.5;
			target.text.line_height = canvasCalls.pxToX(text.font_size) + text.line_spacing || canvasCalls.pxToX(text.font_size)*0.5;
			target.text.font = canvasCalls.pxToX(text.font_size)+'px '+text.font_family;

			if (typeof(text.color) == 'string') {
				console.log("Bad text color...")
			}
			target.text.color = canvasCalls.toRgba(text.color);
			target.text.align_text = text.text_align || 'start';
		};

		CanvasBoxLayout.layoutBackground = function(canvasCalls, background, target) {
			if (background.color) {
				target.rect = {};
				target.rect.y = target.pos.final.top;
				target.rect.x = target.pos.final.left;
				target.rect.w = target.size.width;
				target.rect.h = target.size.height;
				if (typeof(background.color) == 'string') {
					console.log("Bad background...")
				}
				target.rect.color = canvasCalls.toRgba(background.color);
			}
			if (background.image_svg) {
				target.backgroundSvg = background.image_svg;
			}
		};

		CanvasBoxLayout.applyPosition = function(canvasCalls, posData, targetPos, parentPos, parent) {
		//	targetPos.final.top =  parentPos.top + canvasCalls.valueYToUnitY(posData.top,  posData.unit) + canvasCalls.valueYToUnitY(targetPos.origin.top,  targetPos.origin.unit);
		//	targetPos.final.left = parentPos.left+ canvasCalls.valueXToUnitX(posData.left, posData.unit) + canvasCalls.valueXToUnitX(targetPos.origin.left, targetPos.origin.unit);


			targetPos.final.top =  parent.valueYToUnitY(posData.top,  posData.unit)// + parent.valueYToUnitY(targetPos.origin.top,  targetPos.origin.unit);
			targetPos.final.left = parent.valueXToUnitX(posData.left, posData.unit)// + parent.valueXToUnitX(targetPos.origin.left, targetPos.origin.unit);


		//	targetPos.final.top =  parent.valueYToUnitY(targetPos.origin.top,  targetPos.origin.unit);
		//	targetPos.final.left = parent.valueXToUnitX(targetPos.origin.left, targetPos.origin.unit);

		};

		CanvasBoxLayout.applyShape = function(canvasCalls, shapeData, target, parent) {
		//	target.pos.final.top  += parent.valueYToUnitY(shapeData.top,  	shapeData.unit);
		//	target.pos.final.left += parent.valueXToUnitX(shapeData.left, 	shapeData.unit);



			if (shapeData.unit == '%') {
				target.size.height = 	 parent.valueToHeightPercent(shapeData.height);
				target.size.width = 	 parent.valueToWidthPercent(shapeData.width);
			} else {
				target.size.height = 	 canvasCalls.valueYToUnitY(shapeData.height,shapeData.unit);
				target.size.width = 	 canvasCalls.valueXToUnitX(shapeData.width, shapeData.unit);
			}




			target.data.xMin = canvasCalls.pxToPercentX(target.pos.final.left);
			target.data.xMax = canvasCalls.pxToPercentX(target.pos.final.left+target.size.width);
			target.data.yMin = canvasCalls.pxToPercentY(target.pos.final.top);
			target.data.yMax = canvasCalls.pxToPercentY(target.pos.final.top+target.size.height);
		};


		CanvasBoxLayout.layoutCanvasBox = function(canvasCalls, drawData, target, parent) {

			CanvasBoxLayout.applyPosition(canvasCalls, drawData.pos, target.renderData.pos, parent.renderData.pos.final, parent);

			if (drawData.shape) {
				CanvasBoxLayout.applyShape(canvasCalls, drawData.shape, target.renderData, parent);
			}

			if (drawData.border) {
				CanvasBoxLayout.layoutBorder(canvasCalls, drawData.border, target.renderData)
			}
			if (drawData.background) {
				CanvasBoxLayout.layoutBackground(canvasCalls, drawData.background, target.renderData)
			}
			if (drawData.text) {
				CanvasBoxLayout.configureText(canvasCalls, drawData.text, target.renderData, target)
			}
		};

		return CanvasBoxLayout
	});
