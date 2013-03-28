/** namespaces **/
window.barmatz = {
	events: {},
	forms: {
		factories: {},
		fields: {},
		ui: {},
		users: {}
	},
	mvc: {},
	net: {},
	utils: {}
};
/** barmatz.utils.DataTypes **/
window.barmatz.utils.DataTypes = function(){};

Object.defineProperties(barmatz.utils.DataTypes, 
{
	UNDEFINED_ERROR: {value: 'expected property is undefined'},
	INVALID_VALUE_ERROR: {value: 'value is not valid'},
	WRONG_TYPE: {value: 'data type is wrong'},
	WRONG_INSTANCE: {value: 'instance is wrong object'},
	WRONG_TYPE_INSTANCE: {value: 'data type is wrong or instance is wrong object'},
	VALUE_NULL: {value: 'value is null'},
	_recursiveVlidation: {value: function(value, collection, method, errorMessage, allowNull)
	{
		var errors, i;

		if(!allowNull)
			this.isValid(value);
		else if(allowNull && value == null)
			return true;
		
		errors = 0;
		
		for(i = 0; i < collection.length; i++)
		{
			try
			{
				method.call(this, value, collection[i], allowNull);
			}
			catch(error)
			{
				errors++;
			}
		}
		
		if(errors == collection.length)
			if(!this.throw(TypeError, errorMessage))
				return false;
		
		return true;
	}},
	_silent: {value: false, writable: true},
	silent: {get: function()
	{
		return this._silent;
	}, set: function(value)
	{
		this._silent = value;
	}},
	applySilent: {value: function(method)
	{
		var returnValue, args;
		
		args = Array.prototype.slice.call(arguments, 1, arguments.length);
		
		this.silent = true;
		returnValue = this[method].apply(this, args);
		this.silent = false;
		
		return returnValue;
	}},
	throw: {value: function(error, message)
	{
		if(this.silent)
			return false;
		else
		{
			throw new error(message);
			return true;
		}
	}},
	isNotUndefined: {value: function(value)
	{
		if(value === undefined)
			if(!this.throw(ReferenceError, this.UNDEFINED_ERROR))
				return false;
		return true;
	}},
	isValid: {value: function(value)
	{
		if(value == null)
			if(!this.throw(TypeError, this.INVALID_VALUE_ERROR))
				return false;
		return true;
	}},
	isallowNull: {value: function(value)
	{
		if(value == null)
			if(!this.throw(TypeError, this.VALUE_NULL))
			return false;
		return true;
	}},
	isTypeOf: {value: function(value, type, allowNull)
	{
		if(!allowNull)
			this.isValid(value);
		else if(allowNull && value == null)
			return true;
		if(typeof value != type)
			if(!this.throw(TypeError, this.WRONG_TYPE))
				return false;
		return true;
	}},
	isTypesOf: {value: function(value, types, allowNull)
	{
		this._recursiveVlidation(value, types, this.isTypeOf, this.WRONG_INSTANCE, allowNull);
		return true;
	}},
	isInstanceOf: {value: function(instance, object, allowNull)
	{
		if(!allowNull)
			this.isValid(instance);
		else if(allowNull && instance == null)
			return true;
		if(!(instance instanceof object))
			if(!this.throw(TypeError, this.WRONG_INSTANCE))
				return false;
		return true;
	}},
	isInstacnesOf: {value: function(instances, objects, allowNull)
	{
		this._recursiveVlidation(instances, objects, this.isInstanceOf, this.WRONG_INSTANCE, allowNull);
		return true;
	}},
	isTypeOrInstance: {value: function(value, type, object, allowNull)
	{
		if(!allowNull)
			this.isValid(value);
		else if(allowNull && value == null)
			return true;
		if(typeof value != type || !(value instanceof object))
			if(!this.throw(TypeError, this.WRONG_TYPE_INSTANCE))
				return false;
		return true;
	}},
	isTypesOrInstances: {value: function(value, types, objects, allowNull)
	{
		var isType, isInstance;
		
		if(!allowNull)
			this.isValid(value);
		else if(allowNull && value == null)
			return true;

		try
		{
			isType = this.isTypesOf(value, types, allowNull);
		}
		catch(error){}
		try
		{
			isInstance = this.isInstacnesOf(value, objects, allowNull);
		}
		catch(error){}
		
		if(!isType && !isInstance)
			if(!this.throw(TypeError, this.WRONG_TYPE_INSTANCE))
				return false;
		return true;
	}}
});
/** barmatz.utils.Dictionary **/
window.barmatz.utils.Dictionary = function()
{
	this._keys = [];
	this._values = [];
};

Object.defineProperties(barmatz.utils.Dictionary.prototype,
{
	add: {value: function(key, value)
	{
		var keyIndex = this._keys.indexOf(key);
		
		if(keyIndex >= 0)
			this._values[keyIndex] = value;
		else if(keyIndex == -1)
		{
			this._keys.push(key);
			this._values.push(value);
		}
		else
			throw new Error('an error has occured');
		
		return value;
	}},
	remove: {value: function(key)
	{
		var keyIndex, value;
		keyIndex = this._keys.indexOf(key);
		value = this.get(keyIndex);
		this._keys.splice(keyIndex, 1);
		this._values.splice(keyIndex, 1);
		return value;
	}},
	get: {value: function(key)
	{
		return this._values[this._keys.indexOf(key)];
	}},
	getNext: {value: function(key)
	{
		return this._values[this._keys.indexOf(key) + 1];
	}},
	getPrev: {value: function(key)
	{
		return this._values[this._keys.indexOf(key) - 1];
	}},
	reset: {value: function()
	{
		this._keys.splice(0, this._keys.length);
		this._values.splice(0, this._values.length);
	}},
	forEach: {value: function(callback)
	{
		var i;
		for(i = 0; i < this._keys.length; i++)
			callback(this._values[i], this._keys[i], this._values);
	}},
	find: {value: function(value)
	{
		if(value === undefined)
			throw new ReferenceError('expected property value is undefined');
		
		return this._keys[this._values.indexOf(value)];
	}}
});
/** barmatz.events.Event **/
window.barmatz.events.Event = function(type)
{
	barmatz.utils.DataTypes.isNotUndefined(type);
	barmatz.utils.DataTypes.isTypeOf(type, 'string', true);
	this._type = type;
};

Object.defineProperties(barmatz.events.Event.prototype,
{
	target: {get: function()
	{
		return this._target;
	}},
	type: {get: function()
	{
		return this._type;
	}},
	clone: {value: function(type)
	{
		var event = new barmatz.events.Event(type);
		event._target = this.target;
		return event;
	}},
	formatToString: {value: function(className)
	{
		var parameters = [], i;
		
		arguments = Array.prototype.slice.call(arguments);
		
		for(i = 1; i < arguments.length; i++)
			parameters.push(arguments[i] + '=' + this[arguments[i]]);
		
		return '[' + className + '(' + parameters.join(', ') + ')]';
	}},
	toString: {value: function()
	{
		return this.formatToString('Event', 'type');
	}}
});
/** barmatz.events.CollectionEvent **/
window.barmatz.events.CollectionEvent = function(type)
{
	barmatz.utils.DataTypes.isNotUndefined(type);
	barmatz.utils.DataTypes.isTypeOf(type, 'string');
	barmatz.events.Event.call(this, type);
	
	this._item = null;
	this._index = NaN;
	
	switch(type)
	{
		case barmatz.events.CollectionEvent.ITEM_ADDED:
		case barmatz.events.CollectionEvent.ITEM_REMOVED:
			this._item = arguments[1];
			this._index = arguments[2];
			break;
	}
};

barmatz.events.CollectionEvent.prototype = new barmatz.events.Event(null);
barmatz.events.CollectionEvent.prototype.constructor = barmatz.events.CollectionEvent;

Object.defineProperties(barmatz.events.CollectionEvent,
{
	ITEM_ADDED: {value: 'itemAdded'},
	ITEM_REMOVED: {value: 'itemRemoved'}
});
Object.defineProperties(barmatz.events.CollectionEvent.prototype,
{
	item: {get: function()
	{
		return this._item;
	}},
	index: {get: function()
	{
		return this._index;
	}},
	clone: {value: function(type)
	{
		var event = new barmatz.events.CollectionEvent(type);
		event._target = this.target;
		switch(type)
		{
			case barmatz.events.CollectionEvent.ITEM_ADDED:
			case barmatz.events.CollectionEvent.ITEM_REMOVED:
				event._field = this.field;
				event._index = this.index;
				break;
		}
		return event;
	}},
	toString: {value: function()
	{
		switch(type)
		{
			default:
				return this.formatToString('CollectionEvent', 'type');
				break;
			case barmatz.events.CollectionEvent.ITEM_ADDED:
			case barmatz.events.CollectionEvent.ITEM_REMOVED:
				return this.formatToString('CollectionEvent', 'type', 'item', 'index');
				break;
		}
	}}
});
/** barmatz.events.EventDispatcher **/
window.barmatz.events.EventDispatcher = function(target)
{
	this._target = target || this;
	this._listeners = {};
};

Object.defineProperties(barmatz.events.EventDispatcher.prototype, 
{
	addEventListener: {value: function(type, listener)
	{
		barmatz.utils.DataTypes.isTypeOf(type, 'string');
		barmatz.utils.DataTypes.isTypeOf(listener, 'function');
		
		if(!this._listeners[type])
			this._listeners[type] = [];
		
		this._listeners[type].push(listener);
	}},
	dispatchEvent: {value: function(event)
	{
		var i, c;
		
		barmatz.utils.DataTypes.isInstanceOf(event, barmatz.events.Event);
		
		event._target = this._target;
		
		for(i in this._listeners)
		{
			if(i === event.type)
				for(c in this._listeners[i])
					this._listeners[i][c](event);
		}
	}},
	hasEventListener: {value: function(type)
	{
		return this._listeners[type] ? true : false;
	}},
	removeEventListener: {value: function(type, listener)
	{
		var i;
		
		if(this._listeners[type])
		{
			for(i = 0; i < this._listeners[type].length; i++)
				if(this._listeners[type][i] === listener)
					this._listeners[type].splice(i, 1);
			
			if(this._listeners[type].length == 0)
				delete this._listeners[type];
		}
	}}
});

/** barmatz.events.FormModelEvent **/
window.barmatz.events.FormModelEvent = function(type)
{
	barmatz.utils.DataTypes.isNotUndefined(type);
	barmatz.utils.DataTypes.isTypeOf(type, 'string');
	barmatz.events.Event.call(this, type);
};

barmatz.events.FormModelEvent.prototype = new barmatz.events.Event(null);
barmatz.events.FormModelEvent.prototype.constructor = barmatz.events.FormModelEvent;

Object.defineProperties(barmatz.events.FormModelEvent,
{
	SAVING: {value: 'saving'},
	SAVED: {value: 'saved'},
	ERROR_SAVING: {value: 'errorSaving'},
	LOADING_FORM: {value: 'loadingForm'},
	LOADING_FORM_COMPLETE: {value: 'loadingFormComplete'},
	LOADING_FORM_ERROR: {value: 'loadingFormError'},
	DELETING: {value: 'deleting'},
	DELETED: {value: 'deleted'},
	DELETION_FAIL: {value: 'deletionFail'},
	SUBMITTING: {value: 'submitting'},
	SUBMITTED: {value: 'submitted'},
	SUBMITION_FAILED: {value: 'submitionFailed'}
}); 
Object.defineProperties(barmatz.events.FormModelEvent.prototype, 
{
	clone: {value: function()
	{
		var event = new FormModelEvent(type);
		event._target = this.target;
		return event;
	}},
	toString: {value: function()
	{
		switch(this.type)
		{
			default:
				return this.formatToString('FormModelEvent', 'type');
				break;
		}
	}}
});
/** barmatz.events.LoaderEvent **/
window.barmatz.events.LoaderEvent = function(type)
{
	barmatz.events.Event.call(this, type);
	
	this._request = null;
	this._response = null;
	
	switch(type)
	{
		case barmatz.events.LoaderEvent.UNSENT:
		case barmatz.events.LoaderEvent.OPENED:
			this._request = arguments[1];
		case barmatz.events.LoaderEvent.HEADERS_RECEIVED:
		case barmatz.events.LoaderEvent.LOADING:
		case barmatz.events.LoaderEvent.DONE:
			this._response = arguments[1];
			break;
	}
};

barmatz.events.LoaderEvent.prototype = new barmatz.events.Event(null);
barmatz.events.LoaderEvent.prototype.constructor = barmatz.events.LoaderEvent;

Object.defineProperties(barmatz.events.LoaderEvent,
{
	UNSENT: {value: 'unsent'},
	OPENED: {value: 'opened'},
	HEADERS_RECEIVED: {value: 'headersReceived'},
	LOADING: {value: 'loading'},
	DONE: {value: 'done'}
});

Object.defineProperties(barmatz.events.LoaderEvent.prototype,
{
	request: {get: function()
	{
		return this._request;
	}},
	response: {get: function()
	{
		return this._response;
	}},
	clone: {value: function(type)
	{
		var event = new barmatz.events.LoaderEvent(type);
		event._target = this.target;
		event._request = this.request;
		event._response = this.response;
		return event;
	}},
	toString: {value: function()
	{
		return this.formatToString('LoaderEvent', 'type', 'request', 'response');
	}}
});
/** barmatz.events.ModelEvent **/
window.barmatz.events.ModelEvent = function(type)
{
	barmatz.events.Event.call(this, type);
	
	switch(type)
	{
		case barmatz.events.ModelEvent.VALUE_CHANGED:
			this._key = arguments[1];
			this._value = arguments[2];
			break;
	}
};

