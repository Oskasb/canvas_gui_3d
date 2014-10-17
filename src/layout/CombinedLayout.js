"use strict";

define([
	'gui/layout/GuiConstants'
],
	function(
		GuiConstants
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


		var CombinedLayout = function(data) {
			this.sourceData = data;
		//	for (var index in data) {
		//		this.sourceData[index] = data[index];
		//	}

			this.data = this.sourceData;
		};

		return CombinedLayout;
	}
);