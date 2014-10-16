"use strict";

define(function() {

	var mouseAction = [0, 0];

	var buttons = {
		RIGHT:'RIGHT',
		LEFT:'LEFT',
		MIDDLE:'MIDDLE'
	};

	var events = {
		mousedown:'mousedown',
		mouseup:'mouseup',
		mouseout:'mouseout',
		click:'click'
	};

	var MouseActionListener = function() {
		this.pressedButtons = [0, 0]
	};

	MouseActionListener.prototype.handleElementMouseEvent = function(eventType, button) {
		switch (button) {
			case buttons.RIGHT:
				switch (eventType) {
					case events.mousedown:
						this.pressedButtons[1] = 1;
						mouseAction = this.pressedButtons;
						break;
					case events.mouseup:
						this.pressedButtons[1] = 0;
						mouseAction = this.pressedButtons;
						break;
					case events.mouseout:
						//    InputSetterGetter.stopDrag();
						break;
					case events.click:
						break;
				}
				break;
			case buttons.LEFT:
				switch (eventType) {
					case events.mousedown:
						this.pressedButtons[0] = 1;
						mouseAction = this.pressedButtons;
						break;
					case events.mouseup:
						this.pressedButtons[0] = 0;
						mouseAction = this.pressedButtons;
						break;
					case events.click:
						break;
				}
				break;
			case buttons.MIDDLE:
				switch (eventType) {
					case events.mousedown:
						mouseAction = [1, 1];
						break;
					case events.mouseup:
						mouseAction = [0, 0];
						break;
					case events.click:
						break;
				}
				break;
		}
	};


	MouseActionListener.prototype.handleMouseEvt = function(evt) {


		var clickType = buttons.LEFT;
		//  if (evt.type!=sTestEventType) console.log(evt.type);
		if (evt.which) {
			if (evt.which==3) clickType=buttons.RIGHT;
			if (evt.which==2) clickType=buttons.MIDDLE;
		} else if (evt.button) {
			if (evt.button==2) clickType=buttons.RIGHT;
			if (evt.button==4) clickType=buttons.MIDDLE;
		}
		this.handleElementMouseEvent(evt.type, clickType)
	};



	MouseActionListener.prototype.setupElementClickListener = function(element) {
		//    alert("Set Click, "+element.id)
		//  var sTestEventType='mousedown';
		var handleMouseEvent = function(e) {
			e.stopPropagation();
			var evt = (e==null ? event:e);
			this.handleMouseEvt(evt)
		}.bind(this);

		element.addEventListener(events.mouseup, handleMouseEvent);
		element.addEventListener(events.click, handleMouseEvent);
		element.addEventListener(events.mousedown, handleMouseEvent);
		element.addEventListener(events.mouseout, handleMouseEvent);
	};

	MouseActionListener.prototype.sampleMouseAction = function(mouseStore) {
		mouseStore.action[0] = mouseAction[0];
		mouseStore.action[1] = mouseAction[1];
	};

	return MouseActionListener
});