barmatz.events.ModelEvent.prototype = new barmatz.events.Event(null);
barmatz.events.ModelEvent.prototype.constructor = barmatz.events.ModelEvent;

Object.defineProperties(barmatz.events.ModelEvent, 
{
	VALUE_CHANGED: {value: 'valueChanged'}
});
Object.defineProperties(barmatz.events.ModelEvent.prototype, 
{
	key: {get: function()
	{
		return this._key;
	}},
	value: {get: function()
	{
		return this._value;
	}},
	clone: {value: function(type)
	{
		var event = new barmatz.events.ModelEvent(type);
		event._target = this.target;
		event._key = this.key;
		event._value = this.value;
		return event;
	}},
	toString: {value: function()
	{
		return this.formatToString('ModelEvent', 'type', 'key', 'value');
	}}
});
/** barmatz.mvc.Controller **/
window.barmatz.mvc.Controller = function(){};
/** barmatz.mvc.Model **/
window.barmatz.mvc.Model = function()
{
	barmatz.events.EventDispatcher.call(this);
};

barmatz.mvc.Model.prototype = new barmatz.events.EventDispatcher();
barmatz.mvc.Model.prototype.constructor = barmatz.mvc.Model;

Object.defineProperties(barmatz.mvc.Model.prototype, 
{
	get: {value: function(key)
	{
		return this['_' + key];
	}},
	set: {value: function(key, value)
	{
		this['_' + key] = value;
		this.dispatchEvent(new barmatz.events.ModelEvent(barmatz.events.ModelEvent.VALUE_CHANGED, key, value));
	}}
});
/** barmatz.forms.CollectionModel **/
window.barmatz.forms.CollectionModel = function()
{
	barmatz.mvc.Model.call(this);
	this.set('items', []);
};

barmatz.forms.CollectionModel.prototype = new barmatz.mvc.Model();
barmatz.forms.CollectionModel.prototype.constructor = barmatz.forms.CollectionModel;

Object.defineProperties(barmatz.forms.CollectionModel.prototype,
{
	numItems: {get: function()
	{
		var items = this.get('items');
		return items ? items.length : 0;
	}},
	addItem: {value: function(item)
	{
		barmatz.utils.DataTypes.isNotUndefined(item);
		barmatz.utils.DataTypes.isInstanceOf(item, barmatz.mvc.Model);
		this.addItemAt(item, this.get('items').length);
	}},
	addItemAt: {value: function(item, index)
	{
		barmatz.utils.DataTypes.isNotUndefined(item);
		barmatz.utils.DataTypes.isNotUndefined(index);
		barmatz.utils.DataTypes.isInstanceOf(item, barmatz.mvc.Model);
		barmatz.utils.DataTypes.isTypeOf(index, 'number');
		this.get('items').splice(index, 0, item);
		this.dispatchEvent(new barmatz.events.CollectionEvent(barmatz.events.CollectionEvent.ITEM_ADDED, item, index));
	}},
	removeItem: {value: function(item)
	{
		barmatz.utils.DataTypes.isNotUndefined(item);
		barmatz.utils.DataTypes.isInstanceOf(item, barmatz.mvc.Model);
		this.removeItemAt(this.getItemIndex(item));
	}},
	removeItemAt: {value: function(index)
	{
		barmatz.utils.DataTypes.isNotUndefined(index);
		barmatz.utils.DataTypes.isTypeOf(index, 'number');
		this.dispatchEvent(new barmatz.events.CollectionEvent(barmatz.events.CollectionEvent.ITEM_REMOVED, this.get('items').splice(index, 1)[0], index));
	}},
	getItemAt: {value: function(index)
	{
		barmatz.utils.DataTypes.isNotUndefined(index);
		barmatz.utils.DataTypes.isTypeOf(index, 'number');
		return this.get('items')[index];
	}},
	getItemIndex: {value: function(item)
	{
		barmatz.utils.DataTypes.isNotUndefined(item);
		barmatz.utils.DataTypes.isInstanceOf(item, barmatz.mvc.Model);
		return this.get('items').indexOf(item);
	}},
	setItemIndex: {value: function(item, index)
	{
		var items;
		
		barmatz.utils.DataTypes.isNotUndefined(item);
		barmatz.utils.DataTypes.isNotUndefined(index);
		barmatz.utils.DataTypes.isInstanceOf(item, barmatz.mvc.Model);
		barmatz.utils.DataTypes.isTypeOf(index, 'number');
		
		items = this.get('items');
		items.splice(items.indexOf(item), 1);
		items.splice(index, 0, item);
	}},
	forEach: {value: function(handler)
	{
		var items, i;
		
		barmatz.utils.DataTypes.isNotUndefined(handler);
		barmatz.utils.DataTypes.isTypeOf(handler, 'function');

		items = this.get('items');
		
		for(i = 0; i < items.length; i++)
			handler(items[i], i, items);
	}},
	find: {value: function(filter)
	{
		
		barmatz.utils.DataTypes.isNotUndefined(filter);
		barmatz.utils.DataTypes.isTypeOf(filter, 'function');
		return this.get('items').filter(filter);
	}},
	toString: {value: function()
	{
		var values = [];
		
		this.forEach(function(item, index, collection)
		{
			values.push(item.toString());
		});
		
		return values.join(', ');
	}},
	toArray: {value: function()
	{
		return this.get('items').slice(0);
	}}
});
/** barmatz.forms.FormController **/
window.barmatz.forms.FormController = function(model, view)
{
	var submittingForm, loadingDialog;
	
	barmatz.utils.DataTypes.isNotUndefined(model);
	barmatz.utils.DataTypes.isNotUndefined(view);
	barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.FormModel);
	barmatz.utils.DataTypes.isInstanceOf(view, HTMLFormElement);
	barmatz.mvc.Controller.call(this);
	
	 view.name = model.name;
	 view.method = model.method;
	 view.encoding = model.encoding;
	 view.addEventListener('submit', onViewSubmit);
	
	 function addModelListeners()
	 {
		 model.addEventListener(barmatz.events.FormModelEvent.SUBMITTING, onModelSubmitting);
		 model.addEventListener(barmatz.events.FormModelEvent.SUBMITTED, onModelSubmitted);
		 model.addEventListener(barmatz.events.FormModelEvent.SUBMITION_FAILED, onModelSubmitionFailed);
	 }
	 
	 function removeModelListeners()
	 {
		 model.removeEventListener(barmatz.events.FormModelEvent.SUBMITTING, onModelSubmitting);
		 model.removeEventListener(barmatz.events.FormModelEvent.SUBMITTED, onModelSubmitted);
		 model.removeEventListener(barmatz.events.FormModelEvent.SUBMITION_FAILED, onModelSubmitionFailed);
	 }
	 
	 function getViewData()
	 {
		 var data = {}, elements = Array.prototype.slice.call(view.elements), element, i;
		 
		 for(i = 0; i < elements.length; i++)
		 {
			 element = elements[i];

			 if(element.tagName.toLowerCase() != 'button' && element.type != 'button' && element.type != 'submit')
				 data[element.name] = element.value;
		 }
		 
		 return data;
	 }
	 
	 function addLoadingDialog()
	 {
		 loadingDialog = barmatz.forms.factories.DOMFactory.createLoadingDialog(view);
	 }
	 
	 function removeLoadingDialog()
	 {
		 barmatz.forms.factories.DOMFactory.destroyLoadingDialog(loadingDialog);
		 loadingDialog = null;
	 }
	 
	 function onViewSubmit(event)
	 {
		 if(!submittingForm)
		 {
			 addModelListeners();
			 model.submit(getViewData());
		 }
	 }
	 
	 function onModelSubmitting(event)
	 {
		 submittingForm = true;
		 addLoadingDialog();
	 }
	 
	 function onModelSubmitted(event)
	 {
		 submittingForm = false;
		 removeModelListeners(); 
		 removeLoadingDialog();
	 }
	 
	 function onModelSubmitionFailed(event)
	 {
		 submittingForm = false;
		 removeModelListeners();
		 removeLoadingDialog();
	 }
};

barmatz.forms.FormController.prototype = new barmatz.mvc.Controller();
barmatz.forms.FormController.prototype.constructor = barmatz.forms.FormController;

Object.defineProperties(barmatz.forms.FormController.prototype, {});
/** barmatz.forms.FormModel **/
window.barmatz.forms.FormModel = function()
{
	barmatz.forms.CollectionModel.call(this);
	this.set('id', '');
	this.set('name', '');
	this.set('submitButtonLabel', 'Submit');
	this.set('method', barmatz.forms.Methods.GET);
	this.set('encoding', barmatz.net.Encoding.FORM);
	this.set('created', null);
	this.set('fingerprint', null);
};

barmatz.forms.FormModel.prototype = new barmatz.forms.CollectionModel();
barmatz.forms.FormModel.prototype.constructor = barmatz.forms.FormModel;

