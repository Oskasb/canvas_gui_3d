"use strict";

define([
	'gui/layout/LayoutEnums',
	'gui/layout/CanvasBoxLayout',
	'gui/layout/ImageLayouter',
	'gui/functions/DrawCallbacks'

],
	function(
		LayoutEnums,
		CanvasBoxLayout,
		ImageLayouter,
		DrawCallbacks
		) {

		function clone(obj) {
			var copy;

			// Handle the 3 simple types, and null or undefined
			if (null == obj || "object" != typeof obj) return obj;

			// Handle Date
			if (obj instanceof Date) {
				copy = new Date();
				copy.setTime(obj.getTime());
				return copy;
			}

			// Handle Array
			if (obj instanceof Array) {
				copy = [];
				for (var i = 0, len = obj.length; i < len; i++) {
					copy[i] = clone(obj[i]);
				}
				return copy;
			}

			// Handle Object
			if (obj instanceof Object) {
				copy = {};
				for (var attr in obj) {
					if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
				}
				return copy;
			}

			throw new Error("Unable to copy obj! Its type isn't supported.");
		}

		var CanvasLayoutInterpreter = function(canvasCalls) {
			this.canvasCalls = canvasCalls;
		};

		CanvasLayoutInterpreter.combineConstantsToData = function(data, constants) {
		//	console.log("Combine", data, constants);
		//	data = clone(data);
			for (var index in constants) {
				data[index] = constants[index];
		//		console.log("Attach constants: ", index, data, constants[index]);
			}
		};


		CanvasLayoutInterpreter.applyConstantValues = function(data, constants) {

			for (var index in data) {
		//		data[index] = clone(data[index]);
				for (var props in data[index]) {
		//			console.log(index, props)
					for (var constName in constants) {
						if (data[index][props] == constName) {
							data[index][props] = constants[constName]
						}
					}

				}
			}
		};

		var applyConstants = function(data, layoutKeyMaps, layoutConstants) {
			for (var index in data) {
			//	if (index == "shape") {
					if (typeof(data[index]) == 'string') {

						for (var key in layoutKeyMaps) {
							if (key == data[index]) {
								CanvasLayoutInterpreter.combineConstantsToData(data, layoutKeyMaps[key])
							}
						}
					}
					CanvasLayoutInterpreter.applyConstantValues(data, layoutConstants);
			//	}

			//	for (var consts in layoutKeyMaps) {
			//		if (data[consts]) {
			//		//	data = clone(data);
			//			for (var key in layoutKeyMaps[consts]) {
			//				if (data[consts] == key) {
			//
			//					data[consts] = layoutKeyMaps[consts][key];
			//				}
			//
			//			}
			//		}
			//	}
			}
		};

		CanvasLayoutInterpreter.setupDrawShape = function(data, target, parent, canvasCalls) {

			CanvasBoxLayout.layoutCanvasBox(canvasCalls, data, target, parent);

			ImageLayouter.setupDrawImage(target.drawData, target.renderData);
			if (target.drawData.draw_callback) CanvasLayoutInterpreter.setupDrawCallback(target.drawData.draw_callback, target.renderData);
			CanvasLayoutInterpreter.setupDrawText(target.drawData, target.renderData);
		//	if (target.text) CanvasLayoutInterpreter.applyTextLabel(data, target);
		//	if (data.messages) CanvasLayoutInterpreter.applyMessageCallback(data.messages, target);
		};

		var textCallback = function(callback) {
			return function(target) {
				target.text.label = callback()
			}
		};

		CanvasLayoutInterpreter.buildTextLabel = function(textSource, target) {
			if (textSource.callback) {
				target.text.callback = textCallback(DrawCallbacks.getGuiDrawCallback(textSource.callback));
			} else if (textSource.channel) {
				target.text.callback = textCallback(DrawCallbacks.getGuiDrawCallback("fetchChannelData")(textSource.channel));
			} else {
				target.text.label = DrawCallbacks.getGuiDrawCallback('fetchGuiText')(textSource.key);
			}
		};


		CanvasLayoutInterpreter.applyTextLabel = function(data, target) {
			CanvasLayoutInterpreter.buildTextLabel(data.text.source, target);
		};

		CanvasLayoutInterpreter.setupDrawText = function(data, target) {

 			if (data.text) {
				 target.text = {
					 x:target.text.x,
					 y:target.text.y,
					 color:target.text.color,
					 font:target.text.font,
					 align:target.text.align_text,
					 height: target.text.line_height
				 }
			}
		};



		CanvasLayoutInterpreter.applyMessageCallback = function(messages, target) {
			target.messageChannels = {};
			target.renderData.text.callbacks = [];
			for (var index in messages.channels) {
				target.messageChannels[messages.channels[index]] = 'on_message';
				target.messageData = messages;
				target.renderData.text.callbacks.push(textCallback(DrawCallbacks.getGuiDrawCallback("fetchChannelData")(messages.channels[index])));
				DrawCallbacks.getGuiDrawCallback("registerMessageElement")(target, messages.channels[index], target.messageChannels[messages.channels[index]]);
			}
		};

		CanvasLayoutInterpreter.setupDrawCallback = function(draw_callback, target) {
			if (draw_callback.source) {
				target.callbacks.push({callback:DrawCallbacks.getGuiDrawCallback(draw_callback.source)});
				target.callbackData = draw_callback;
				target.callback = true;
			}
		};

		return CanvasLayoutInterpreter
	});
