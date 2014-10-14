"use strict";

define([
	'gui/elements/ScreenControlTarget',
	'gui/elements/ScreenSelectionSurface',
	'gui/elements/ScreenMenuSurface'
],
	function(
		ScreenControlTarget,
		ScreenSelectionSurface,
		ScreenMenuSurface

		) {

		var GuiWidgetComposer = function() {
			this.screenControlTargets = {};
			this.screenSelectionSufaces = [];
			this.widgets = [];
		};

		GuiWidgetComposer.prototype.composeGuiWidgets = function(entity, onScreenInput) {
			this.screenControlTargets = {};
			this.screenSelectionSufaces = [];
			this.widgets = [];
			console.log(onScreenInput);
			for (var i = 0; i < onScreenInput.menus.length; i++) {
				this.screenSelectionSufaces[i] = new ScreenSelectionSurface(onScreenInput.menus[i]);
				for (var index in onScreenInput.menus[i].controls) {
					this.screenSelectionSufaces[i].registerControlTargets(new ScreenControlTarget(entity, index, onScreenInput.menus[i].controls[index]));
				}
			}

			for (i = 0; i < onScreenInput.widgets.length; i++) {
				for (var index in onScreenInput.widgets[i].controls) {
					this.widgets.push(new ScreenControlTarget(entity, index, onScreenInput.widgets[i].controls[index]));
					this.widgets[i].onControlEnable();
				}
			}

			var menuGroup = new ScreenMenuSurface();
			for (i = 0; i < menuGroup.menus.length; i++) {
				var surface = new ScreenSelectionSurface(menuGroup.menus[i]);
				for (var index in menuGroup.menus[i].controls) {
					surface.registerControlTargets(menuGroup.buildMenuButton(index, menuGroup.menus[i].controls[index]))
				}
				this.screenSelectionSufaces.push(surface);
			}
		};

		return GuiWidgetComposer;

	});