Object.defineProperties(barmatz.forms.FormModel.prototype, 
{
	name: {get: function()
	{
		return this.get('name');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		this.set('name', value);
	}},
	submitButtonLabel: {get: function()
	{
		return this.get('submitButtonLabel');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		this.set('submitButtonLabel', value);
	}},
	method: {get: function()
	{
		return this.get('method');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		this.set('method', value);
	}},
	encoding: {get: function()
	{
		return this.get('encoding');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		this.set('encoding', value);
	}},
	created: {get: function()
	{
		return this.get('created');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isInstanceOf(value, Date);
		this.set('created', value);
	}},
	fingerprint: {get: function()
	{
		return this.get('fingerprint');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');

		if(!this.fingerprint)
			this.set('fingerprint', value);
	}},
	addItem: {value: function(item)
	{
		barmatz.utils.DataTypes.isNotUndefined(item);
		barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.FieldModel);
		barmatz.forms.CollectionModel.prototype.addItem.call(this, item);
	}},
	addItemAt: {value: function(item, index)
	{
		barmatz.utils.DataTypes.isNotUndefined(item);
		barmatz.utils.DataTypes.isNotUndefined(index);
		barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.FieldModel);
		barmatz.utils.DataTypes.isTypeOf(index, 'number');
		barmatz.forms.CollectionModel.prototype.addItemAt.call(this, item, index);
	}},
	removeItem: {value: function(item)
	{
		barmatz.utils.DataTypes.isNotUndefined(item);
		barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.FieldModel);
		barmatz.forms.CollectionModel.prototype.removeItem.call(this, item);
	}},
	getItemIndex: {value: function(item)
	{
		barmatz.utils.DataTypes.isNotUndefined(item);
		barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.FieldModel);
		return barmatz.forms.CollectionModel.prototype.getItemIndex.call(this, item);
	}},
	setItemIndex: {value: function(item, index)
	{
		barmatz.utils.DataTypes.isNotUndefined(item);
		barmatz.utils.DataTypes.isNotUndefined(index);
		barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.FieldModel);
		barmatz.utils.DataTypes.isTypeOf(index, 'number');
		return barmatz.forms.CollectionModel.prototype.setItemIndex.call(this, item, index);
	}},
	toHTML: {value: function()
	{
		var fields = '';
		
		this.forEach(function(item, index, collection)
		{
			fields += item.toHTML();
		});
		
		return '<link rel="stylesheet" type="text/css" href="http://www.quiz.co.il/css/form.css"/>' +
			   '<div class="forms-form-wrapper">' +
				   '<form onsubmit="return false;">' + 
					   fields + 
					   '<div class="forms-form-item forms-form-submit">' +
					   		'<input type="submit" value="' + this.submitButtonLabel + '"/>' +
					   '</div>' +
				   '</form>' +
			   '</div>';
	}},
	toJSON: {value: function()
	{
		var object = {name: this.name, submitButtonLabel: this.submitButtonLabel, method: this.method, encoding: this.encoding, created: this.created ? this.created.valueOf() : NaN, fingerprint: this.fingerprint, fields: []};
		
		this.forEach(function(item, index, collection)
		{
			var field = {type: item.type};
			
			if(item instanceof barmatz.forms.fields.FieldModel)
			{
				field.name = item.name;
				field.label = item.label;
				field.mandatory = item.mandatory;
				field.enabled = item.enabled;
			}
			
			if(item instanceof barmatz.forms.fields.FileFieldModel)
				field.accept = item.accept;

			if(item instanceof barmatz.forms.fields.TextFieldModel)
				field.max = item.max;
			
			if(item instanceof barmatz.forms.fields.TextAreaFieldModel)
			{
				field.rows = item.rows;
				field.cols = item.cols;
			}
			
			if(item instanceof barmatz.forms.fields.CheckboxFieldModel)
				field.checked = item.checked;
			
			object.fields.push(field);
		});
		
		return JSON.stringify(object);
	}},
	reset: {value: function()
	{
		this.set('id', '');
		this.set('name', '');
		this.set('method', barmatz.forms.Methods.GET);
		this.set('encoding', barmatz.net.Encoding.FORM);
		this.set('created', null);
		this.set('fingerprint', null);
		while(this.numItems > 0)
			this.removeItemAt(this.numItems - 1);
	}},
	save: {value: function(model)
	{
		var _this = this, request, loader;

		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.users.UserModel);
		
		this.dispatchEvent(new barmatz.events.FormModelEvent(barmatz.events.FormModelEvent.SAVING));

		request = new barmatz.net.Request('http://quiz.co.il/api/form/save.php');
		request.method = barmatz.net.Methods.POST;
		request.data = {f: this.fingerprint || null, n: this.name, d: this.toJSON()};
		loader = new barmatz.net.Loader();
		loader.addEventListener(barmatz.events.LoaderEvent.DONE, onLoaderDone);
		loader.load(request);
		
		function onLoaderDone(event)
		{
			var response, data;
			
			barmatz.utils.DataTypes.isNotUndefined(event);
			barmatz.utils.DataTypes.isInstanceOf(event, barmatz.events.LoaderEvent);
			
			event.target.removeEventListener(barmatz.events.LoaderEvent.DONE, onLoaderDone);
			
			response = event.response;
			
			if(response && response.status == 200)
			{
				data = response.data ? JSON.parse(response.data) : null;
				
				if(data && data.fingerprint)
					_this.set('fingerprint', data.fingerprint);
				
				_this.dispatchEvent(new barmatz.events.FormModelEvent(barmatz.events.FormModelEvent.SAVED));
			}
			else
				_this.dispatchEvent(new barmatz.events.FormModelEvent(barmatz.events.FormModelEvent.ERROR_SAVING));
		}
	}},
	saveAs: {value: function(model, name)
	{
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.users.UserModel);
		barmatz.utils.DataTypes.isNotUndefined(name);
		barmatz.utils.DataTypes.isTypeOf(name, 'string');
		this.set('id', null);
		this.set('name', name);
		this.save(model);
	}},
	loadByFingerprint: {value: function(fingerprint)
	{
		var _this, request, loader;
		
		barmatz.utils.DataTypes.isNotUndefined(fingerprint);	
		barmatz.utils.DataTypes.isTypeOf(fingerprint, 'string');
		
		_this = this;
		
		this.dispatchEvent(new barmatz.events.FormModelEvent(barmatz.events.FormModelEvent.LOADING_FORM));
		
		request = new barmatz.net.Request('http://quiz.co.il/api/form.php');
		request.method = barmatz.net.Methods.GET;
		request.data = {f: fingerprint};
		
		loader = new barmatz.net.Loader();
		loader.addEventListener(barmatz.events.LoaderEvent.DONE, onLoaderDone);
		loader.load(request);
		
		function parseFieldsData(data)
		{
			var field, name;
			
			while(_this.numItems > 0)
				_this.removeItemAt(_this.numItems);
			
			for(i in data)
			{
				name = data[i].name;
				
				switch(data[i].type)
				{
					default:
						throw new Error('Unknown type');
						break;
					case barmatz.forms.fields.FieldTypes.TEXT_AREA:
						field = new barmatz.forms.fields.TextAreaFieldModel(name);
						break;
					case barmatz.forms.fields.FieldTypes.TEXT_FIELD:
						field = new barmatz.forms.fields.TextFieldModel(name);
						break;
					case barmatz.forms.fields.FieldTypes.DROPBOX:
						field = new barmatz.forms.fields.DropboxModel(name);
						break;
					case barmatz.forms.fields.FieldTypes.PASSWORD:
						field = new barmatz.forms.fields.PasswordFieldModel(name);
						break;
					case barmatz.forms.fields.FieldTypes.CHECKBOX:
						field = new barmatz.forms.fields.CheckboxFieldModel(name);
						break;
					case barmatz.forms.fields.FieldTypes.RADIO:
						field = new barmatz.forms.fields.RadioFieldModel(name);
						break;
					case barmatz.forms.fields.FieldTypes.FILE:
						field = new barmatz.forms.fields.FileFieldModel(name);
						break;
					case barmatz.forms.fields.FieldTypes.HIDDEN:
						field = new barmatz.forms.fields.HiddenFieldModel(name);
						break;
				}
				
				if(field instanceof barmatz.forms.fields.FieldModel)
				{
					field.label = data[i].label;
					field.mandatory = data[i].mandatory;
					field.enabled = data[i].enabled;
				}
				
				if(field instanceof barmatz.forms.fields.FileFieldModel)
					field.accept = data[i].accept;

				if(field instanceof barmatz.forms.fields.TextFieldModel)
					field.max = parseInt(data[i].max);
				
				if(field instanceof barmatz.forms.fields.CheckboxFieldModel)
					field.checked = data[i].checked;
				
				_this.addItem(field);
			}
		}
		
		function onLoaderDone(event)
		{
			var response, data, parsedData;

			barmatz.utils.DataTypes.isNotUndefined(event);
			barmatz.utils.DataTypes.isInstanceOf(event, barmatz.events.LoaderEvent);
			event.target.addEventListener(barmatz.events.LoaderEvent.DONE, onLoaderDone);
			
			response = event.response;
			
			if(response && response.status == 200)
			{
				data = response.data ? JSON.parse(response.data) : null;
				
				if(data)
				{
					_this.set('fingerprint', data.fingerprint);
					
					data = data.data;
					
					_this.name = data.name;
					_this.submitButtonLabel = data.submitButtonLabel;
					_this.created = new Date(data.created);
					_this.method = data.method;
					_this.encoding = data.encoding;
					parseFieldsData(data.fields);
					_this.dispatchEvent(new barmatz.events.FormModelEvent(barmatz.events.FormModelEvent.LOADING_FORM_COMPLETE));
				}
				else
					_this.dispatchEvent(new barmatz.events.FormModelEvent(barmatz.events.FormModelEvent.LOADING_FORM_ERROR));
			}
			else
				_this.dispatchEvent(new barmatz.events.FormModelEvent(barmatz.events.FormModelEvent.LOADING_FORM_ERROR));
		}
	}},
	delete: {value: function()
	{
		var _this, request, loader;
		
		_this = this;
		
		this.dispatchEvent(new barmatz.events.FormModelEvent(barmatz.events.FormModelEvent.DELETING));

		request = new barmatz.net.Request('http://quiz.co.il/api/form/delete.php');
		request.method = barmatz.net.Methods.POST;
		request.data = {f: this.fingerprint};
		
		loader = new barmatz.net.Loader();
		loader.addEventListener(barmatz.events.LoaderEvent.DONE, onLoaderDone);
		loader.load(request);
		
		function onLoaderDone(event)
		{
			var response;

			barmatz.utils.DataTypes.isNotUndefined(event);
			barmatz.utils.DataTypes.isInstanceOf(event, barmatz.events.LoaderEvent);
			event.target.removeEventListener(barmatz.events.LoaderEvent.DONE, onLoaderDone);
			
			response = event.response;
			
			if(response && response.status == 200)
				_this.dispatchEvent(new barmatz.events.FormModelEvent(barmatz.events.FormModelEvent.DELETED));
			else
				_this.dispatchEvent(new barmatz.events.FormModelEvent(barmatz.events.FormModelEvent.DELETION_FAIL));
		}
	}},
	submit: {value: function(data)
	{
		var _this, request, loader;
		
		barmatz.utils.DataTypes.isNotUndefined(data);
		barmatz.utils.DataTypes.isTypeOf(data, 'object');
		
		_this = this;
		
		_this.dispatchEvent(new barmatz.events.FormModelEvent(barmatz.events.FormModelEvent.SUBMITTING));

		request = new barmatz.net.Request('http://www.quiz.co.il/api/form/submit.php');
		request.method = this.method;
		request.data = {f: this.fingerprint, d: JSON.stringify(data)};
		request.headers = [new barmatz.net.RequestHeader('Content-Type', this.encoding)];
		
		loader = new barmatz.net.Loader();
		loader.addEventListener(barmatz.events.LoaderEvent.DONE, onLoaderDone);
		loader.load(request);
		
		function onLoaderDone(event)
		{
			var response;
			
			barmatz.utils.DataTypes.isNotUndefined(event);
			barmatz.utils.DataTypes.isInstanceOf(event, barmatz.events.LoaderEvent);
			event.target.removeEventListener(barmatz.events.LoaderEvent.DONE, onLoaderDone);
			
			response = event.response;
			
			if(response && response.status == 200)
				_this.dispatchEvent(new barmatz.events.FormModelEvent(barmatz.events.FormModelEvent.SUBMITTED));
			else
				_this.dispatchEvent(new barmatz.events.FormModelEvent(barmatz.events.FormModelEvent.SUBMITION_FAILED));
			
		}
	}}
});
/** barmatz.forms.Methods **/
window.barmatz.forms.Methods = function(){};

Object.defineProperties(barmatz.forms.Methods,
{
	GET: {value: 'GET'},
	POST: {value: 'POST'}
});
/** barmatz.forms.TypeModel **/
window.barmatz.forms.TypeModel = function(type)
{
	barmatz.utils.DataTypes.isNotUndefined(type);
	barmatz.utils.DataTypes.isTypeOf(type, 'string', true);
	barmatz.mvc.Model.call(this);
	this.set('type', type);
};

barmatz.forms.TypeModel.prototype = new barmatz.mvc.Model();
barmatz.forms.TypeModel.prototype.constructor = barmatz.forms.TypeModel;

Object.defineProperties(barmatz.forms.TypeModel.prototype, 
{
	type: {get: function()
	{
		return this.get('type');
	}}
});
/** barmatz.forms.factories.ControllerFactory **/
window.barmatz.forms.factories.ControllerFactory = function(){};

