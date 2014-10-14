"use strict";

define([
	"game/GameConfiguration",
	'application/EventManager',
	'gui/MenuButton'
],
	function(
		gameConfig,
		event,
		MenuButton
		) {

		var currentTemplate;
		var TOGGLE_UI_TEMPLATE = function(args) {
			return function() {
				if (currentTemplate) event.fireEvent(event.list().UNLOAD_UI_TEMPLATE, {templateId:currentTemplate});
				if (currentTemplate != args.templateId) {
					event.fireEvent(event.list().LOAD_UI_TEMPLATE, {templateId:args.templateId});
					event.fireEvent(event.list().ANALYTICS_EVENT, {category:"OPEN_MENU", action:args.templateId, labels:"", value:0})
					currentTemplate = args.templateId;
				} else {
					currentTemplate = null;
				}
			};
		};

		var uiCallbacks = function(button) {
			switch (button) {
				case 'help':
					return function() {
						event.fireEvent(event.list().LOAD_UI_TEMPLATE, {templateId:args.templateId});
					}
				break;
				case 'start':
					return function() {
						event.fireEvent(event.list().PLAYER_MOVE_TO_POINT, {pos:gameConfig.PLAYER_INIT.startSpatial.pos   })
					}
				break;
				case 'low':
					return function() {
						event.fireEvent(event.list().PLAYER_MOVE_TO_POINT, {pos:gameConfig.PLAYER_INIT.landingStrip.pos   })
					}
					break;
				case 'mid':
					return function() {
						event.fireEvent(event.list().PLAYER_MOVE_TO_POINT, {pos:gameConfig.PLAYER_INIT.approach.pos       })
					}
					break;
				case 'hop':
					return function() {
						event.fireEvent(event.list().PLAYER_MOVE_TO_POINT, {pos:gameConfig.PLAYER_INIT.battle.pos         })
					}
					break;
				case 'strat':
					return function() {
						event.fireEvent(event.list().PLAYER_MOVE_TO_POINT, {pos:gameConfig.PLAYER_INIT.stratosphere.pos   })
					}
					break;
				case 'reset':
					return function() {
						event.fireEvent(event.list().EXIT_SCENARIO, {})
					}
					break;
			}
		};



		var main = {
			sound:   {xMin:79, yMin:18, xMax:88, yMax:22, axis:2, max:1,  min:0,factor:1   ,     name:'SOUND'	,  label:'' , 	callback:TOGGLE_UI_TEMPLATE({templateId:"UI_SOUND_MENU"})  	},
			keys:    {xMin:79, yMin:24, xMax:88, yMax:28, axis:2, max:1,  min:0,factor:1   ,     name:'KEYS'    ,  label:'' , 	callback:TOGGLE_UI_TEMPLATE({templateId:"UI_KEY_BINDINGS"})	},
			effects: {xMin:79, yMin:30, xMax:88, yMax:34, axis:2, max:1,  min:0,factor:1   ,     name:'VFX'    	,  label:'' , 	callback:TOGGLE_UI_TEMPLATE({templateId:"UI_VFX_MENU"})   	},
			help:    {xMin:79, yMin:36, xMax:88, yMax:40, axis:2, max:1,  min:0,factor:1   ,     name:'HELP'   	,  label:'' ,   callback:TOGGLE_UI_TEMPLATE({templateId:"UI_HELP_MENU"})   	},
			reset:   {xMin:79, yMin:42, xMax:88, yMax:46, axis:2, max:1,  min:0,factor:1   ,     name:'RESET'   ,  label:'' ,   callback:uiCallbacks('reset')}
		};

		var teleport = {
			reset:   {xMin:79, yMin:23, xMax:88, yMax:27, axis:2, max:1,  min:0,factor:1   ,     name:'START'   ,  label:'',	callback:uiCallbacks('start')	},
			sound:   {xMin:79, yMin:29, xMax:88, yMax:33, axis:2, max:1,  min:0,factor:1   ,     name:'LOW'		,  label:'',	callback:uiCallbacks('low') 	},
			keys:    {xMin:79, yMin:35, xMax:88, yMax:39, axis:2, max:1,  min:0,factor:1   ,     name:'MID'    	,  label:'',	callback:uiCallbacks('mid')		},
			effects: {xMin:79, yMin:41, xMax:88, yMax:45, axis:2, max:1,  min:0,factor:1   ,     name:'HOP'    	,  label:'',	callback:uiCallbacks('hop')   	},
			help:    {xMin:79, yMin:47, xMax:88, yMax:51, axis:2, max:1,  min:0,factor:1   ,     name:'STRAT'   ,  label:'',	callback:uiCallbacks('strat') 	}

		};

	var ScreenMenuSurface = function() {
		this.widgets = [];
		this.menus = [
			{
				closed:{name:'Menu', xMin:77, yMin:14, xMax:85, yMax:18},
				active:{name:'Menu', xMin:77, yMin:14, xMax:90, yMax:48},
				controls:main
			},
			{
				closed:{name:'Teleport', xMin:77, yMin:19, xMax:85, yMax:23},
				active:{name:'Teleport', xMin:77, yMin:19, xMax:90, yMax:52},
				controls:teleport
			}
		]
	};

	ScreenMenuSurface.prototype.buildMenuButton = function(control, data) {
		return new MenuButton(control, data);
	};

	return ScreenMenuSurface
});