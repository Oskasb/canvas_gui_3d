"use strict";

define([
	'io/canvas/layout/GuiConstants',
	'io/data/ConfigCache'
],
	function(
		GuiConstants,
		ConfigCache
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

	 	var layoutKeyMaps = ConfigCache.getCategory('layout_key_maps');
	 	var layoutConstants = ConfigCache.getCategory('layout_constants');

		var matchKeyMapList = [];
		var matchConstantsList = [];

	 	var updKeyMaps = function(data) {
			matchKeyMapList = [];
			for (var index in data) {
				matchKeyMapList.push(index);
			}
	 		layoutKeyMaps = data;
	 	};

	 	var updConstants = function(data) {
			 matchConstantsList = [];
			 for (var index in data) {
				 matchConstantsList.push(index);
			 }
			 layoutConstants = data;
	 	};

	 	ConfigCache.registerCategoryUpdatedCallback('layout_key_maps', updKeyMaps);
	 	ConfigCache.registerCategoryUpdatedCallback('layout_constants', updConstants);

		updKeyMaps(layoutKeyMaps);
		updConstants(layoutConstants);

		var GuiConstants = function() {

		};

		GuiConstants.traverseSourceAgainstList = function(target, list, constants) {
			var checkLevel = function(data) {

				for (var index in data) {
					if (list.indexOf(data[index]) != -1) {
						data[index] = constants[data[index]];
					//	console.log("Match:", index, data[index])
					} else if (typeof(data[index]) == 'object') {
					//	console.log("Up Level:", index)
						checkLevel(data[index]);

					} else {
				//		console.log("No Match:", index)
					}
				}
			};
			checkLevel(target);
		};

		GuiConstants.applyConstantValues = function(data) {
			GuiConstants.traverseSourceAgainstList(data, matchConstantsList, clone(layoutConstants))
		};

		GuiConstants.applyLayoutRules = function(data) {
			GuiConstants.traverseSourceAgainstList(data, matchKeyMapList, clone(layoutKeyMaps));
		};

		GuiConstants.clone = function(data) {
			return clone(data);
		};

		return GuiConstants
	});