Object.defineProperties(barmatz.forms.factories.ControllerFactory,
{
	createLoginController: {value: function(model, userNameFieldView, passwordFieldView, submitButtonView, errorFieldView)
	{
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isNotUndefined(userNameFieldView);
		barmatz.utils.DataTypes.isNotUndefined(passwordFieldView);
		barmatz.utils.DataTypes.isNotUndefined(submitButtonView);
		barmatz.utils.DataTypes.isNotUndefined(errorFieldView);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.users.UserModel);
		barmatz.utils.DataTypes.isInstanceOf(userNameFieldView, HTMLElement);
		barmatz.utils.DataTypes.isInstanceOf(passwordFieldView, HTMLElement);
		barmatz.utils.DataTypes.isInstanceOf(submitButtonView, HTMLElement);
		barmatz.utils.DataTypes.isInstanceOf(errorFieldView, HTMLElement);
		return new barmatz.forms.users.LogingController(model, userNameFieldView, passwordFieldView, submitButtonView, errorFieldView);
	}},
	createToolboxController: {value: function(model, view)
	{
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isNotUndefined(view);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.CollectionModel);
		barmatz.utils.DataTypes.isInstanceOf(view, HTMLElement);
		return new barmatz.forms.ui.ToolboxController(model, view);
	}},
	createWorkspaceController: {value: function(model, view)
	{
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isNotUndefined(view);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.CollectionModel);
		barmatz.utils.DataTypes.isInstanceOf(view, HTMLElement);
		return new barmatz.forms.ui.WorkspaceController(model, view);
	}},
	createPropertiesController: {value: function(view)
	{
		barmatz.utils.DataTypes.isNotUndefined(view);
		barmatz.utils.DataTypes.isInstanceOf(view, HTMLElement);
		return new barmatz.forms.ui.PropertiesController(view);
	}},
	createBuilderController: {value: function(formModel, userModel, containerView, panelsView, formNameView, saveStatusView, menuModel, menuView, toolboxModel, toolboxView, workspaceView, propertiesController)
	{
		barmatz.utils.DataTypes.isNotUndefined(formModel);
		barmatz.utils.DataTypes.isNotUndefined(userModel);
		barmatz.utils.DataTypes.isNotUndefined(containerView);
		barmatz.utils.DataTypes.isNotUndefined(panelsView);
		barmatz.utils.DataTypes.isNotUndefined(formNameView);
		barmatz.utils.DataTypes.isNotUndefined(saveStatusView);
		barmatz.utils.DataTypes.isNotUndefined(menuModel);
		barmatz.utils.DataTypes.isNotUndefined(menuView);
		barmatz.utils.DataTypes.isNotUndefined(toolboxModel);
		barmatz.utils.DataTypes.isNotUndefined(toolboxView);
		barmatz.utils.DataTypes.isNotUndefined(workspaceView);
		barmatz.utils.DataTypes.isNotUndefined(propertiesController);
		barmatz.utils.DataTypes.isInstanceOf(formModel, barmatz.forms.FormModel);
		barmatz.utils.DataTypes.isInstanceOf(userModel, barmatz.forms.users.UserModel);
		barmatz.utils.DataTypes.isInstanceOf(containerView, HTMLElement);
		barmatz.utils.DataTypes.isInstanceOf(panelsView, HTMLElement);
		barmatz.utils.DataTypes.isInstanceOf(formNameView, HTMLElement);
		barmatz.utils.DataTypes.isInstanceOf(saveStatusView, HTMLElement);
		barmatz.utils.DataTypes.isInstanceOf(menuModel, barmatz.forms.ui.MenuModel);
		barmatz.utils.DataTypes.isInstanceOf(menuView, HTMLElement);
		barmatz.utils.DataTypes.isInstanceOf(toolboxModel, barmatz.forms.ui.ToolboxModel);
		barmatz.utils.DataTypes.isInstanceOf(toolboxView, HTMLElement);
		barmatz.utils.DataTypes.isInstanceOf(workspaceView, HTMLElement);
		barmatz.utils.DataTypes.isInstanceOf(propertiesController, barmatz.forms.ui.PropertiesController);
		return new barmatz.forms.ui.BuilderController(formModel, userModel, containerView, panelsView, formNameView, saveStatusView, menuModel, menuView, toolboxModel, toolboxView, workspaceView, propertiesController);
	}},
	createWorkspaceItemController: {value: function(model, labelView, fieldView, mandatoryView, deleteButtonView)
	{
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isNotUndefined(labelView);
		barmatz.utils.DataTypes.isNotUndefined(fieldView);
		barmatz.utils.DataTypes.isNotUndefined(mandatoryView);
		barmatz.utils.DataTypes.isNotUndefined(deleteButtonView);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.FieldModel);
		barmatz.utils.DataTypes.isInstanceOf(labelView, HTMLElement);
		barmatz.utils.DataTypes.isInstanceOf(fieldView, HTMLElement);
		barmatz.utils.DataTypes.isInstanceOf(mandatoryView, HTMLElement);
		barmatz.utils.DataTypes.isInstanceOf(deleteButtonView, HTMLElement);
		return new barmatz.forms.ui.WorkspaceItemController(model, labelView, fieldView, mandatoryView, deleteButtonView);
	}},
	createNewFieldDialogController: {value: function(model, view, nameFieldView, labelFieldView)
	{
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isNotUndefined(view);
		barmatz.utils.DataTypes.isNotUndefined(nameFieldView);
		barmatz.utils.DataTypes.isNotUndefined(labelFieldView);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.mvc.Model);
		barmatz.utils.DataTypes.isInstanceOf(view, HTMLElement);
		barmatz.utils.DataTypes.isInstanceOf(nameFieldView, HTMLInputElement);
		barmatz.utils.DataTypes.isInstanceOf(labelFieldView, HTMLInputElement);
		return new barmatz.forms.ui.NewFieldDialogController(model, view, nameFieldView, labelFieldView);
	}},
	createMenuController: {value: function(model, iconView, itemsView)
	{
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isNotUndefined(iconView);
		barmatz.utils.DataTypes.isNotUndefined(itemsView);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.ui.MenuModel);
		barmatz.utils.DataTypes.isInstanceOf(iconView, HTMLElement);
		barmatz.utils.DataTypes.isInstanceOf(itemsView, HTMLElement);
		return new barmatz.forms.ui.MenuController(model, iconView, itemsView);
	}},
	createUserFormsListController: {value: function(formModel, userModel, view, dialogView)
	{
		barmatz.utils.DataTypes.isNotUndefined(formModel);
		barmatz.utils.DataTypes.isNotUndefined(userModel);
		barmatz.utils.DataTypes.isNotUndefined(view);
		barmatz.utils.DataTypes.isNotUndefined(dialogView);
		barmatz.utils.DataTypes.isInstanceOf(formModel, barmatz.forms.FormModel);
		barmatz.utils.DataTypes.isInstanceOf(userModel, barmatz.forms.users.UserModel);
		barmatz.utils.DataTypes.isInstanceOf(view, HTMLElement);
		barmatz.utils.DataTypes.isInstanceOf(dialogView, HTMLElement);
		return new barmatz.forms.ui.UserFormsListController(formModel, userModel, view, dialogView);
	}},
	createUserFormsListItemController: {value: function(model, view, nameView, createdView, fingerprintView)
	{
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isNotUndefined(view);
		barmatz.utils.DataTypes.isNotUndefined(nameView);
		barmatz.utils.DataTypes.isNotUndefined(createdView);
		barmatz.utils.DataTypes.isNotUndefined(fingerprintView);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.FormModel);
		barmatz.utils.DataTypes.isInstanceOf(view, HTMLElement);
		barmatz.utils.DataTypes.isInstanceOf(nameView, HTMLElement);
		barmatz.utils.DataTypes.isInstanceOf(createdView, HTMLElement);
		barmatz.utils.DataTypes.isInstanceOf(fingerprintView, HTMLElement);
		return new barmatz.forms.ui.UserFormsListItemController(model, view, nameView, createdView, fingerprintView);
	}},
	createCollectionDialogController: {value: function(model, view)
	{
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isNotUndefined(view);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.CollectionModel);
		barmatz.utils.DataTypes.isInstanceOf(view, HTMLTableElement);
		return new barmatz.forms.ui.CollectionDialogController(model, view);
	}},
	createFormController: {value: function(model, view)
	{
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isNotUndefined(view);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.FormModel);
		barmatz.utils.DataTypes.isInstanceOf(view, HTMLFormElement);
		return new barmatz.forms.FormController(model, view);
	}}
});
/** barmatz.forms.factories.DOMFactory **/
window.barmatz.forms.factories.DOMFactory = function(){};

Object.defineProperties(barmatz.forms.factories.DOMFactory,
{
	BODY_ELEMENT: {get: function()
	{
		if(!this._bodyElement)
			this._bodyElement = document.getElementsByTagName('body')[0];
		return this._bodyElement;
	}},
	createElement: {value: function(tagName, className)
	{
		var element;
		
		barmatz.utils.DataTypes.isNotUndefined(tagName);
		barmatz.utils.DataTypes.isTypeOf(tagName, 'string');
		barmatz.utils.DataTypes.isTypeOf(className, 'string', true);
		
		element = document.createElement(tagName);
		
		if(className)
			element.className = className;
		
		return element;
	}},
	createElementWithContent: {value: function(tagName, className, content, appendChildWrapper)
	{
		var _this, element;
		
		barmatz.utils.DataTypes.isNotUndefined(tagName);
		barmatz.utils.DataTypes.isTypeOf(tagName, 'string');
		barmatz.utils.DataTypes.isTypeOf(className, 'string', true);
		barmatz.utils.DataTypes.isTypesOrInstances(content, ['string'], [HTMLElement, Array]);
		barmatz.utils.DataTypes.isTypeOf(appendChildWrapper, 'function', true);
		
		_this = this;
		element = this.createElement(tagName, className);
		addContent(content, element);
		
		return element;
		
		function addContent(content, parent, wrapperTag)
		{
			var i;
			
			if(barmatz.utils.DataTypes.applySilent('isTypeOf', content, 'string'))
			{
				if(wrapperTag)
					parent.appendChild(_this.createElementWithContent(wrapperTag, '', content));
				else
					parent.innerHTML = content;
			}
			else if(barmatz.utils.DataTypes.applySilent('isInstanceOf', content, HTMLElement))
				parent.appendChild(appendChildWrapper != null ? appendChildWrapper(content) : content);
			else if(barmatz.utils.DataTypes.applySilent('isInstanceOf', content, Array))
			{
				for(i in content)
					addContent(content[i], parent, 'span');
			}
		}
	}},
	createDropboxElement: {value: function(model, selectedIndex)
	{
		var _this, dropbox;
		
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.DropboxModel);
		barmatz.utils.DataTypes.isTypeOf(selectedIndex, 'number', true);
		
		_this = this;
		dropbox = this.createElement('select');
		
		model.forEach(function(item, index, collection)
		{
			var option =_this.createElementWithContent('option', '', item.label);
			option.value = item.value;
			dropbox.appendChild(option);
		});
		
		if(selectedIndex)
			dropbox.selectedIndex = selectedIndex;
		
		return dropbox;
	}},
	createFormFieldElement: {value: function(model)
	{
		var field, key;
		
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.FieldModel);
		field = this.createElement(getElementTagName(model.type));
		
		if(field.tagName.toLowerCase() == 'input')
			field.type = model.type;
		
		for(key in model)
			if(field.hasOwnProperty(key))
				field[key] = model[key];
		
		return field;
		
		function getElementTagName(type)
		{
			switch(type)
			{
				case barmatz.forms.fields.FieldTypes.TEXT_FIELD:
				case barmatz.forms.fields.FieldTypes.PASSWORD:
				case barmatz.forms.fields.FieldTypes.CHECKBOX:
				case barmatz.forms.fields.FieldTypes.RADIO:
				case barmatz.forms.fields.FieldTypes.FILE:
				case barmatz.forms.fields.FieldTypes.HIDDEN:
					return 'input';
					break;
				case barmatz.forms.fields.FieldTypes.TEXT_AREA:
					return 'textarea';
					break;
				case barmatz.forms.fields.FieldTypes.DROPBOX:
					return 'select';
					break;
			}
		}
	}},
	createFieldWrapper: {value: function(model, className)
	{
		var wrapper, label, field, mandatory;
		
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.FieldModel);
		barmatz.utils.DataTypes.isTypeOf(className, 'string', true);
		
		wrapper = this.createElement('div', className);
		label = wrapper.appendChild(this.createElementWithContent('label', '', model.label ? model.label : ''));
		field = wrapper.appendChild(this.createFormFieldElement(model));
		mandatory = wrapper.appendChild(this.createElementWithContent('span', '', mandatory ? '*' : ''));

		return {wrapper: wrapper, label: label, field: field, mandatory: mandatory};
	}},
	createSubmitButton: {value: function(label, clickHandler)
	{
		var wrapper, button;
		
		barmatz.utils.DataTypes.isNotUndefined(label);
		barmatz.utils.DataTypes.isNotUndefined(clickHandler);
		barmatz.utils.DataTypes.isTypeOf(clickHandler, 'function');
		wrapper = this.createElement('div');
		button = this.createElementWithContent('button', '', label);
		button.addEventListener('click', clickHandler);
		wrapper.appendChild(button);
		
		return wrapper;
	}},
	createToolbox: {value: function()
	{
		return this.createElement('ul');
	}},
	createWorkspaceWrapper: {value: function(formName, saveStatus)
	{
		var formNameElement, saveStatusElement, workspaceElement;
		
		barmatz.utils.DataTypes.isTypeOf(formName, 'string', true);
		barmatz.utils.DataTypes.isTypeOf(saveStatus, 'string', true);
		
		formNameElement = this.createElementWithContent('h1', 'forms-workspace-header-form-name', formName || '');
		saveStatusElement = this.createElementWithContent('h3', 'forms-workspace-header-save-status', saveStatus || '');
		workspaceElement = this.createElement('table', 'forms-workspace-items');

		return {wrapper: this.createElementWithContent('div', 'forms-workspace-wrapper', [this.createElementWithContent('div', 'forms-workspace-header', [formNameElement, saveStatusElement]), workspaceElement]), formName: formNameElement, saveStatus: saveStatusElement, workspace: workspaceElement};
	}},
	createProperties: {value: function()
	{
		return this.createElement('div');
	}},
	createToolboxItem: {value: function(label)
	{
		barmatz.utils.DataTypes.isNotUndefined(label);
		barmatz.utils.DataTypes.isTypeOf(label, 'string');
		return this.createElementWithContent('li', 'forms-toolbox-item', label);
	}},
	createWorkspaceItemWrapper: {value: function(model)
	{
		var _this, wrapper, grip, label, field, mandatory, deleteButton;
		
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.FieldModel);
		
		_this = this;
		wrapper = this.createElement('tr', 'forms-workspace-item');
		grip = this.createElement('span', 'forms-grip ui-icon ui-icon-grip-solid-vertical');
		label = this.createElementWithContent('label', '', model.label ? model.label : '');
		field = this.createFormFieldElement(model);
		mandatory = this.createElementWithContent('span', 'forms-workspace-item-mandatory', mandatory ? '*' : '');
		deleteButton = this.createIconButton('circle-close');
		
		addToWrapper('forms-workspace-item-grip', grip);
		addToWrapper('forms-workspace-item-label', label);
		addToWrapper('forms-workspace-item-field', [field, mandatory]);
		addToWrapper('forms-workspace-item-delete-button', deleteButton);
		
		return {wrapper: wrapper, label: label, field: field, mandatory: mandatory, deleteButton: deleteButton};
		
		function addToWrapper(className, content)
		{
			barmatz.utils.DataTypes.isNotUndefined(className);
			barmatz.utils.DataTypes.isNotUndefined(content);
			barmatz.utils.DataTypes.isTypeOf(className, 'string');
			wrapper.appendChild(_this.createElementWithContent('td', className, content));
		}
	}},
	createPropertiesItemWarpper: {value: function(model)
	{
		var _this, returnWrapper, wrapper;
		
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.FieldModel);
		
		_this = this;
		returnWrapper = {};
		
		wrapper = this.createElement('div');
		wrapper.appendChild(this.createElementWithContent('h2', 'forms-header', barmatz.utils.String.firstLetterToUpperCase(model.type) + ' field'));
		
		returnWrapper.wrapper = wrapper;
		
		if(model instanceof barmatz.forms.fields.FieldModel)
		{
			returnWrapper.nameField = addFieldToWrapper('string', 'name', 'name', model.name);
			returnWrapper.labelField = addFieldToWrapper('string', 'label', 'label', model.label);
			returnWrapper.mandatoryField = addFieldToWrapper('boolean', 'mandatory', 'mandatory', model.mandatory);
			returnWrapper.enabledField = addFieldToWrapper('boolean', 'enabled', 'enabled', model.enabled);
		}
		
		if(model instanceof barmatz.forms.fields.FileFieldModel)
			returnWrapper.acceptField = addFieldToWrapper('array', 'accept', 'accept', model.accept);

		if(model instanceof barmatz.forms.fields.TextFieldModel)
			returnWrapper.maxField = addFieldToWrapper('number', 'max', 'max', model.max);
		
		if(model instanceof barmatz.forms.fields.TextAreaFieldModel)
		{
			returnWrapper.rowsField = addFieldToWrapper('number', 'rows', 'rows', model.rows);
			returnWrapper.colsField = addFieldToWrapper('number', 'cols', 'columns', model.cols);
		}
		
		if(model instanceof barmatz.forms.fields.CheckboxFieldModel)
			returnWrapper.checkedField = addFieldToWrapper('boolean', 'checked', 'checked', model.checked);
		
		if(model instanceof barmatz.forms.fields.DropboxModel)
		{
			returnWrapper.multipleField = addFieldToWrapper('boolean', 'multiple', 'multiple', model.multiple);
			returnWrapper.itemsField = addFieldToWrapper('array', 'items', 'items', ['add item...']);
			returnWrapper.itemsField.selectedIndex = null;
		}
		
		return returnWrapper;
		
		function addFieldToWrapper(type, name, label, value)
		{
			var fieldWrapper;
			
			barmatz.utils.DataTypes.isNotUndefined(type);
			barmatz.utils.DataTypes.isNotUndefined(name);
			barmatz.utils.DataTypes.isNotUndefined(label);
			barmatz.utils.DataTypes.isNotUndefined(value);
			barmatz.utils.DataTypes.isTypeOf(type, 'string');
			barmatz.utils.DataTypes.isTypeOf(name, 'string');
			barmatz.utils.DataTypes.isTypeOf(label, 'string');

			fieldWrapper = _this.createPropertiesItemFieldWrapper(type, name, label, value, onFieldValueChange);
			wrapper.appendChild(fieldWrapper.wrapper);
			return fieldWrapper.field;
		}
		
		function onFieldValueChange(event)
		{
			barmatz.utils.DataTypes.isNotUndefined(event);
			barmatz.utils.DataTypes.isInstanceOf(event, Event);

			try
			{
				assignString();
			}
			catch(error)
			{
				try
				{
					assignArray();
				}
				catch(error)
				{
					try
					{
						assignBoolean();
					}
					catch(error)
					{
						assignNumber();
					}
				}
			}
			
			function assignString()
			{
				model[event.target.name] = event.target.value;
			}
			
			function assignArray()
			{
				model[event.target.name] = event.target.value.replace(/(^\s+|(,)\s+|\s+$)/g, '$2').split(',');
			}
			
			function assignBoolean()
			{
				model[event.target.name] = event.target.value == true || event.target.value == 'true' ? true : false;
			}
			
			function assignNumber()
			{
				model[event.target.name] = parseFloat(event.target.value);
			}
		}
	}},
	createPropertiesItemFieldWrapper: {value: function(type, name, label, value, changeHandler)
	{
		var field, i;
		
		barmatz.utils.DataTypes.isNotUndefined(type);
		barmatz.utils.DataTypes.isNotUndefined(name);
		barmatz.utils.DataTypes.isNotUndefined(label);
		barmatz.utils.DataTypes.isNotUndefined(value);
		barmatz.utils.DataTypes.isNotUndefined(changeHandler);
		barmatz.utils.DataTypes.isTypeOf(type, 'string');
		barmatz.utils.DataTypes.isTypeOf(name, 'string');
		barmatz.utils.DataTypes.isTypeOf(label, 'string');
		barmatz.utils.DataTypes.isTypeOf(changeHandler, 'function');
		
		switch(type)
		{
			default:
				throw new Error('unknown type');
				break;
			case 'string':
			case 'number':
				field = this.createElement('input');
				field.type = 'text';
				switch(type)
				{
					case 'string':
						field.value = value == 'NaN' ? '' : value;
						break;
					case 'number':
						field.value = isNaN(value) ? '' : value;
						break;
					case 'array':
						field.value = value.join(', ');
						break;
				}
				break;
			case 'array':
				field = this.createElement('select');
				
				for(i in value)
					field.appendChild(this.createElement('option')).innerHTML = value[i];
				break;
			case 'boolean':
				field = this.createDropboxElement(barmatz.forms.factories.ModelFactory.createDropboxModel(name, [
					barmatz.forms.factories.ModelFactory.createDropboxItemModel('No', false),
					barmatz.forms.factories.ModelFactory.createDropboxItemModel('Yes', true)
				]), value ? 1 : 0);
				break;
		}
		
		field.name = name;
		field.addEventListener('change', changeHandler);

		return {wrapper: this.createElementWithContent('div', 'forms-item', [this.createElementWithContent('label', '', label), field]), field: field};
	}},
	createDialog: {value: function(title, content, open, container)
	{
		var dialog;
		
		barmatz.utils.DataTypes.isNotUndefined(title);
		barmatz.utils.DataTypes.isNotUndefined(content);
		barmatz.utils.DataTypes.isTypeOf(title, 'string');
		barmatz.utils.DataTypes.isTypesOrInstances(content, ['string'], [HTMLElement, Array]);
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		barmatz.utils.DataTypes.isInstanceOf(container, HTMLElement, true);
		
		dialog = this.createElementWithContent('div', 'forms-dialog', content);
		dialog.title = title;
		(container || this.BODY_ELEMENT).appendChild(dialog);
		jQuery(dialog).dialog({autoOpen: open || false, draggable: false, modal: true});
		return dialog;
	}},
	destroyDialog: {value: function(dialog)
	{
		jQuery(dialog).dialog('destroy');
		dialog.parentElement.removeChild(dialog);
	}},
	createNewFieldDialogWrapper: {value: function()
	{
		var _this, dialog, nameField, labelField, wrapper, form, formTableOptions;
		
		_this = this;
		nameField = getField();
		labelField = getField();
		
		formTableOptions = new barmatz.forms.ui.TableOptions();
		formTableOptions.bodyRows.push(getRowContent('Name', nameField));
		formTableOptions.bodyRows.push(getRowContent('Label', labelField));
		
		form = this.createTable(formTableOptions);
		wrapper = this.createElementWithContent('div', '', form);
		dialog = this.createDialog('New Field', wrapper);
		
		jQuery(dialog).dialog({
			closeOnEscape: false,
			dialogClass: 'forms-dialog-prompt'
		});
		
		return {wrapper: dialog, nameField: nameField, labelField: labelField};
		
		function getRowContent(label, field)
		{
			barmatz.utils.DataTypes.isNotUndefined(label);
			barmatz.utils.DataTypes.isNotUndefined(field);
			barmatz.utils.DataTypes.isTypeOf(label, 'string');
			barmatz.utils.DataTypes.isInstanceOf(field, HTMLElement);
			return [_this.createElementWithContent('label', '', label), field];
		}
		
		function getField()
		{
			var field = _this.createElement('input');
			field.type = 'text';
			return field;
		}
	}},
	createPromptDialog: {value: function(title, content, confirmHandler, open)
	{
		var _this, dialog;

		barmatz.utils.DataTypes.isNotUndefined(title);
		barmatz.utils.DataTypes.isNotUndefined(content);
		barmatz.utils.DataTypes.isNotUndefined(confirmHandler);
		barmatz.utils.DataTypes.isTypeOf(title, 'string');
		barmatz.utils.DataTypes.isTypesOrInstances(content, ['string'], [HTMLElement, Array]);
		barmatz.utils.DataTypes.isTypeOf(confirmHandler, 'function');
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		
		_this = this;
		dialog = this.createDialog(title, content, open);
		
		jQuery(dialog).dialog({
			buttons: {OK: onOKButtonClick, Cancel: onCancelButtonClick}
		});
		
		return dialog;
		
		function onOKButtonClick(event)
		{
			_this.destroyDialog(dialog);
			confirmHandler(event);
		}
		
		function onCancelButtonClick()
		{
			_this.destroyDialog(dialog);
		}
	}},
	createExportPromptDialog: {value: function(fingerprint, open)
	{
		var dir, embedCode, textarea;
		
		barmatz.utils.DataTypes.isNotUndefined(fingerprint);
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		
		dir = location.href.replace(location.hash, '').replace(location.search, '').replace(/(^\w+:\/\/.+)\/.+\..+$/, '$1') + '/js'; 
		embedCode = "<div name=\"formContainer\" fingerprint=\"" + fingerprint + "\">Loading...</div>" +
					"<script type=\"text/javascript\">" +
					"(function(w,d)" +
					"{" +
						"w.barmatz && w.barmatz.forms && !w.barmatz.forms.embed" +
						" ? barmatz.forms.embed('" + fingerprint + "')" +
						" : l('" + dir + "/embed.js');" +
						"function l(s)" +
						"{" +
							"a=d.createElement('script');" +
							"a.src=s;" +
							"b=d.getElementsByTagName('script')[0];" +
							"b.parentNode.insertBefore(a,b);" +
						"}" +
					"})(window,document)" +
					"</script>";
		
		textarea = this.createElementWithContent('textarea', 'forms-dialog-export-embedcode', embedCode);
		textarea.readOnly = true;
		textarea.addEventListener('click', function(event)
		{
			event.currentTarget.focus();
			event.currentTarget.select();
		});
		
		return this.createAlertPromptDialog('Export', this.createElementWithContent('div', '', [
			this.createElementWithContent('div', '', 'Copy past this code into your site inside the body tag where you want the form to appear:'),
			textarea
		]), open);
	}},
	createChangePropertyPromptDialog: {value: function(title, key, value, confirmHandler, open)
	{
		var field, wrapper;

		barmatz.utils.DataTypes.isNotUndefined(title);
		barmatz.utils.DataTypes.isNotUndefined(key);
		barmatz.utils.DataTypes.isNotUndefined(value);
		barmatz.utils.DataTypes.isNotUndefined(confirmHandler);
		barmatz.utils.DataTypes.isTypeOf(title, 'string');
		barmatz.utils.DataTypes.isTypeOf(key, 'string');
		barmatz.utils.DataTypes.isTypeOf(confirmHandler, 'function');
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		
		field = this.createElement('input');
		field.type = 'text';
		field.value = value;
		wrapper = this.createElementWithContent('div', '', [this.createElementWithContent('label', '', key), field]);
		return {wrapper: wrapper, dialog: this.createPromptDialog(title, wrapper, confirmHandler, open), field: field};
	}},
	createAlertPromptDialog: {value: function(title, content, open)
	{
		var _this, dialog;
		
		barmatz.utils.DataTypes.isNotUndefined(title);
		barmatz.utils.DataTypes.isNotUndefined(content);
		barmatz.utils.DataTypes.isTypeOf(title, 'string');
		barmatz.utils.DataTypes.isTypesOrInstances(content, ['string'], [HTMLElement, Array]);
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		
		_this = this;
		dialog = this.createDialog(title, content, open);
		
		jQuery(dialog).dialog({
			buttons: {OK: onOKButtonClick}
		});
		
		function onOKButtonClick(event)
		{
			_this.destroyDialog(dialog);
		}
		
		return dialog;
		
	}},
	createConfirmPromptDialog: {value: function(message, confirmHandler, open)
	{
		barmatz.utils.DataTypes.isNotUndefined(message);
		barmatz.utils.DataTypes.isNotUndefined(confirmHandler);
		barmatz.utils.DataTypes.isTypeOf(message, 'string');
		barmatz.utils.DataTypes.isTypeOf(confirmHandler, 'function');
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		return this.createPromptDialog('Confirm', message, confirmHandler, open);
	}},
	createPanels: {value: function(panels)
	{
		var options, model, i; 
		
		barmatz.utils.DataTypes.isNotUndefined(panels);
		barmatz.utils.DataTypes.isInstanceOf(panels, Array);
		
		options = new barmatz.forms.ui.TableOptions();
		options.className = 'forms-wrapper';
		options.bodyRows.push([]);
		
		for(i = 0; i < panels.length; i++)
		{
			model = panels[i];
			options.bodyRows[0].push(model.content);
			options.bodyColumnsClassNames.push(model.className);
		}
		
		return this.createTable(options);
	}},
	createMenuWrapper: {value: function()
	{
		var icon, menu, wrapper;
		icon = this.createMenuIcon();
		menu = this.createMenu();
		wrapper = this.createElementWithContent('div', 'forms-menu', [icon, menu]);
		return {wrapper: wrapper, icon: icon, menu: menu};
	}},
	createMenuIcon: {value: function()
	{
		return this.createIconButton('gear');
	}},
	createMenu: {value: function()
	{
		return this.createElement('ul');
	}},
	createMenuItem: {value: function(model)
	{
		var anchor;

		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.ui.MenuItemModel);

		anchor = this.createElementWithContent('a', '', model.label);
		anchor.href = 'javascript:void(0);';
		anchor.addEventListener('click', model.clickHandler);
		
		return this.createElementWithContent('li', '', anchor);
	}},
	createIconButton: {value: function(name)
	{
		var button;
		
		barmatz.utils.DataTypes.isNotUndefined(name);
		barmatz.utils.DataTypes.isTypeOf(name, 'string');
		
		button = this.createElementWithContent('span', 'ui-icon-wrapper ui-state-default ui-corner-all', this.createElement('span', 'ui-icon ui-icon-' + name));
		jQuery(button).button();
		
		return button;
	}},
	createLoadingDialog: {value: function(container)
	{
		barmatz.utils.DataTypes.isInstanceOf(container, HTMLElement, true);
		return (container || barmatz.forms.factories.DOMFactory.BODY_ELEMENT).appendChild(this.createElement('div', 'loading-image ui-front'));
	}},
	destroyLoadingDialog: {value: function(dialog)
	{
		barmatz.utils.DataTypes.isNotUndefined(dialog);
		barmatz.utils.DataTypes.isInstanceOf(dialog, HTMLElement);
		dialog.parentElement.removeChild(dialog);
	}},
	createLoginFormDialogWrapper: {value: function()
	{
		var _this, dialog, wrapper, wrapperOptions, userNameField, passwordField, errorField;
		
		_this = this;
		wrapperOptions = new barmatz.forms.ui.TableOptions();
		userNameField = addField('username', 'User', 'text');
		passwordField = addField('password', 'Password', 'password');
		wrapper = this.createTable(wrapperOptions);
		errorField = this.createElementWithContent('div', 'forms-error-wrapper ui-state-error ui-corner-all', [this.createElement('span', 'ui-icon ui-icon-alert'), this.createElementWithContent('span', '', 'Username and/or password are incorrect')]);
		dialog = this.createDialog('Login', [wrapper, errorField]);

		jQuery(dialog).dialog({autoOpen: true, dialogClass: 'forms-dialog-prompt', buttons: {Submit: function(){}}});
		
		return {dialog: dialog, userNameField: userNameField, passwordField: passwordField, submitButton: dialog.parentElement.getElementsByTagName('button')[1], errorField: errorField};

		function addField(name, label, type)
		{
			var field;
			
			barmatz.utils.DataTypes.isNotUndefined(name);
			barmatz.utils.DataTypes.isNotUndefined(label);
			barmatz.utils.DataTypes.isNotUndefined(type);
			barmatz.utils.DataTypes.isTypeOf(name, 'string');
			barmatz.utils.DataTypes.isTypeOf(label, 'string');
			barmatz.utils.DataTypes.isTypeOf(type, 'string');
			
			field = _this.createElement('input');
			field.name = name;
			field.type = type;
			wrapperOptions.bodyRows.push([_this.createElementWithContent('label', '', label), field]);
			
			return field;
		}
	}},
	createUserFormsListDialog: {value: function()
	{
		var dialog = this.createDialog('Your forms', this.createUserFormsList());
		jQuery(dialog).dialog({autoOpen: true, dialogClass: 'forms-dialog-user-forms'});
		return dialog;
	}},
	createUserFormsList: {value: function()
	{
		var options = new barmatz.forms.ui.TableOptions();
		options.headColumns.push('Name');
		options.headColumns.push('Created');
		options.headColumns.push('Fingerprint');
		return this.createTable(options);
	}},
	createUserFormsListItem: {value: function(index)
	{
		barmatz.utils.DataTypes.isNotUndefined(index);
		barmatz.utils.DataTypes.isTypeOf(index, 'number');
		return this.createElementWithContent('tr', 'ui-widget ui-state-default ui-corner-all ui-button-text-only ' + (index % 2 == 0 ? 'even' : 'odd'), [this.createElement('td'), this.createElement('td'), this.createElement('td')]);
	}},
	createTable: {value: function(options)
	{
		var _this, content;
		
		barmatz.utils.DataTypes.isNotUndefined(options);
		barmatz.utils.DataTypes.isInstanceOf(options, barmatz.forms.ui.TableOptions);
		
		_this = this;
		content = [];
		
		if(options.headColumns && options.headColumns.length > 0)
			content.push(this.createElementWithContent('thead', options.headClassName, this.createTableRow(options.headColumns, options.headColumnsClassNames, options.headRowClassName, true)));
		
		content.push(this.createElementWithContent('tbody', options.bodyClassName, getBodyRows()));
		
		return this.createElementWithContent('table', options.className, content);
		
		function getBodyRows()
		{
			var rows = [], i;
			
			for(i = 0; i < options.bodyRows.length; i++)
				rows.push(_this.createTableRow(options.bodyRows[i], options.bodyColumnsClassNames, options.bodyRowsClassNames[i % options.bodyRowsClassNames.length]));
			
			return rows;
		}
	}},
	createTableRow: {value: function(content, contentClassNames, className, isHead)
	{
		var columns, i;
		
		barmatz.utils.DataTypes.isNotUndefined(content);
		barmatz.utils.DataTypes.isInstanceOf(content, Array);
		barmatz.utils.DataTypes.isInstanceOf(contentClassNames, Array, true);
		barmatz.utils.DataTypes.isTypeOf(className, 'string', true);
		barmatz.utils.DataTypes.isTypeOf(isHead, 'boolean', true);
		
		columns = [];
		
		for(i = 0; i < content.length; i++)
			columns.push(this.createTableColumn(content[i], contentClassNames[i % contentClassNames.length], isHead)); 
		
		return this.createElementWithContent('tr', className, columns);
	}},
	createTableColumn: {value: function(content, className, isHead)
	{
		barmatz.utils.DataTypes.isNotUndefined(content);
		barmatz.utils.DataTypes.isTypesOrInstances(content, ['string'], [HTMLElement, Array]);
		barmatz.utils.DataTypes.isTypeOf(className, 'string', true);
		barmatz.utils.DataTypes.isTypeOf(isHead, 'boolean', true);
		return this.createElementWithContent(isHead ? 'th' : 'td', className, content);
	}},
	createFormPropertiesDialogWrapper: {value: function(model, confirmHandler, open)
	{
		var properties, dialog;

		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isNotUndefined(confirmHandler);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.FormModel);
		barmatz.utils.DataTypes.isTypeOf(confirmHandler, 'function');
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		
		properties = this.createFormPropertiesWrapper(model);
		dialog = this.createPromptDialog('Properties', properties.wrapper, confirmHandler, open);
		
		jQuery(dialog).dialog({dialogClass: 'forms-dialog-form-properties'});
		
		return {dialog: dialog, nameField: properties.nameField, submitButtonLabelField: properties.submitButtonLabelField, methodField: properties.methodField, encodingField: properties.encodingField};
	}},
	createFormPropertiesWrapper: {value: function(model)
	{
		var _this, options, nameField, methodField, encodingField, submitButtonLabelField;
		
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.FormModel);

		_this = this;
		
		options = new barmatz.forms.ui.TableOptions();
		options.bodyRows = [];
		
		nameField = createField('Name');
		nameField.value = model.name;
		
		submitButtonLabelField = createField('Submit button label');
		submitButtonLabelField.value = model.submitButtonLabel;
		
		methodField = createDropbox('Method', 'formMethod', ['GET', 'POST']);
		methodField.value = model.method;
		
		encodingField = createDropbox('Encoding', 'formEncoding', [barmatz.net.Encoding.FORM, barmatz.net.Encoding.FILES]);
		encodingField.value = model.encoding;
		
		return {wrapper: this.createTable(options), nameField: nameField, submitButtonLabelField: submitButtonLabelField, methodField: methodField, encodingField: encodingField};
		
		function createField(label, content)
		{
			var field, row;
			
			barmatz.utils.DataTypes.isNotUndefined(label);
			barmatz.utils.DataTypes.isTypeOf(label, 'string');
			
			field = content || _this.createElement('input');
			row = [_this.createElementWithContent('label', '', label), field];
			options.bodyRows.push(row);
			return field;
		}
		
		function createDropbox(label, name, values)
		{
			var model, key;
			
			barmatz.utils.DataTypes.isNotUndefined(label);
			barmatz.utils.DataTypes.isNotUndefined(name);
			barmatz.utils.DataTypes.isNotUndefined(values);
			barmatz.utils.DataTypes.isTypeOf(label, 'string');
			barmatz.utils.DataTypes.isTypeOf(name, 'string');
			barmatz.utils.DataTypes.isTypesOrInstances(values, ['object'], [Array]);
			
			model = barmatz.forms.factories.ModelFactory.createDropboxModel(name);
			
			for(key in values)
				model.addItem(barmatz.forms.factories.ModelFactory.createDropboxItemModel(values instanceof Array ? values[key] : key, values[key]));

			return createField(label, _this.createDropboxElement(model));
		}
	}}
});
/** barmatz.forms.factories.ModelFactory **/
window.barmatz.forms.factories.ModelFactory = function(){};

Object.defineProperties(barmatz.forms.factories.ModelFactory,
{
	createUserModel: {value: function()
	{
		return new barmatz.forms.users.UserModel();
	}},
	createFieldModel: {value: function(type, name)
	{
		barmatz.utils.DataTypes.isNotUndefined(type);
		barmatz.utils.DataTypes.isNotUndefined(name);
		barmatz.utils.DataTypes.isTypeOf(type, 'string');
		barmatz.utils.DataTypes.isTypeOf(name, 'string');
		
		switch(type)
		{
			default:
				return new barmatz.forms.fields.FieldModel(type, name);
				break;
			case barmatz.forms.fields.FieldTypes.TEXT_AREA:
				return new barmatz.forms.fields.TextAreaFieldModel(name);
				break;
			case barmatz.forms.fields.FieldTypes.TEXT_FIELD:
				return new barmatz.forms.fields.TextFieldModel(name);
				break;
			case barmatz.forms.fields.FieldTypes.DROPBOX:
				return new barmatz.forms.fields.DropboxModel(name);
				break;
			case barmatz.forms.fields.FieldTypes.PASSWORD:
				return new barmatz.forms.fields.PasswordFieldModel(name);
				break;
			case barmatz.forms.fields.FieldTypes.CHECKBOX:
				return new barmatz.forms.fields.CheckboxFieldModel(name);
				break;
			case barmatz.forms.fields.FieldTypes.RADIO:
				return new barmatz.forms.fields.RadioFieldModel(name);
				break;
			case barmatz.forms.fields.FieldTypes.FILE:
				return new barmatz.forms.fields.FileFieldModel(name);
				break;
			case barmatz.forms.fields.FieldTypes.HIDDEN:
				return new barmatz.forms.fields.HiddenFieldModel(name);
				break;
		}
	}},
	createToolboxModel: {value: function()
	{
		return new barmatz.forms.ui.ToolboxModel();
	}},
	createToolboxItemModel: {value: function(type, label, fieldModel)
	{
		barmatz.utils.DataTypes.isNotUndefined(type);
		barmatz.utils.DataTypes.isNotUndefined(label);
		barmatz.utils.DataTypes.isNotUndefined(fieldModel);
		barmatz.utils.DataTypes.isTypeOf(type, 'string');
		barmatz.utils.DataTypes.isTypeOf(label, 'string');
		barmatz.utils.DataTypes.isInstanceOf(fieldModel, barmatz.forms.fields.FieldModel);
		return new barmatz.forms.ui.ToolboxItemModel(type, label, fieldModel);
	}},
	createCollectionModel: {value: function()
	{
		return new barmatz.forms.CollectionModel();
	}},
	createDropboxItemModel: {value: function(label, value)
	{
		barmatz.utils.DataTypes.isNotUndefined(label);
		barmatz.utils.DataTypes.isTypeOf(label, 'string');
		return new barmatz.forms.fields.DropboxItemModel(label, value);
	}},
	createDropboxModel: {value: function(name, items)
	{
		barmatz.utils.DataTypes.isNotUndefined(name);
		barmatz.utils.DataTypes.isTypeOf(name, 'string', true);
		barmatz.utils.DataTypes.isInstanceOf(items, Array, true);
		return new barmatz.forms.fields.DropboxModel(name, items);
	}},
	createBuilderModel: {value: function()
	{
		return new barmatz.forms.ui.BuilderModel();
	}},
	createMenuModel: {value: function()
	{
		return new barmatz.forms.ui.MenuModel();
	}},
	createMenuItemModel: {value: function(label, clickHandler)
	{
		barmatz.utils.DataTypes.isNotUndefined(label);
		barmatz.utils.DataTypes.isNotUndefined(clickHandler);
		barmatz.utils.DataTypes.isTypeOf(label, 'string');
		barmatz.utils.DataTypes.isTypeOf(clickHandler, 'function');
		return new barmatz.forms.ui.MenuItemModel(label, clickHandler);
	}},
	createFormModel: {value: function()
	{
		return new barmatz.forms.FormModel();
	}},
	createPanelModel: {value: function(className, content)
	{
		barmatz.utils.DataTypes.isNotUndefined(className);
		barmatz.utils.DataTypes.isNotUndefined(content);
		barmatz.utils.DataTypes.isTypeOf(className, 'string');
		barmatz.utils.DataTypes.isTypesOrInstances(content, ['string'], [HTMLElement, Array]);
		return new barmatz.forms.ui.PanelModel(className, content);
	}}
});
/** barmatz.forms.fields.FieldModel **/
window.barmatz.forms.fields.FieldModel = function(type, name)
{
	barmatz.utils.DataTypes.isNotUndefined(type);
	barmatz.utils.DataTypes.isNotUndefined(name);
	barmatz.utils.DataTypes.isTypeOf(type, 'string', true);
	barmatz.utils.DataTypes.isTypeOf(name, 'string', true);
	barmatz.forms.TypeModel.call(this, type);
	this.set('name', name);
	this.set('label', '');
	this.set('mandatory', false);
	this.set('value', '');
	this.set('enabled', true);
};

barmatz.forms.fields.FieldModel.prototype = new barmatz.forms.TypeModel(null);
barmatz.forms.fields.FieldModel.prototype.constructor = barmatz.forms.fields.FieldModel;

Object.defineProperties(barmatz.forms.fields.FieldModel.prototype,
{
	name: {get: function()
	{
		return this.get('name');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		this.set('name', value);
	}},
	label: {get: function()
	{
		return this.get('label');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		this.set('label', value);
	}},
	mandatory: {get: function()
	{
		return this.get('mandatory');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'boolean');
		this.set('mandatory', value);
	}},
	value: {get: function()
	{
		return this.get('value');
	}, set: function(value)
	{
		this.set('value', value);
	}},
	enabled: {get: function()
	{
		return this.get('enabled');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'boolean');
		this.set('enabled', value);
	}},
	clone: {value: function()
	{
		var clone = new barmatz.forms.fields.FieldModel(this.type, this.name);
		clone.label = this.label;
		clone.mandatory = this.mandatory;
		clone.value = this.value;
		clone.enabled = this.enabled;
		return clone;
	}},
	toHTML: {value: function()
	{
		return '<div class="forms-form-item"><label>' + this.label + '</label><input type="' + this.type + '"' + (this.enabled ? '' : ' disabled="disabled"') + ' name="' + this.name + '" value="' + this.value + '"/></div>';
	}}
});
/** barmatz.forms.fields.TextFieldModel **/
window.barmatz.forms.fields.TextFieldModel = function(name)
{
	barmatz.utils.DataTypes.isNotUndefined(name);
	barmatz.utils.DataTypes.isTypeOf(name, 'string', true);
	barmatz.forms.fields.FieldModel.call(this, barmatz.forms.fields.FieldTypes.TEXT_FIELD, name);
	this.set('max', NaN);
};

barmatz.forms.fields.TextFieldModel.prototype = new barmatz.forms.fields.FieldModel(null, null);
barmatz.forms.fields.TextFieldModel.prototype.constructor = barmatz.forms.fields.TextFieldModel;

Object.defineProperties(barmatz.forms.fields.TextFieldModel.prototype,
{
	max: {get: function()
	{
		return this.get('max');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'number');
		this.set('max', value);
	}},
	clone: {value: function()
	{
		var clone = new barmatz.forms.fields.TextFieldModel(this.name);
		clone.label = this.label;
		clone.mandatory = this.mandatory;
		clone.value = this.value;
		clone.enabled = this.enabled;
		clone.max = this.max;
		return clone;
	}},
	toHTML: {value: function()
	{
		return barmatz.forms.fields.FieldModel.prototype.toHTML.call(this).replace(/(\<input)\s/, '$1 ' + (isNaN(this.max) ? '' : 'maxlength="' + this.max + '"') + ' ');
	}}
});
/** barmatz.forms.fields.CheckboxFieldModel **/
window.barmatz.forms.fields.CheckboxFieldModel = function(name)
{
	barmatz.utils.DataTypes.isNotUndefined(name);
	barmatz.utils.DataTypes.isTypeOf(name, 'string', true);
	barmatz.forms.fields.FieldModel.call(this, barmatz.forms.fields.FieldTypes.CHECKBOX, name);
	this.set('checked', false);
};

barmatz.forms.fields.CheckboxFieldModel.prototype = new barmatz.forms.fields.FieldModel(null, null);
barmatz.forms.fields.CheckboxFieldModel.prototype.constructor = barmatz.forms.fields.CheckboxFieldModel;

Object.defineProperties(barmatz.forms.fields.CheckboxFieldModel.prototype, 
{
	checked: {get: function()
	{
		return this.get('checked');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'boolean');
		this.set('checked', value);
	}},
	value: {get: function()
	{
		return this.checked ? this.get('value') : null;
	}},
	clone: {value: function()
	{
		var clone = new barmatz.forms.fields.CheckboxFieldModel(this.name);
		clone.label = this.label;
		clone.mandatory = this.mandatory;
		clone.value = this.value;
		clone.enabled = this.enabled;
		clone.checked = this.checked;
		return clone;
	}},
	toHTML: {value: function()
	{
		return barmatz.forms.fields.FieldModel.prototype.toHTML.call(this).replace(/(\<input)\s/, '$1 ' + (this.checked ? 'checked="checked"' : ''));
	}}
});
/** barmatz.forms.fields.DropboxItemModel **/
window.barmatz.forms.fields.DropboxItemModel = function(label, value)
{
	barmatz.utils.DataTypes.isNotUndefined(label);
	barmatz.utils.DataTypes.isTypeOf(label, 'string');
	barmatz.mvc.Model.call(this);
	this.set('label', label);
	this.set('value', barmatz.utils.DataTypes.applySilent('isNotUndefined', value) ? value : null);
};

barmatz.forms.fields.DropboxItemModel.prototype = new barmatz.mvc.Model();
barmatz.forms.fields.DropboxItemModel.prototype.constructor = barmatz.forms.fields.DropboxItemModel;

Object.defineProperties(barmatz.forms.fields.DropboxItemModel.prototype, 
{
	label: {get: function()
	{
		return this.get('label');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		this.set('label', value);
	}},
	value: {get: function()
	{
		return this.get('value');
	}, set: function(value)
	{
		this.set('value', value);
	}},
	toString: {value: function()
	{
		return this.label + '=' + this.value;
	}},
	toHTML: {value: function()
	{
		return '<option value="' + this.value + '">' + this.label + '</option>';
	}}
});
/** barmatz.forms.fields.DropboxModel **/
window.barmatz.forms.fields.DropboxModel = function(name, items)
{
	barmatz.utils.DataTypes.isNotUndefined(name);
	barmatz.utils.DataTypes.isTypeOf(name, 'string', true);
	barmatz.utils.DataTypes.isInstanceOf(items, Array, true);
	barmatz.forms.fields.FieldModel.call(this, barmatz.forms.fields.FieldTypes.DROPBOX, name);
	
	this.set('multiple', false);
	this.set('items', new barmatz.forms.CollectionModel());
	
	if(items)
		while(items.length > this.numItems)
			this.addItem(items[this.numItems]);
};

barmatz.forms.fields.DropboxModel.prototype = new barmatz.forms.fields.FieldModel(null, null);
barmatz.forms.fields.DropboxModel.prototype.constructor = barmatz.forms.fields.DropboxModel;

Object.defineProperties(barmatz.forms.fields.DropboxModel.prototype,
{
	multiple: {get: function()
	{
		return this.get('multiple');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'boolean');
		this.set('multiple', value);
	}},
	numItems: {get: function()
	{
		return this.get('items').numItems;
	}},
	addItem: {value: function(item)
	{
		barmatz.utils.DataTypes.isNotUndefined(item);
		barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.DropboxItemModel);
		return this.get('items').addItem(item);
	}},
	addItemAt: {value: function(item, index)
	{
		barmatz.utils.DataTypes.isNotUndefined(item);
		barmatz.utils.DataTypes.isNotUndefined(index);
		barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.DropboxItemModel);
		barmatz.utils.DataTypes.isTypeOf(index, 'number');
		return this.get('items').addItemAt(item, index);
	}},
	removeItem: {value: function(item)
	{
		barmatz.utils.DataTypes.isNotUndefined(item);
		barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.DropboxItemModel);
		return this.get('items').removeItem(item);
	}},
	removeItemAt: {value: function(index)
	{
		barmatz.utils.DataTypes.isNotUndefined(index);
		barmatz.utils.DataTypes.isTypeOf(index, 'number');
		return this.get('items').removeItemAt(index);
	}},
	getItemAt: {value: function(index)
	{
		barmatz.utils.DataTypes.isNotUndefined(index);
		barmatz.utils.DataTypes.isTypeOf(index, 'number');
		return this.get('items').getItemAt(index);
	}},
	getItemIndex: {value: function(item)
	{
		barmatz.utils.DataTypes.isNotUndefined(item);
		barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.DropboxItemModel);
		return this.get('items').getItemIndex(item);
	}},
	setItemIndex: {value: function(item, index)
	{
		barmatz.utils.DataTypes.isNotUndefined(item);
		barmatz.utils.DataTypes.isNotUndefined(index);
		barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.DropboxItemModel);
		barmatz.utils.DataTypes.isTypeOf(index, 'number');
		return this.get('items').setItemIndex(item, index);
	}},
	forEach: {value: function(handler)
	{
		barmatz.utils.DataTypes.isNotUndefined(handler);
		barmatz.utils.DataTypes.isTypeOf(handler, 'function');
		return this.get('items').forEach(handler);
	}},
	find: {value: function(filter)
	{
		return this.get('items').find(filter);
	}},
	clone: {value: function()
	{
		var clone = new barmatz.forms.fields.DropboxModel(this.name, this.get('items').toArray());
		clone.label = this.label;
		clone.mandatory = this.mandatory;
		clone.value = this.value;
		clone.enabled = this.enabled;
		clone.multiple = this.multiple;
		return clone;
	}},
	toString: {value: function()
	{
		return this.get('items').toString();
	}},
	toHTML: {value: function()
	{
		var items = '';
		
		this.forEach(function(item, index, collection)
		{
			items += item.toHTML();
		});
		
		return barmatz.forms.fields.FieldModel.prototype.toHTML.call(this).replace(/(\<input.*\/\>)/, '<select' + (this.enabled ? '' : ' disbaled="disbaled"') + (this.multiple ? ' multiple="multiple"' : '') + ' name="' + this.name + '">' + items + '</select>');
	}}
});
/** barmatz.forms.fields.FieldTypes **/
window.barmatz.forms.fields.FieldTypes = function(){};

Object.defineProperties(barmatz.forms.fields.FieldTypes,
{
	TEXT_AREA: {value: 'textArea'},
	TEXT_FIELD: {value: 'textField'},
	DROPBOX: {value: 'dropbox'},
	PASSWORD: {value: 'password'},
	CHECKBOX: {value: 'checkbox'},
	RADIO: {value: 'radio'},
	FILE: {value: 'file'},
	HIDDEN: {value: 'hidden'}
});
/** barmatz.forms.fields.FileFieldModel **/
window.barmatz.forms.fields.FileFieldModel = function(name)
{
	barmatz.utils.DataTypes.isNotUndefined(name);
	barmatz.utils.DataTypes.isTypeOf(name, 'string');
	
	barmatz.forms.fields.FieldModel.call(this, barmatz.forms.fields.FieldTypes.FILE, name);
	
	this.set('accept', []);
};

barmatz.forms.fields.FileFieldModel.prototype = new barmatz.forms.fields.FieldModel(null, null);
barmatz.forms.fields.FileFieldModel.prototype.constructor = barmatz.forms.fields.FileFieldModel;

Object.defineProperties(barmatz.forms.fields.FileFieldModel.prototype,
{
	accept: {get: function()
	{
		return this.get('accept');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isInstanceOf(value, Array);
		this.set('accept', value);
	}},
	clone: {value: function()
	{
		var clone = new barmatz.forms.fields.FileFieldModel(this.name);
		clone.label = this.label;
		clone.mandatory = this.mandatory;
		clone.value = this.value;
		clone.enabled = this.enabled;
		clone.accept = this.accept;
		return clone;
	}},
	toHTML: {value: function()
	{
		return barmatz.forms.fields.FieldModel.prototype.toHTML.call(this).replace(/(\<input)\s/, '$1 accept="' + this.accept.join(',') + '"');
	}}
});
/** barmatz.forms.fields.HiddenFieldModel **/
window.barmatz.forms.fields.HiddenFieldModel = function(name)
{
	barmatz.utils.DataTypes.isNotUndefined(name);
	barmatz.utils.DataTypes.isTypeOf(name, 'string');
	barmatz.forms.fields.FieldModel.call(this, barmatz.forms.fields.FieldTypes.HIDDEN, name);
};

barmatz.forms.fields.HiddenFieldModel.prototype = new barmatz.forms.fields.FieldModel(null, null);
barmatz.forms.fields.HiddenFieldModel.prototype.constructor = barmatz.forms.fields.HiddenFieldModel;

Object.defineProperties(barmatz.forms.fields.HiddenFieldModel.prototype,
{
	clone: {value: function()
	{
		var clone = new barmatz.forms.fields.HiddenFieldModel(this.name);
		clone.label = this.label;
		clone.mandatory = this.mandatory;
		clone.value = this.value;
		clone.enabled = this.enabled;
		return clone;
	}}	
});
/** barmatz.forms.fields.PasswordFieldModel **/
window.barmatz.forms.fields.PasswordFieldModel = function(name)
{
	barmatz.utils.DataTypes.isNotUndefined(name);
	barmatz.utils.DataTypes.isTypeOf(name, 'string');
	barmatz.forms.fields.TextFieldModel.call(this, name);
	this.set('type', barmatz.forms.fields.FieldTypes.PASSWORD);
};

barmatz.forms.fields.PasswordFieldModel.prototype = new barmatz.forms.fields.TextFieldModel(null);
barmatz.forms.fields.PasswordFieldModel.prototype.constructor = barmatz.forms.fields.PasswordFieldModel;

Object.defineProperties(barmatz.forms.fields.PasswordFieldModel.prototype,
{
	clone: {value: function()
	{
		var clone = new barmatz.forms.fields.PasswordFieldModel(this.name);
		clone.label = this.label;
		clone.mandatory = this.mandatory;
		clone.value = this.value;
		clone.enabled = this.enabled;
		return clone;
	}}
});
/** barmatz.forms.fields.RadioFieldModel **/
window.barmatz.forms.fields.RadioFieldModel = function(name)
{
	barmatz.utils.DataTypes.isNotUndefined(name);
	barmatz.utils.DataTypes.isTypeOf(name, 'string');
	barmatz.forms.fields.CheckboxFieldModel.call(this, name);
	this.set('type', barmatz.forms.fields.FieldTypes.RADIO);
};

barmatz.forms.fields.RadioFieldModel.prototype = new barmatz.forms.fields.CheckboxFieldModel(null);
barmatz.forms.fields.RadioFieldModel.prototype.constructor = barmatz.forms.fields.RadioFieldModel;

Object.defineProperties(barmatz.forms.fields.RadioFieldModel.prototype,
{
	clone: {value: function()
	{
		var clone = new barmatz.forms.fields.RadioFieldModel(this.name);
		clone.label = this.label;
		clone.mandatory = this.mandatory;
		clone.value = this.value;
		clone.enabled = this.enabled;
		return clone;
	}}
});
/** barmatz.forms.fields.TextAreaFieldModel **/
window.barmatz.forms.fields.TextAreaFieldModel = function(name)
{
	barmatz.utils.DataTypes.isNotUndefined(name);
	barmatz.utils.DataTypes.isTypeOf(name, 'string', true);
	barmatz.forms.fields.FieldModel.call(this, barmatz.forms.fields.FieldTypes.TEXT_AREA, name);
	this.set('rows', 2);
	this.set('cols', 20);
};

barmatz.forms.fields.TextAreaFieldModel.prototype = new barmatz.forms.fields.FieldModel(null, null);
barmatz.forms.fields.TextAreaFieldModel.prototype.constructor = barmatz.forms.fields.TextAreaFieldModel;

Object.defineProperties(barmatz.forms.fields.TextAreaFieldModel.prototype,
{
	rows: {get: function()
	{
		return this.get('rows');
	}, set: function(value)
	{
		this.set('rows', value);
	}},
	cols: {get: function()
	{
		return this.get('cols');
	}, set: function(value)
	{
		this.set('cols', value);
	}},
	clone: {value: function()
	{
		var clone = new barmatz.forms.fields.TextAreaFieldModel(this.name);
		clone.label = this.label;
		clone.mandatory = this.mandatory;
		clone.value = this.value;
		clone.enabled = this.enabled;
		clone.rows = this.rows;
		clone.cols = this.cols;
		return clone;
	}},
	toHTML: {value: function()
	{
		return barmatz.forms.fields.FieldModel.prototype.toHTML.call(this).replace(/(\<input.*\/\>)/, '<textarea cols="' + this.cols + '"' + (this.enabled ? '' : ' disabled="disabled"') + ' name="' + this.name + '"  rows="' + this.rows + '">' + this.value + '</textarea>');
	}}
});
/** barmatz.net.Encoding **/
window.barmatz.net.Encoding = function(){};

Object.defineProperties(barmatz.net.Encoding,
{
	HTML5: {value: 'text/plain'},
	FORM: {value: 'application/x-www-form-urlencoded'},
	FILES: {value: 'multipart/form-data'}
});
/** barmatz.net.Loader **/
window.barmatz.net.Loader = function()
{
	barmatz.events.EventDispatcher.call(this);
	
	this.__xhr = null;
};

barmatz.net.Loader.prototype = new barmatz.events.EventDispatcher();
barmatz.net.Loader.prototype.constructor = barmatz.net.Loader;

Object.defineProperties(barmatz.net.Loader,
{
	UNSENT: {value: 'UNSENT'},
	OPENED: {value: 'OPENED'},
	HEADERS_RECEIVED: {value: 'HEADERS_RECEIVED'},
	LOADING: {value: 'LOADING'},
	DONE: {value: 'DONE'},
	serialize: {value: function(object)
	{
		var params = [], key, value;
		
		for(key in object)
		{
			value = object[key];
			key = encodeURIComponent(key);
			
			if(typeof value == 'object')
			{
				if(value instanceof Array)
					params.push(key + '=' + value.join('&' + key + '='));
				else
					params.push(this.serialize(value));
			}
			else
				params.push(key + '=' + encodeURIComponent(value));
		}
		
		return params.join('&');
	}}
}); 
Object.defineProperties(barmatz.net.Loader.prototype, 
{
	_xhr: {get: function()
	{
		if(!this.__xhr)
			this.__xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
		
		return this.__xhr;
	}},
	state: {get: function()
	{
		switch(this._xhr.readyState)
		{
			case 0:
				return barmatz.net.Loader.UNSENT;
				break;
			case 1:
				return barmatz.net.Loader.OPENED;
				break;
			case 2:
				return barmatz.net.Loader.HEADERS_RECEIVED;
				break;
			case 3:
				return barmatz.net.Loader.LOADING;
				break;
			case 4:
				return barmatz.net.Loader.DONE;
				break;
		}
	}},
	abort: {value: function()
	{
		this._xhr.abort();
	}},
	load: {value: function(request)
	{
		var _this, url, contentTypeSet, i;
		
		barmatz.utils.DataTypes.isNotUndefined(request);
		barmatz.utils.DataTypes.isInstanceOf(request, barmatz.net.Request);
		
		_this = this;
		url = request.url;

		if(request.data && request.method == barmatz.net.Methods.GET)
			url += (url.indexOf('?') > -1 ? '&' : '?') + barmatz.net.Loader.serialize(request.data);
		
		this._xhr.addEventListener('readystatechange', onReadyStateChange);
		
		if(request.credentials)
			this._xhr.open(request.method, url, request.async, request.credentials.user ? request.credentials.user : null, reqeust.credentials.password ? reqeust.credentials.password : null);
		else
			this._xhr.open(request.method, url, request.async);
		
		if(request.headers)
			for(i in request.headers)
			{
				this._xhr.setRequestHeader(request.headers[i].header, request.headers[i].value);
				if(request.headers[i].header.toLowerCase() == 'content-type')
					contentTypeSet = true;
			}
		
		if(!contentTypeSet)
			this._xhr.setRequestHeader('Content-Type', barmatz.net.Encoding.FORM);
		
		if(request.method == barmatz.net.Methods.POST)
			this._xhr.send(barmatz.net.Loader.serialize(request.data));
		else
			this._xhr.send();
		
		function onReadyStateChange(event)
		{
			var type;
			
			switch(event.target.readyState)
			{
				case 0:
					type = barmatz.events.LoaderEvent.UNSENT;
				case 1:
					if(!type)
						type = barmatz.events.LoaderEvent.OPENED;
					_this.dispatchEvent(new barmatz.events.LoaderEvent(barmatz.events.LoaderEvent.OPENED, request));
					break;
				case 2:
					type = barmatz.events.LoaderEvent.HEADERS_RECEIVED;
				case 3:
					type = barmatz.events.LoaderEvent.LOADING;
				case 4:
					if(!type)
						type = barmatz.events.LoaderEvent.DONE;
					_this.dispatchEvent(new barmatz.events.LoaderEvent(type, new barmatz.net.Response(request.url, _this._xhr.responseText, _this._xhr.responseType || '', _this._xhr.status, _this._xhr.getAllResponseHeaders().split('\n'))));
					break;
			}
		}
	}}
});
/** barmatz.net.Methods **/
window.barmatz.net.Methods = function(){};

Object.defineProperties(barmatz.net.Methods,
{
	GET: {value: 'GET'},
	POST: {value: 'POST'},
	PUT: {value: 'PUT'},
	DELETE: {value: 'DELETE'}	
});
/** barmatz.net.Request */
window.barmatz.net.Request = function(url)
{
	barmatz.utils.DataTypes.isNotUndefined(url);
	barmatz.utils.DataTypes.isTypeOf(url, 'string');
	barmatz.mvc.Model.call(this);
	this.set('url', url);
	this.set('method', barmatz.net.Methods.GET);
	this.set('async', true);
	this.set('data', {});
};

barmatz.net.Request.prototype = new barmatz.mvc.Model();
barmatz.net.Request.prototype.constructor = barmatz.net.Request;

Object.defineProperties(barmatz.net.Request.prototype,
{
	data: {get: function()
	{
		return this.get('data');
	}, set: function(value)
	{
		this.set('data', value);
	}},
	url: {get: function()
	{
		return this.get('url');
	}},
	method: {get: function()
	{
		return this.get('method');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		this.set('method', value);
	}},
	async: {get: function()
	{
		return this.get('async');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'boolean');
		this.set('async', value);
	}},
	credentials: {get: function()
	{
		return this.get('credentials');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isInstanceOf(value, barmatz.net.RequestCredentils);
		this.set('credentials', value);
	}},
	headers: {get: function()
	{
		return this.get('headers');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isInstanceOf(value, Array);
		this.set('headers', value);
	}}
});
/** barmatz.net.RequestHeader **/
window.barmatz.net.RequestHeader = function(header, value)
{
	barmatz.utils.DataTypes.isNotUndefined(header);
	barmatz.utils.DataTypes.isNotUndefined(value);
	barmatz.utils.DataTypes.isTypeOf(header, 'string');
	barmatz.utils.DataTypes.isTypeOf(value, 'string');
	barmatz.mvc.Model.call(this);
	this.set('header', header);
	this.set('value', value);
};

barmatz.net.RequestHeader.prototype = new barmatz.mvc.Model();
barmatz.net.RequestHeader.prototype.constructor = barmatz.net.RequestHeader;

Object.defineProperties(barmatz.net.RequestHeader.prototype,
{
	header: {get: function()
	{
		return this.get('header');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		this.set('header', value);
	}},
	value: {get: function()
	{
		return this.get('value');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		this.set('value', value);
	}}
});
/** barmatz.net.Response **/
window.barmatz.net.Response = function(url, data, type, status, headers)
{
	barmatz.utils.DataTypes.isNotUndefined(url);
	barmatz.utils.DataTypes.isTypeOf(url, 'string');
	barmatz.utils.DataTypes.isNotUndefined(data);
	barmatz.utils.DataTypes.isNotUndefined(type);
	barmatz.utils.DataTypes.isTypeOf(type, 'string');
	barmatz.utils.DataTypes.isNotUndefined(status);
	barmatz.utils.DataTypes.isTypeOf(status, 'number');
	barmatz.utils.DataTypes.isNotUndefined(headers);
	barmatz.utils.DataTypes.isInstanceOf(headers, Array);
	barmatz.mvc.Model.call(this);
	this.set('url', url);
	this.set('data', data);
	this.set('type', type);
	this.set('status', status);
	this.set('headers', headers);
};

barmatz.net.Response.prototype = new barmatz.mvc.Model();
barmatz.net.Response.prototype.constructor = barmatz.net.Response;

Object.defineProperties(barmatz.net.Response.prototype,
{
	url: {get: function()
	{
		return this.get('url');
	}},
	data: {get: function()
	{
		return this.get('data');
	}},
	type: {get: function()
	{
		return this.get('type');
	}},
	status: {get: function()
	{
		return this.get('status');
	}},
	headers: {get: function()
	{
		return this.get('headers');
	}}
});
/** embed **/
barmatz.forms.embed = function(fingerprint)
{
	var dictionary = new barmatz.utils.Dictionary();
	
	getContainers();
	
	function getContainers()
	{
		var containers, i;
		
		containers = Array.prototype.slice.call(document.getElementsByName('formContainer')).filter(filterFormContainers);

		for(i in containers)
			embedForm(containers[i]);
	}
	
	function filterFormContainers(element)
	{
		return !fingerprint || element.getAttribute('fingerprint') == fingerprint;
	}
	
	function embedForm(container)
	{
		loadFormForContainer(container);
	}
	
	function loadFormForContainer(container)
	{
		var formModel = barmatz.forms.factories.ModelFactory.createFormModel();
		dictionary.add(formModel, container);
		addFormModelListeners(formModel);
		formModel.loadByFingerprint(container.getAttribute('fingerprint'));
	}

	function addFormModelListeners(model)
	{
		model.addEventListener(barmatz.events.FormModelEvent.LOADING_FORM_COMPLETE, onLoadingFormComplete);
		model.addEventListener(barmatz.events.FormModelEvent.LOADING_FORM_ERROR, onLoadingFormError);
	}
	
	function removeFormModelListeners(model)
	{
		model.removeEventListener(barmatz.events.FormModelEvent.LOADING_FORM_COMPLETE, onLoadingFormComplete);
		model.removeEventListener(barmatz.events.FormModelEvent.LOADING_FORM_ERROR, onLoadingFormError);
	}
	
	function onLoadingFormComplete(event)
	{
		var container = dictionary.get(event.target);
		dictionary.remove(event.target);
		removeFormModelListeners(event.target);
		container.innerHTML = event.target.toHTML();
		barmatz.forms.factories.ControllerFactory.createFormController(event.target, container.getElementsByTagName('form')[0]);
	}
	
	function onLoadingFormError(event)
	{
		removeFormModelListeners(event.target);
		dictionary.get(event.target).innerHTML = 'Error loading form';
		dictionary.remove(event.target);
	}
};
barmatz.forms.embed();
