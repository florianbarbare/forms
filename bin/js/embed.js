/** namespaces **/
barmatz = {
	events: {},
	forms: {
		factories: {},
		fields: {},
		ui: {
			jquery: {},
			pages: {}
		},
		users: {}
	},
	mvc: {},
	net: {},
	utils: {}
};
/** barmatz.utils.Array **/
barmatz.utils.Array = {
	toArray: function(object)
	{
		var array = [];
		
		this.forEach(object, function(item, index, collection)
		{
			array[index] = item;
		});
		
		return array;
	},
	forEach: function(array, callback, thisObject)
	{
		var i;
		for(i = 0; i < array.length; i++)
			callback.call(thisObject || this, array[i], i, array);
	},
	filter: function(array, callback, thisObject)
	{
		(function()
		{
			if(!Array.prototype.filter)
			{
			  Array.prototype.filter = function(fun /*, thisp*/)
			  {
			    "use strict";
			 
			    if (this == null)
			      throw new TypeError();
			 
			    var t = Object(this);
			    var len = t.length >>> 0;
			    if (typeof fun != "function")
			      throw new TypeError();
			 
			    var res = [];
			    var thisp = arguments[1];
			    for (var i = 0; i < len; i++)
			    {
			      if (i in t)
			      {
			        var val = t[i]; // in case fun mutates this
			        if (fun.call(thisp, val, i, t))
			          res.push(val);
			      }
			    }
			 
			    return res;
			  };
			}
		})();
		
		return array.filter(callback, thisObject);
	}
};
/** barmatz.utils.Bitwise **/
barmatz.utils.Bitwise = {
	slice: function(bitA, bitB)
	{
		var bits;
		
		barmatz.utils.DataTypes.isTypeOf(bitA, 'number');
		barmatz.utils.DataTypes.isTypeOf(bitB, 'number');
		
		bits = this.parseBit(bitA);
		barmatz.utils.Array.forEach(this.parseBit(bitB), function(item, index, collection)
		{
			index = bits.indexOf(item);
			
			if(index > -1)
				bits.splice(index, 1);
		});
		
		return this.concat.apply(this, bits);
	},
	concat: function()
	{
		var result, filterredBits, bits;
		
		bits = [];
		filterredBits = [];
		result = 0;
		barmatz.utils.Array.forEach(arguments, function(item, index, collection)
		{
			bits = bits.concat(this.parseBit(item));
		}, this);
		filterredBits = barmatz.utils.Array.filter(bits, function(a,b,c)
		{
			return filterredBits.indexOf(a) >= 0 ? false : filterredBits.push(a) >= 0;
		});
		barmatz.utils.Array.forEach(filterredBits, function(item, index, collection)
		{
			result += item;
		});		
		
		return result;
	},
	parseBit: function(bit)
	{
		var bits, i;
		
		barmatz.utils.DataTypes.isTypeOf(bit, 'number');
		
		bits = [];
		
		for(i = 1; i <= bit; i = i << 1)
			if(i & bit)
				bits.push(i);
		
		return bits;
	},
	contains: function(bitA, bitB)
	{
		return bitA & bitB ? true : false;
	}
};
/** barmatz.utils.CSS **/
barmatz.utils.CSS = { 
	getStyle: function(element)
	{
		barmatz.utils.DataTypes.isInstanceOf(element, window.HTMLElement);
		
		if(element.currentStyle)
			return element.currentStyle;
		else if(document.defaultView && document.defaultView.getComputedStyle)
			return document.defaultView.getComputedStyle(element);
		else
			return element.style;
	},
	unitToPixal: function(element, value)
	{
		barmatz.utils.DataTypes.isInstanceOf(element, window.HTMLElement);
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		return /em/.test(value) ? parseFloat(this.emToPixal(element, parseFloat(value))) : /px/.test(value) ? parseFloat(value) : 0;
	},
	emToPixal: function(element, value)
	{
		barmatz.utils.DataTypes.isInstanceOf(element, window.HTMLElement);
		barmatz.utils.DataTypes.isTypeOf(value, 'number');
		return parseFloat(this.getStyle(element).fontSize) * value;
	},
	absoluteHeight: function(element)
	{
		barmatz.utils.DataTypes.isInstanceOf(element, window.HTMLElement);
		return element.offsetHeight + this.unitToPixal(element, this.getStyle(element).marginTop) + this.unitToPixal(element, this.getStyle(element).marginBottom);
	},
	absoluteWidth: function(element)
	{
		barmatz.utils.DataTypes.isInstanceOf(element, window.HTMLElement);
		return element.offsetWidth + this.unitToPixal(element, this.getStyle(element).marginLeft) + this.unitToPixal(element, this.getStyle(element).marginRight);
	},
	verticalAlign: function(element)
	{
		var parent;
		
		barmatz.utils.DataTypes.isInstanceOf(element, window.HTMLElement);
		
		parent = element.parentElement;
		
		if(parent)
			element.style.top = ((parent.offsetHeight * .5) - (this.absoluteHeight(element) * .5)) + 'px';
	},
	verticalAlignChildren: function(element)
	{
		barmatz.utils.DataTypes.isInstanceOf(element, window.HTMLElement);
		barmatz.utils.Array.forEach(element.children, function(item, index, collection)
		{
			this.verticalAlign(item);
		});
	},
	addClass: function(element, className)
	{
		barmatz.utils.DataTypes.isInstanceOf(element, window.HTMLElement);
		barmatz.utils.DataTypes.isTypeOf(className, 'string');
		
		if(element.className.indexOf(className) == -1)
			element.className += ' ' + className;
		
		element.className = element.className.replace(/^\s*|\s*$/, '');
	},
	removeClass: function(element, className)
	{
		barmatz.utils.DataTypes.isInstanceOf(element, window.HTMLElement);
		barmatz.utils.DataTypes.isTypeOf(className, 'string');
		element.className = element.className.replace(new RegExp('^' + className + '\\s?|\\s' + className + '[^\\S]?', 'g'), ' ').replace(/\s+/g, ' ').replace(/^\s+|\s+$/, '');
	}
};
/** barmatz.utils.DataTypes **/
barmatz.utils.DataTypes = {
	UNDEFINED_ERROR: 'expected property is undefined',
	INVALID_VALUE_ERROR: 'value is not valid',
	WRONG_TYPE: 'data type is wrong',
	WRONG_INSTANCE: 'instance is wrong object',
	WRONG_TYPE_INSTANCE: 'data type is wrong or instance is wrong object',
	VALUE_NULL: 'value is null',
	_recursiveVlidation: function(value, collection, method, errorMessage, allowNull)
	{
		var errors;

		if(!allowNull)
			this.isValid(value);
		else if(allowNull && value == null)
			return true;
		
		errors = 0;
		barmatz.utils.Array.forEach(collection, function(item, index, collection)
		{
			try
			{
				method.call(this, value, item, allowNull);
			}
			catch(error)
			{
				errors++;
			}
		}, this);
		
		if(errors == collection.length)
			if(!this.throwError(TypeError, errorMessage))
				return false;
		
		return true;
	},
	getSilent: function()
	{
		return this._silent || false;
	}, 
	setSilent: function(value)
	{
		this._silent = value;
	},
	applySilent: function(method)
	{
		var returnValue, args;
		
		args = barmatz.utils.Array.toArray(arguments).slice(1, arguments.length);
		
		this.setSilent(true);
		returnValue = this[method].apply(this, args);
		this.setSilent(false);
		
		return returnValue;
	},
	throwError: function(error, message)
	{
		if(this.getSilent())
			return false;
		else
		{
			throw new error(message);
			return true;
		}
	},
	isNotUndefined: function(value)
	{
		if(value === undefined)
			if(!this.throwError(ReferenceError, this.UNDEFINED_ERROR))
				return false;
		return true;
	},
	isValid: function(value)
	{
		if(value == null)
			if(!this.throwError(TypeError, this.INVALID_VALUE_ERROR))
				return false;
		return true;
	},
	isAllowNull: function(value)
	{
		if(value === null)
			if(!this.throwError(TypeError, this.VALUE_NULL))
			return false;
		return true;
	},
	isTypeOf: function(value, type, allowNull)
	{
		if(!allowNull)
			this.isValid(value);
		else if(allowNull && value == null)
			return true;
		if(typeof value != type)
			if(!this.throwError(TypeError, this.WRONG_TYPE))
				return false;
		return true;
	},
	isTypesOf: function(value, types, allowNull)
	{
		this._recursiveVlidation(value, types, this.isTypeOf, this.WRONG_INSTANCE, allowNull);
		return true;
	},
	isInstanceOf: function(instance, object, allowNull)
	{
		if(!allowNull)
			this.isValid(instance);
		else if(allowNull && instance == null)
			return true;
		if(!(instance instanceof object))
			if(!this.throwError(TypeError, this.WRONG_INSTANCE))
				return false;
		return true;
	},
	isInstancesOf: function(instances, objects, allowNull)
	{
		this._recursiveVlidation(instances, objects, this.isInstanceOf, this.WRONG_INSTANCE, allowNull);
		return true;
	},
	isTypeOrInstance: function(value, type, object, allowNull)
	{
		if(!allowNull)
			this.isValid(value);
		else if(allowNull && value == null)
			return true;
		if(typeof value != type || !(value instanceof object))
			if(!this.throwError(TypeError, this.WRONG_TYPE_INSTANCE))
				return false;
		return true;
	},
	isTypesOrInstances: function(value, types, objects, allowNull)
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
			isInstance = this.isInstancesOf(value, objects, allowNull);
		}
		catch(error){}
		
		if(!isType && !isInstance)
			if(!this.throwError(TypeError, this.WRONG_TYPE_INSTANCE))
				return false;
		return true;
	}
};
/** barmatz.utils.Date **/
barmatz.utils.Date = {
	isInvalid: function(date)
	{
		barmatz.utils.DataTypes.isInstanceOf(date, Date);
		return isNaN(date.getTime()) ? true : false;
	},
	toDate: function(string)
	{
		var isoExp, date, month, parts;
		
		barmatz.utils.DataTypes.isTypeOf(string, 'string');
		
		isoExp = /^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})$/;
        date = new Date(NaN);
        parts = isoExp.exec(string);

		if(parts)
		{
			month = +parts[2];
			date.setFullYear(parts[1], month - 1, parts[3]);
			date.setHours(parts[4]);
			date.setMinutes(parts[5]);
			date.setSeconds(parts[6]);
		}
		return date;
	},
	toString: function(date, format)
	{
		barmatz.utils.DataTypes.isInstanceOf(date, Date, true);
		barmatz.utils.DataTypes.isTypeOf(format, 'string');
		
		if(!date || this.isInvalid(date))
			return 'Invalid date';
		else
			return format.replace(/d{2}/, leadingZero(date.getDate())).
				   replace(/d{1}/, date.getDate()).
				   replace(/n{1}/, date.getDay() + 1).
				   replace(/m{3}/, leadingDoubleZero(date.getMilliseconds())).
				   replace(/m{2}/, leadingZero(date.getMonth() + 1)).
				   replace(/m{1}/, date.getMonth() + 1).
				   replace(/y{4}/, date.getFullYear()).
				   replace(/y{2}/, date.getFullYear().toString().substring(2, 4)).
				   replace(/h{2}/, leadingZero(date.getHours())).
				   replace(/h{1}/, date.getHours()).
				   replace(/H{1}/, (date.getHours() % 12)).
				   replace(/i{2}/, leadingZero(date.getMinutes())).
				   replace(/i{1}/, date.getMinutes()).
				   replace(/s{2}/, leadingZero(date.getSeconds())).
				   replace(/s{1}/, date.getSeconds()).
				   replace(/D{1}/, this.getDayName(date)).
				   replace(/M{1}/, this.getMonthName(date)).
				   replace(/A{1}/, date.getHours() < 13 ? 'am' : 'pm');
			   
		function leadingZero(number)
		{
			return (number < 10 ? '0': '') + number.toString();
		}
		
		function leadingDoubleZero(number)
		{
			return (number < 100 ? '00': '') + number.toString();
		}
	},
	getDayName: function(date)
	{
		barmatz.utils.DataTypes.isInstanceOf(date, Date);
		return  ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
	},
	getMonthName: function(date)
	{
		barmatz.utils.DataTypes.isInstanceOf(date, Date);
		return  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()];
	}
};
/** barmatz.utils.Dictionary **/
barmatz.utils.Dictionary = function()
{
	this._keys = [];
	this._values = [];
};
barmatz.utils.Dictionary.prototype = {
	add: function(key, value)
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
	},
	remove: function(key)
	{
		var keyIndex, value;
		keyIndex = this._keys.indexOf(key);
		value = this.get(keyIndex);
		this._keys.splice(keyIndex, 1);
		this._values.splice(keyIndex, 1);
		return value;
	},
	get: function(key)
	{
		return this._values[this._keys.indexOf(key)];
	},
	getNext: function(key)
	{
		return this._values[this._keys.indexOf(key) + 1];
	},
	getPrev: function(key)
	{
		return this._values[this._keys.indexOf(key) - 1];
	},
	reset: function()
	{
		this._keys.splice(0, this._keys.length);
		this._values.splice(0, this._values.length);
	},
	forEach: function(callback)
	{
		barmatz.utils.Array.forEach(this._keys, function(item, index, collection)
		{
			callback(this._values[index], this._keys[index]);
		}, this);
	},
	find: function(value)
	{
		if(value === undefined)
			throw new ReferenceError('expected property value is undefined');
		
		return this._keys[this._values.indexOf(value)];
	}
};
/** barmatz.events.Event **/
barmatz.events.Event = function(type)
{
	barmatz.utils.DataTypes.isNotUndefined(type);
	barmatz.utils.DataTypes.isTypeOf(type, 'string', true);
	this._type = type;
};

barmatz.events.Event.prototype = {
	getTarget: function()
	{
		return this._target;
	},
	getType: function()
	{
		return this._type;
	},
	clone: function()
	{
		var event = new barmatz.events.Event(this.getType());
		event._target = this.getTarget();
		return event;
	},
	formatToString: function(className)
	{
		var parameters = [], key, i;
		
		arguments = barmatz.utils.Array.toArray(arguments);
		
		for(i = 1; i < arguments.length; i++)
		{
			key = arguments[i];
			
			if(!this.hasOwnProperty(key))
				key = '_' + key;
				
			parameters.push(arguments[i] + '=' + this[key]);
		}
		
		return '[' + className + '(' + parameters.join(', ') + ')]';
	},
	toString: function()
	{
		return this.formatToString('Event', 'type');
	}
};
/** barmatz.events.CollectionEvent **/
barmatz.events.CollectionEvent = function(type)
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
barmatz.events.CollectionEvent.ITEM_ADDED = 'itemAdded';
barmatz.events.CollectionEvent.ITEM_REMOVED = 'itemRemoved';
barmatz.events.CollectionEvent.prototype = new barmatz.events.Event(null);
barmatz.events.CollectionEvent.prototype.constructor = barmatz.events.CollectionEvent;
barmatz.events.CollectionEvent.prototype.getItem = function()
{
	return this._item;
};
barmatz.events.CollectionEvent.prototype.getIndex = function()
{
	return this._index;
};
barmatz.events.CollectionEvent.prototype.clone = function()
{
	var event = new barmatz.events.CollectionEvent(this.getType());
	
	event._target = this.target;
	
	switch(event.getType())
	{
		case barmatz.events.CollectionEvent.ITEM_ADDED:
		case barmatz.events.CollectionEvent.ITEM_REMOVED:
			event._item = this.getItem();
			event._index = this.getIndex();
			break;
	}
	
	return event;
};
barmatz.events.CollectionEvent.prototype.toString = function()
{
	switch(this.getType())
	{
		default:
			return this.formatToString('CollectionEvent', 'type');
			break;
		case barmatz.events.CollectionEvent.ITEM_ADDED:
		case barmatz.events.CollectionEvent.ITEM_REMOVED:
			return this.formatToString('CollectionEvent', 'type', 'item', 'index');
			break;
	}
};
/** barmatz.events.EventDispatcher **/
barmatz.events.EventDispatcher = function(target)
{
	this._target = target || this;
	this._listeners = {};
};

barmatz.events.EventDispatcher.prototype = {
	addEventListener: function(type, listener)
	{
		barmatz.utils.DataTypes.isTypeOf(type, 'string');
		barmatz.utils.DataTypes.isTypeOf(listener, 'function');
		
		if(!this._listeners[type])
			this._listeners[type] = [];
		
		this._listeners[type].push(listener);
	},
	dispatchEvent: function(event)
	{
		var queue, i;
		
		barmatz.utils.DataTypes.isInstanceOf(event, barmatz.events.Event);
		
		event._target = this._target;
		
		for(i in this._listeners)
		{
			if(i === event.getType())
			{
				queue = [];
				
				barmatz.utils.Array.forEach(this._listeners[i], function(item, index, collection)
				{
					queue.push(item);
				});
				barmatz.utils.Array.forEach(queue, function(item, index, collection)
				{
					item.call(this, event);
				}, this);				
			}
		}
	},
	hasEventListener: function(type)
	{
		return this._listeners[type] ? true : false;
	},
	removeEventListener: function(type, listener)
	{
		if(this._listeners[type])
		{
			barmatz.utils.Array.forEach(this._listeners[type], function(item, index, collection)
			{
				if(item === listener)
					collection.splice(index, 1);
			}, this);
			
			if(this._listeners[type].length == 0)
				delete this._listeners[type];
		}
	},
	toJSON: function()
	{
		var object, i;
		
		object = {};
		
		for(i in this)
			object[i] = this[i];
		
		delete object._target;
		delete object._listeners;
		
		return object;
	}
};
/** barmatz.events.FieldEvent **/
barmatz.events.FieldEvent = function(type)
{
	barmatz.utils.DataTypes.isNotUndefined(type);
	barmatz.utils.DataTypes.isTypeOf(type, 'string');
	barmatz.events.Event.call(this, type);
	
	this._errors = null;
	
	switch(type)
	{
		case barmatz.events.FieldEvent.INVALID:
			this._errors = arguments[1];
			break;
	}
};
barmatz.events.FieldEvent.VALID = 'valid';
barmatz.events.FieldEvent.INVALID = 'invalid';
barmatz.events.FieldEvent.prototype = new barmatz.events.Event(null);
barmatz.events.FieldEvent.prototype.constructor = barmatz.events.FieldEvent;
barmatz.events.FieldEvent.prototype.getErrors = function()
{
	return this._errors;
};
barmatz.events.FieldEvent.prototype.clone = function()
{
	var event = new barmatz.events.FieldEvent(this.getType());
	event._target = this.getTarget();
	event._errors = this.getErrors();
	return event;
};
barmatz.events.FieldEvent.prototype.toString = function()
{
	switch(this.type)
	{
		default:
			return this.formatToString('FieldEvent', 'type');
			break;
		case barmatz.events.FieldEvent.INVALID:
			return this.formatToString('FieldEvent', 'type', 'errors');
			break;
	}
};
/** barmatz.events.FormEvent **/
barmatz.events.FormEvent = function(type)
{
	barmatz.utils.DataTypes.isNotUndefined(type);
	barmatz.utils.DataTypes.isTypeOf(type, 'string');
	barmatz.events.Event.call(this, type);

	this._leads = null;
	
	switch(type)
	{
		case barmatz.events.FormEvent.GET_LEADS_SUCCESS:
			this._leads = arguments[1];
			break;
	}
};
barmatz.events.FormEvent.SAVING = 'saving';
barmatz.events.FormEvent.SAVED = 'saved';
barmatz.events.FormEvent.ERROR_SAVING = 'errorSaving';
barmatz.events.FormEvent.LOADING_FORM = 'loadingForm';
barmatz.events.FormEvent.LOADING_FORM_COMPLETE = 'loadingFormComplete';
barmatz.events.FormEvent.LOADING_FORM_ERROR = 'loadingFormError';
barmatz.events.FormEvent.DELETING = 'deleting';
barmatz.events.FormEvent.DELETED = 'deleted';
barmatz.events.FormEvent.DELETION_FAIL = 'deletionFail';
barmatz.events.FormEvent.SUBMITTING = 'submitting';
barmatz.events.FormEvent.SUBMITTED = 'submitted';
barmatz.events.FormEvent.SUBMISSION_FAILED = 'submissionFailed';
barmatz.events.FormEvent.GET_LEADS_SUCCESS = 'getLeadsSuccess';
barmatz.events.FormEvent.GET_LEADS_FAIL = 'getLeadsFail';
barmatz.events.FormEvent.prototype = new barmatz.events.Event(null);
barmatz.events.FormEvent.prototype.constructor = barmatz.events.FormEvent;
barmatz.events.FormEvent.prototype.getLeads = function()
{
	return this._leads;
};
barmatz.events.FormEvent.prototype.clone = function()
{
	var event = new barmatz.events.FormEvent(this.getType());
	event._target = this.getTarget();
	
	switch(event.getType())
	{
		case barmatz.events.FormEvent.GET_LEADS_SUCCESS:
			event._leads = this.getLeads();
			break;
	}
	
	return event;
};
barmatz.events.FormEvent.prototype.toString = function()
{
	switch(this.getType())
	{
		default:
			return this.formatToString('FormEvent', 'type');
			break;
		case barmatz.events.FormEvent.GET_LEADS_SUCCESS:
			return this.formatToString('FormEvent', 'type', 'leads');
			break;
	}
};
/** barmatz.events.LoaderEvent **/
barmatz.events.LoaderEvent = function(type)
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
		case barmatz.events.LoaderEvent.COMPLETE:
		case barmatz.events.LoaderEvent.SUCCESS:
		case barmatz.events.LoaderEvent.ERROR:
			this._response = arguments[1];
			break;
	}
};

barmatz.events.LoaderEvent.UNSENT = 'unsent';
barmatz.events.LoaderEvent.OPENED = 'opened';
barmatz.events.LoaderEvent.HEADERS_RECEIVED = 'headersReceived';
barmatz.events.LoaderEvent.LOADING = 'loading';
barmatz.events.LoaderEvent.COMPLETE = 'complete';
barmatz.events.LoaderEvent.SUCCESS = 'success';
barmatz.events.LoaderEvent.ERROR = 'error';
barmatz.events.LoaderEvent.prototype = new barmatz.events.Event(null);
barmatz.events.LoaderEvent.prototype.constructor = barmatz.events.LoaderEvent;
barmatz.events.LoaderEvent.prototype.getRequest = function()
{
	return this._request;
};
barmatz.events.LoaderEvent.prototype.getResponse = function()
{
	return this._response;
};
barmatz.events.LoaderEvent.prototype.clone = function()
{
	var event = new barmatz.events.LoaderEvent(this.getType());
	event._target = this.getTarget();
	event._request = this.getRequest();
	event._response = this.getResponse();
	return event;
};
barmatz.events.LoaderEvent.prototype.toString = function()
{
	switch(this.getType())
	{
		default:
			return this.formatToString('LoaderEvent', 'type');
			break;
		case barmatz.events.LoaderEvent.UNSENT:
		case barmatz.events.LoaderEvent.OPENED:
			return this.formatToString('LoaderEvent', 'type', 'request');
		case barmatz.events.LoaderEvent.HEADERS_RECEIVED:
		case barmatz.events.LoaderEvent.LOADING:
		case barmatz.events.LoaderEvent.COMPLETE:
		case barmatz.events.LoaderEvent.SUCCESS:
		case barmatz.events.LoaderEvent.ERROR:
			return this.formatToString('LoaderEvent', 'type', 'response');
			break;
	}
};
/** barmatz.events.ModelEvent **/
barmatz.events.ModelEvent = function(type)
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
barmatz.events.ModelEvent.VALUE_CHANGED = 'valueChanged';
barmatz.events.ModelEvent.prototype = new barmatz.events.Event(null);
barmatz.events.ModelEvent.prototype.constructor = barmatz.events.ModelEvent;
barmatz.events.ModelEvent.prototype.getKey = function()
{
	return this._key;
};
barmatz.events.ModelEvent.prototype.getValue = function()
{
	return this._value;
};
barmatz.events.ModelEvent.prototype.clone = function()
{
	var event = new barmatz.events.ModelEvent(this.getType());
	event._target = this.getTarget();
	event._key = this.getKey();
	event._value = this.getValue();
	return event;
};
barmatz.events.ModelEvent.prototype.toString = function()
{
	return this.formatToString('ModelEvent', 'type', 'key', 'value');
};
/** barmatz.mvc.Controller **/
barmatz.mvc.Controller = function(){};
/** barmatz.mvc.Model **/
barmatz.mvc.Model = function()
{
	barmatz.events.EventDispatcher.call(this);
};
barmatz.mvc.Model.prototype = new barmatz.events.EventDispatcher();
barmatz.mvc.Model.prototype.constructor = barmatz.mvc.Model;
barmatz.mvc.Model.prototype.get = function(key)
{
	return this['_' + key];
};
barmatz.mvc.Model.prototype.set = function(key, value)
{
	barmatz.utils.DataTypes.isNotUndefined(key);
	barmatz.utils.DataTypes.isNotUndefined(value);
	this['_' + key] = value;
	this.dispatchEvent(new barmatz.events.ModelEvent(barmatz.events.ModelEvent.VALUE_CHANGED, key, value));
};
/** barmatz.net.Encoding **/
barmatz.net.Encoding = {
	HTML5: 'text/plain',
	FORM: 'application/x-www-form-urlencoded',
	FILES: 'multipart/form-data'
};
/** barmatz.net.Loader **/
barmatz.net.Loader = function()
{
	barmatz.events.EventDispatcher.call(this);
	
	this.__xhr = null;
};

barmatz.net.Loader.UNSENT = 'UNSENT';
barmatz.net.Loader.OPENED = 'OPENED';
barmatz.net.Loader.HEADERS_RECEIVED = 'HEADERS_RECEIVED';
barmatz.net.Loader.LOADING = 'LOADING';
barmatz.net.Loader.DONE = 'DONE';
barmatz.net.Loader.serialize = function(object, prefix)
{
	var result, key, value;
	
	barmatz.utils.DataTypes.isNotUndefined(object);
	
	result = [];
	 
	for(key in object)
	{
		value = object[key];
		key = prefix ? prefix + "[" + key + "]" : key;
		result.push(typeof value == "object" ? this.serialize(value, key) : encodeURIComponent(key) + "=" + encodeURIComponent(value));
	}
	
	return result.join("&");
};
barmatz.net.Loader.prototype = new barmatz.events.EventDispatcher();
barmatz.net.Loader.prototype.constructor = barmatz.net.Loader;
barmatz.net.Loader.prototype._xhr = function()
{
	if(!this.__xhr)
		this.__xhr = window.XDomainRequest ? new XDomainRequest() : window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
		
	if(!this.__xhr)
		throw new Error('XMLHttpRequest is not supported');
	
	return this.__xhr;
};
barmatz.net.Loader.prototype.getState = function()
{
	switch(this._xhr().readyState)
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
};
barmatz.net.Loader.prototype.abort = function()
{
	this._xhr().abort();
};
barmatz.net.Loader.prototype.load = function(request)
{
	var _this, xhr, url, data, credentials, headers, contentTypeSet, params;
	
	barmatz.utils.DataTypes.isInstanceOf(request, barmatz.net.Request);
	
	_this = this;
	xhr = this._xhr();
	url = request.getURL();
	data = request.getData();
	credentials = request.getCredentials();
	headers = request.getHeaders();

	if(data && request.getMethod() == barmatz.net.Methods.GET)
		url += (url.indexOf('?') > -1 ? '&' : '?') + barmatz.net.Loader.serialize(data);
	
	if(xhr instanceof XMLHttpRequest)
		xhr.addEventListener('readystatechange', onReadyStateChange);
	else if(isXDomainRequest())
	{
		xhr.onerror = onXHRError;
		xhr.onload = onXHRLoad;
		xhr.onprogress = onXHRProgress;
		xhr.ontimeout = onXHRTimeout;
	}
		
	params = [request.getMethod(), url];
	
	if(isXDomainRequest())
	{
		params.push(request.getAsync());
		if(credentials)
			params.push(credentials.getUser() || null, credentials.getPassword() || null);
	}
	
	try
	{
		xhr.open.apply(xhr, params);
	
		if(!isXDomainRequest())
		{
			if(headers)
				barmatz.utils.Array.forEach(headers, function(item, index, collection)
				{
					xhr.setRequestHeader(item.getHeader(), item.getValue());
					if(item.getHeader().toLowerCase() == 'content-type')
						contentTypeSet = true;
				});
			
			if(!contentTypeSet)
				xhr.setRequestHeader('Content-Type', barmatz.net.Encoding.FORM);
		}
		
		params = [];
		
		if(request.getMethod() == barmatz.net.Methods.POST)
			params.push(barmatz.net.Loader.serialize(data));
	
		xhr.send.apply(xhr, params);
	}
	catch(error)
	{
		console.error(error.stack);
		_this.dispatchEvent(new barmatz.events.LoaderEvent(barmatz.events.LoaderEvent.COMPLETE));
		_this.dispatchEvent(new barmatz.events.LoaderEvent(barmatz.events.LoaderEvent.ERROR, getResponse()));
	}
	
	function isXDomainRequest()
	{
		return window.XDomainRequest && xhr instanceof XDomainRequest;
	}
	
	function getResponse()
	{
		var url, data, type, status, headers;
		
		url = request.getURL();
		data = xhr.responseText || null;
		type = xhr.responseType || xhr.contentType || '';
		status = xhr.status || NaN;
		
		try
		{
			headers = xhr.getAllResponseHeaders().split('\n');
		}
		catch(error)
		{
			headers = [];
		}
		
		return new barmatz.net.Response(url, data, type, status, headers);
	}
	
	function onXHRError()
	{
		_this.dispatchEvent(new barmatz.events.LoaderEvent(barmatz.events.LoaderEvent.COMPLETE));
		_this.dispatchEvent(new barmatz.events.LoaderEvent(barmatz.events.LoaderEvent.ERROR, getResponse()));
	}
	
	function onXHRLoad()
	{
		_this.dispatchEvent(new barmatz.events.LoaderEvent(barmatz.events.LoaderEvent.SUCCESS, getResponse()));
		_this.dispatchEvent(new barmatz.events.LoaderEvent(barmatz.events.LoaderEvent.COMPLETE));
	}
	
	function onXHRProgress()
	{
		_this.dispatchEvent(new barmatz.events.LoaderEvent(barmatz.events.LoaderEvent.LOADING, request));
	}
	
	function onXHRTimeout()
	{
		_this.dispatchEvent(new barmatz.events.LoaderEvent(barmatz.events.LoaderEvent.COMPLETE));
		_this.dispatchEvent(new barmatz.events.LoaderEvent(barmatz.events.LoaderEvent.ERROR, getResponse()));
	}
	
	function onReadyStateChange(event)
	{
		var type, response;
		
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
				_this.dispatchEvent(new barmatz.events.LoaderEvent(barmatz.events.LoaderEvent.HEADERS_RECEIVED, request));
				break;
			case 3:
				_this.dispatchEvent(new barmatz.events.LoaderEvent(barmatz.events.LoaderEvent.LOADING, request));
				break;
			case 4:
				_this.dispatchEvent(new barmatz.events.LoaderEvent(barmatz.events.LoaderEvent.COMPLETE));
				
				response = getResponse();
				
				if(response.getStatus() == 200)
					_this.dispatchEvent(new barmatz.events.LoaderEvent(barmatz.events.LoaderEvent.SUCCESS, response));
				else
					_this.dispatchEvent(new barmatz.events.LoaderEvent(barmatz.events.LoaderEvent.ERROR, response));
				break;
		}
	}
};
/** barmatz.net.Methods **/
barmatz.net.Methods = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE'	
};
/** barmatz.net.Request */
barmatz.net.Request = function(url)
{
	barmatz.utils.DataTypes.isNotUndefined(url);
	barmatz.utils.DataTypes.isTypeOf(url, 'string');
	barmatz.mvc.Model.call(this);
	this.set('url', url);
	this.set('method', barmatz.net.Methods.GET);
	this.set('async', true);
	this.set('data', null);
	this.set('credentials', null);
	this.set('headers', []);
};

barmatz.net.Request.prototype = new barmatz.mvc.Model();
barmatz.net.Request.prototype.constructor = barmatz.net.Request;
barmatz.net.Request.prototype.getData = function()
{
	return this.get('data');
};
barmatz.net.Request.prototype.setData = function(value)
{
	this.set('data', value);
};
barmatz.net.Request.prototype.getURL = function()
{
	return this.get('url');
};
barmatz.net.Request.prototype.setURL = function(value)
{
	this.set('url', value);
};
barmatz.net.Request.prototype.getMethod = function()
{
	return this.get('method');
};
barmatz.net.Request.prototype.setMethod = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'string');
	this.set('method', value);
};
barmatz.net.Request.prototype.getAsync = function()
{
	return this.get('async');
};
barmatz.net.Request.prototype.setAsync = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'boolean');
	this.set('async', value);
};
barmatz.net.Request.prototype.getCredentials = function()
{
	return this.get('credentials');
};
barmatz.net.Request.prototype.setCredentails = function(value)
{
	barmatz.utils.DataTypes.isInstanceOf(value, barmatz.net.RequestCredentials);
	this.set('credentials', value);
};
barmatz.net.Request.prototype.getHeaders = function()
{
	return this.get('headers');
};
/** barmatz.net.RequestHeader **/
barmatz.net.RequestHeader = function(header, value)
{
	barmatz.utils.DataTypes.isTypeOf(header, 'string');
	barmatz.utils.DataTypes.isTypeOf(value, 'string');
	barmatz.mvc.Model.call(this);
	this.set('header', header);
	this.set('value', value);
};
barmatz.net.RequestHeader.prototype = new barmatz.mvc.Model();
barmatz.net.RequestHeader.prototype.constructor = barmatz.net.RequestHeader;
barmatz.net.RequestHeader.prototype.getHeader = function()
{
	return this.get('header');
};
barmatz.net.RequestHeader.prototype.setHeader = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'string');
	this.set('header', value);
};
barmatz.net.RequestHeader.prototype.getValue = function()
{
	return this.get('value');
};
barmatz.net.RequestHeader.prototype.setValue = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'string');
	this.set('value', value);
};
/** barmatz.net.Response **/
barmatz.net.Response = function(url, data, type, status, headers)
{
	barmatz.utils.DataTypes.isNotUndefined(data);
	barmatz.utils.DataTypes.isTypeOf(url, 'string');
	barmatz.utils.DataTypes.isTypeOf(type, 'string');
	barmatz.utils.DataTypes.isTypeOf(status, 'number');
	barmatz.utils.DataTypes.isInstanceOf(headers, window.Array);
	barmatz.mvc.Model.call(this);
	this.set('url', url);
	this.set('data', data);
	this.set('type', type);
	this.set('status', status);
	this.set('headers', headers);
};
barmatz.net.Response.prototype = new barmatz.mvc.Model();
barmatz.net.Response.prototype.constructor = barmatz.net.Response;
barmatz.net.Response.prototype.getURL = function()
{
	return this.get('url');
};
barmatz.net.Response.prototype.getData = function()
{
	return this.get('data');
};
barmatz.net.Response.prototype.getType = function()
{
	return this.get('type');
};
barmatz.net.Response.prototype.getStatus = function()
{
	return this.get('status');
};
barmatz.net.Response.prototype.getHeaders = function()
{
	return this.get('headers');
};
/** barmatz.forms.Directions **/
barmatz.forms.Directions = {
	RTL: 'right',
	LTR: 'left'
};

/** barmatz.forms.Methods **/
barmatz.forms.Methods = {
	GET: 'GET',
	POST: 'POST'
};
/** barmatz.forms.CollectionController **/
barmatz.forms.CollectionController = function(model, view)
{
	var _this = this;
	
	barmatz.utils.DataTypes.isNotUndefined(model);
	barmatz.utils.DataTypes.isNotUndefined(view);
	barmatz.utils.DataTypes.isInstanceOf(model, barmatz.mvc.Model, true);
	barmatz.utils.DataTypes.isInstanceOf(view, window.HTMLElement, true);
	barmatz.mvc.Controller.call(this);

	this._model = model;
	this._view = view;
	
	if(model)
	{
		model.addEventListener(barmatz.events.CollectionEvent.ITEM_ADDED, onModelItemAdded);
		model.addEventListener(barmatz.events.CollectionEvent.ITEM_REMOVED, onModelItemRemoved);
		model.forEach(function(item, index, collection)
		{
			_this._addItemModelToView(item);
		});
	}
	
	function onModelItemAdded(event)
	{
		barmatz.utils.DataTypes.isInstanceOf(event, barmatz.events.CollectionEvent);
		_this._addItemModelToView(event.getItem());
	}
	
	function onModelItemRemoved(event)
	{
		var index;
		
		barmatz.utils.DataTypes.isInstanceOf(event, barmatz.events.CollectionEvent);
		
		index = event.getIndex();
		
		if(view.children[index])
			view.removeChild(view.children[index]);
	}
};
barmatz.forms.CollectionController.prototype = new barmatz.mvc.Controller();
barmatz.forms.CollectionController.prototype.constructor = barmatz.forms.CollectionController;
barmatz.forms.CollectionController.prototype._addItemModelToView = function(model)
{
	var view;
	
	barmatz.utils.DataTypes.isInstanceOf(model, barmatz.mvc.Model);
	
	view = this._createItemViewFromModel(model);
	
	if(view)
		this._view.appendChild(view);
};
barmatz.forms.CollectionController.prototype._createItemViewFromModel = function(model)
{
	throw new Error('method must be overridden');
};
/** barmatz.forms.CollectionModel **/
barmatz.forms.CollectionModel = function()
{
	barmatz.mvc.Model.call(this);
	this.set('items', []);
};
barmatz.forms.CollectionModel.prototype = new barmatz.mvc.Model();
barmatz.forms.CollectionModel.prototype.constructor = barmatz.forms.CollectionModel;
barmatz.forms.CollectionModel.prototype.getNumItems = function()
{
	var items = this.get('items');
	return items ? items.length : 0;
};
barmatz.forms.CollectionModel.prototype.addItem = function(item)
{
	barmatz.utils.DataTypes.isInstanceOf(item, barmatz.mvc.Model);
	this.addItemAt(item, this.get('items').length);
};
barmatz.forms.CollectionModel.prototype.addItemAt = function(item, index)
{
	barmatz.utils.DataTypes.isInstanceOf(item, barmatz.mvc.Model);
	barmatz.utils.DataTypes.isTypeOf(index, 'number');
	this.get('items').splice(index, 0, item);
	this.dispatchEvent(new barmatz.events.CollectionEvent(barmatz.events.CollectionEvent.ITEM_ADDED, item, index));
};
barmatz.forms.CollectionModel.prototype.removeItem = function(item)
{
	barmatz.utils.DataTypes.isInstanceOf(item, barmatz.mvc.Model);
	this.removeItemAt(this.getItemIndex(item));
};
barmatz.forms.CollectionModel.prototype.removeItemAt = function(index)
{
	barmatz.utils.DataTypes.isTypeOf(index, 'number');
	this.dispatchEvent(new barmatz.events.CollectionEvent(barmatz.events.CollectionEvent.ITEM_REMOVED, this.get('items').splice(index, 1)[0], index));
};
barmatz.forms.CollectionModel.prototype.getItemAt = function(index)
{
	barmatz.utils.DataTypes.isTypeOf(index, 'number');
	return this.get('items')[index];
};
barmatz.forms.CollectionModel.prototype.getItemIndex = function(item)
{
	barmatz.utils.DataTypes.isInstanceOf(item, barmatz.mvc.Model);
	return this.get('items').indexOf(item);
};
barmatz.forms.CollectionModel.prototype.setItemIndex = function(item, index)
{
	var items;
	
	barmatz.utils.DataTypes.isInstanceOf(item, barmatz.mvc.Model);
	barmatz.utils.DataTypes.isTypeOf(index, 'number');
	
	items = this.get('items');
	items.splice(items.indexOf(item), 1);
	items.splice(index, 0, item);
};
barmatz.forms.CollectionModel.prototype.forEach = function(handler)
{
	barmatz.utils.DataTypes.isTypeOf(handler, 'function');
	barmatz.utils.Array.forEach(this.get('items'), function(item, index, collection)
	{
		handler.apply(this, arguments);
	}, this);
};
barmatz.forms.CollectionModel.prototype.find = function(filter)
{
	barmatz.utils.DataTypes.isTypeOf(filter, 'function');
	return barmatz.utils.Array.filter(this.get('items'), filter);
};
barmatz.forms.CollectionModel.prototype.toString = function()
{
	var values = [];
	
	this.forEach(function(item, index, collection)
	{
		values.push(item.toString());
	});
	
	return values.join(', ');
};
barmatz.forms.CollectionModel.prototype.toArray = function()
{
	return this.get('items').slice(0);
};

/** barmatz.forms.Config **/
barmatz.forms.Config = {
	BASE_URL: 'http://localhost:8080/clients/ofirvardi/forms'
};

/** barmatz.forms.FormController **/
barmatz.forms.FormController = function(model, formView, submitButtonView)
{
	var submittingForm, loadingDialog;

	barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.FormModel);
	barmatz.utils.DataTypes.isInstanceOf(formView, HTMLFormElement);
	barmatz.utils.DataTypes.isInstanceOf(submitButtonView, window.HTMLElement);
	barmatz.mvc.Controller.call(this);
	
	formView.name = model.getName();
	formView.method = model.getMethod();
	formView.encoding = model.getEncoding();
	formView.setAttribute('onsubmit', 'return false;');
	formView.addEventListener('submit', onViewSubmit);
	
	function addModelListeners()
	{
		model.addEventListener(barmatz.events.FormEvent.SUBMITTING, onModelSubmitting);
		model.addEventListener(barmatz.events.FormEvent.SUBMITTED, onModelSubmitted);
		model.addEventListener(barmatz.events.FormEvent.SUBMISSION_FAILED, onModelSubmitionFailed);
	}
	 
	function removeModelListeners()
	{
		model.removeEventListener(barmatz.events.FormEvent.SUBMITTING, onModelSubmitting);
		model.removeEventListener(barmatz.events.FormEvent.SUBMITTED, onModelSubmitted);
		model.removeEventListener(barmatz.events.FormEvent.SUBMISSION_FAILED, onModelSubmitionFailed);
	}
	 
	function addLoadingDialog()
	{
		if(!loadingDialog)
			loadingDialog = barmatz.forms.factories.DOMFactory.createLoadingDialog(formView);
	}
	 
	function removeLoadingDialog()
	{
		if(loadingDialog)
		{
			barmatz.forms.factories.DOMFactory.destroyLoadingDialog(loadingDialog);
			loadingDialog = null;
		}
	}
	
	function submit()
	{
		if(!submittingForm)
		{
			addModelListeners();
			
			if(model.isValid())
				model.submit();
		}
	}
	 
	function onViewSubmit(event)
	{
		submit();
	}
	 
	function onModelSubmitting(event)
	{
		submittingForm = true;
		addLoadingDialog();
	}
	 
	function onModelSubmitted(event)
	{
		submittingForm = false;
		submitButtonView.innerHTML = barmatz.forms.Language.form.submit.success;
		submitButtonView.disabled = true;
		removeModelListeners(); 
		removeLoadingDialog();
	}
	 
	function onModelSubmitionFailed(event)
	{
		submittingForm = false;
		submitButtonView.innerHTML = barmatz.forms.Language.form.submit.error;
		removeModelListeners();
		removeLoadingDialog();
	 }
};
barmatz.forms.FormController.prototype = new barmatz.mvc.Controller();
barmatz.forms.FormController.prototype.constructor = barmatz.forms.FormController;
/** barmatz.forms.FormModel **/
barmatz.forms.FormModel = function()
{
	barmatz.forms.CollectionModel.call(this);
	this.set('name', barmatz.forms.FormModel.defaults.name);
	this.set('submitButtonLabel', barmatz.forms.FormModel.defaults.submitButtonLabel);
	this.set('method', barmatz.forms.FormModel.defaults.method);
	this.set('encoding', barmatz.forms.FormModel.defaults.encoding);
	this.set('created', barmatz.forms.FormModel.defaults.created);
	this.set('fingerprint', barmatz.forms.FormModel.defaults.fingerprint);
	this.set('stylesheets', barmatz.forms.FormModel.defaults.stylesheets);
	this.set('direction', barmatz.forms.FormModel.defaults.direction);
	this.set('targetEmail', barmatz.forms.FormModel.defaults.targetEmail);
	this.set('layoutId', barmatz.forms.FormModel.defaults.layoutId);
	this.set('language', barmatz.forms.FormModel.defaults.language);
	this.set('internalAPI', barmatz.forms.FormModel.defaults.internalAPI);
	this.set('externalAPI', barmatz.forms.FormModel.defaults.externalAPI);
};
barmatz.forms.FormModel.defaults = {
	name: '',
	submitButtonLabel: 'שלח',
	method: barmatz.forms.Methods.GET,
	encoding: barmatz.net.Encoding.FORM,
	created: new Date('Invalid'),
	fingerprint: null,
	stylesheets: [],
	direction: barmatz.forms.Directions.RTL,
	targetEmail: 'randomalia@gmail.com',
	layoutId: 1,
	language: 'he',
	internalAPI: barmatz.forms.Config.BASE_URL + '/api/form/submit.php',
	externalAPI: ''
};
barmatz.forms.FormModel.prototype = new barmatz.forms.CollectionModel();
barmatz.forms.FormModel.prototype.constructor = barmatz.forms.FormModel;
barmatz.forms.FormModel.prototype.getName = function()
{
	return this.get('name');
};
barmatz.forms.FormModel.prototype.setName = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'string');
	this.set('name', value);
};
barmatz.forms.FormModel.prototype.getSubmitButtonLabel = function()
{
	return this.get('submitButtonLabel');
};
barmatz.forms.FormModel.prototype.setSubmitButtonLabel = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'string');
	this.set('submitButtonLabel', value);
};
barmatz.forms.FormModel.prototype.getMethod = function()
{
	return this.get('method');
};
barmatz.forms.FormModel.prototype.setMethod = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'string');
	this.set('method', value);
};
barmatz.forms.FormModel.prototype.getEncoding = function()
{
	return this.get('encoding');
};
barmatz.forms.FormModel.prototype.setEncoding = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'string');
	this.set('encoding', value);
};
barmatz.forms.FormModel.prototype.getCreated = function()
{
	return this.get('created');
};
barmatz.forms.FormModel.prototype.setCreated = function(value)
{
	barmatz.utils.DataTypes.isInstanceOf(value, Date);
	this.set('created', value);
};
barmatz.forms.FormModel.prototype.getFingerprint = function()
{
	return this.get('fingerprint');
};
barmatz.forms.FormModel.prototype.setFingerprint = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'string');

	if(!this.fingerprint)
		this.set('fingerprint', value);
};
barmatz.forms.FormModel.prototype.getStylesheets = function()
{
	return this.get('stylesheets');
};
barmatz.forms.FormModel.prototype.setStylesheets = function(value)
{
	barmatz.utils.DataTypes.isInstanceOf(value, window.Array);
	this.set('stylesheets', value);
};
barmatz.forms.FormModel.prototype.getDirection = function()
{
	return this.get('direction');
};
barmatz.forms.FormModel.prototype.setDirection = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'string');
	this.set('direction', value);
};
barmatz.forms.FormModel.prototype.getTargetEmail = function()
{
	return this.get('targetEmail');
};
barmatz.forms.FormModel.prototype.setTargetEmail = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'string');
	this.set('targetEmail', value);
};
barmatz.forms.FormModel.prototype.getLayoutId = function()
{
	return this.get('layoutId');
};
barmatz.forms.FormModel.prototype.setLayoutId = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'number');
	this.set('layoutId', value);
};
barmatz.forms.FormModel.prototype.getLanguage = function()
{
	return this.get('language');
};
barmatz.forms.FormModel.prototype.setLanguage = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'string');
	this.set('language', value);
	this.loadLanguage();
};
barmatz.forms.FormModel.prototype.getInternalAPI = function()
{
	return this.get('internalAPI');
};
barmatz.forms.FormModel.prototype.setInternalAPI = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'string');
	this.set('internalAPI', value);
};
barmatz.forms.FormModel.prototype.getExternalAPI = function()
{
	return this.get('externalAPI');
};
barmatz.forms.FormModel.prototype.setExternalAPI = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'string');
	this.set('externalAPI', value);
};
barmatz.forms.FormModel.prototype.addItem = function(item)
{
	barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.FormItemModel);
	barmatz.forms.CollectionModel.prototype.addItem.call(this, item);
};
barmatz.forms.FormModel.prototype.addItemAt = function(item, index)
{
	barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.FormItemModel);
	barmatz.utils.DataTypes.isTypeOf(index, 'number');
	barmatz.forms.CollectionModel.prototype.addItemAt.call(this, item, index);
};
barmatz.forms.FormModel.prototype.removeItem = function(item)
{
	barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.FormItemModel);
	barmatz.forms.CollectionModel.prototype.removeItem.call(this, item);
};
barmatz.forms.FormModel.prototype.getItemIndex = function(item)
{
	barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.FormItemModel);
	return barmatz.forms.CollectionModel.prototype.getItemIndex.call(this, item);
};
barmatz.forms.FormModel.prototype.setItemIndex = function(item, index)
{
	barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.FormItemModel);
	barmatz.utils.DataTypes.isTypeOf(index, 'number');
	return barmatz.forms.CollectionModel.prototype.setItemIndex.call(this, item, index);
};
barmatz.forms.FormModel.prototype.getData = function(data)
{
	return {f: this.getFingerprint(), d: JSON.stringify(data)};	
},
barmatz.forms.FormModel.prototype.getFieldsAsJSON = function()
{
	var json = [];
	
	this.forEach(function(item, index, collection)
	{
		var field = {type: item.getType()};
		
		if(item instanceof barmatz.forms.fields.AbstractFieldModel)
			field.name = item.getName();
		
		if(item instanceof barmatz.forms.fields.HiddenFieldModel)
			field.value = item.getValue();
			
		if(item instanceof barmatz.forms.fields.FieldModel)
		{
			field.label = item.getLabel();
			field.mandatory = item.getMandatory();
			field.enabled = item.getEnabled();
			field.validator = item.getValidator();
			field.width = item.getWidth();
		}
		
		if(item instanceof barmatz.forms.fields.FileFieldModel)
			field.accept = item.getAccept();

		if(item instanceof barmatz.forms.fields.TextFieldModel)
		{
			field.max = item.getMax();
			field.description = item.getDescription();
		}
		
		if(item instanceof barmatz.forms.fields.TextAreaFieldModel)
		{
			field.rows = item.getRows();
			field.cols = item.getCols();
		}
		
		if(item instanceof barmatz.forms.fields.CheckboxFieldModel)
			field.checked = item.getChecked();
		
		if(item instanceof barmatz.forms.fields.DropboxModel)
		{
			field.items = [];
			item.forEach(function(item, index, collection)
			{
				field.items.push({label: item.getLabel(), value: item.getValue()});
			});
		}
		
		if(item instanceof barmatz.forms.fields.HTMLContentModel)
			field.content = item.getContent();
		
		json.push(field);
	});
	
	return JSON.stringify(json);
};
barmatz.forms.FormModel.prototype.reset = function()
{
	this.set('name', barmatz.forms.FormModel.defaults.name);
	this.set('submitButtonLabel', barmatz.forms.FormModel.defaults.submitButtonLabel);
	this.set('method', barmatz.forms.FormModel.defaults.method);
	this.set('encoding', barmatz.forms.FormModel.defaults.encoding);
	this.set('created', barmatz.forms.FormModel.defaults.created);
	this.set('fingerprint', barmatz.forms.FormModel.defaults.fingerprint);
	this.set('stylesheets', barmatz.forms.FormModel.defaults.stylesheets);
	this.set('direction', barmatz.forms.FormModel.defaults.direction);
	this.set('targetEmail', barmatz.forms.FormModel.defaults.targetEmail);
	this.set('layoutId', barmatz.forms.FormModel.defaults.layoutId);
	this.set('language', barmatz.forms.FormModel.defaults.language);
	this.set('internalAPI', barmatz.forms.FormModel.defaults.internalAPI);
	this.set('externalAPI', barmatz.forms.FormModel.defaults.externalAPI);
	while(this.getNumItems() > 0)
		this.removeItemAt(this.getNumItems() - 1);
};
barmatz.forms.FormModel.prototype.save = function(model)
{
	var _this = this, request, loader;

	barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.users.UserModel);
	
	this.dispatchEvent(new barmatz.events.FormEvent(barmatz.events.FormEvent.SAVING));

	request = new barmatz.net.Request(barmatz.forms.Config.BASE_URL + '/api/form/save.php');
	request.setMethod(barmatz.net.Methods.POST);
	request.setData({
		fin: this.getFingerprint() || null,
		nam: this.getName(),
		fie: this.getFieldsAsJSON(),
		ema: this.getTargetEmail(),
		int: this.getInternalAPI(),
		ext: this.getExternalAPI(),
		sub: this.getSubmitButtonLabel(),
		met: this.getMethod(),
		enc: this.getEncoding(),
		sty: JSON.stringify(this.getStylesheets()),
		dir: this.getDirection(),
		lay: this.getLayoutId(),
		lan: this.getLanguage()
	});
	loader = new barmatz.net.Loader();
	addLoaderListeners();
	loader.load(request);

	function addLoaderListeners()
	{
		loader.addEventListener(barmatz.events.LoaderEvent.SUCCESS, onLoaderSuccess);
		loader.addEventListener(barmatz.events.LoaderEvent.ERROR, onLoaderError);
	}
	
	function removeLoaderListeners()
	{
		loader.removeEventListener(barmatz.events.LoaderEvent.SUCCESS, onLoaderSuccess);
		loader.removeEventListener(barmatz.events.LoaderEvent.ERROR, onLoaderError);
	}
	
	function onLoaderSuccess(event)
	{
		var data;
		
		barmatz.utils.DataTypes.isInstanceOf(event, barmatz.events.LoaderEvent);
		
		removeLoaderListeners();
		
		try
		{
			data = JSON.parse(event.getResponse().getData());
		}
		catch(error)
		{
			console.error(error.stack);
			return;
		}
			
		if(data.fingerprint)
			_this.set('fingerprint', data.fingerprint);
		
		_this.dispatchEvent(new barmatz.events.FormEvent(barmatz.events.FormEvent.SAVED));
	}
	
	function onLoaderError(event)
	{
		removeLoaderListeners();
		_this.dispatchEvent(new barmatz.events.FormEvent(barmatz.events.FormEvent.ERROR_SAVING));
	}
};
barmatz.forms.FormModel.prototype.saveAs = function(model, name)
{
	barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.users.UserModel);
	barmatz.utils.DataTypes.isNotUndefined(name);
	barmatz.utils.DataTypes.isTypeOf(name, 'string');
	this.set('name', name);
	this.save(model);
};
barmatz.forms.FormModel.prototype.loadByFingerprint = function(fingerprint)
{
	var _this, request, loader;
	
	barmatz.utils.DataTypes.isTypeOf(fingerprint, 'string');
	
	_this = this;
	request = new barmatz.net.Request(barmatz.forms.Config.BASE_URL + '/api/form.php');
	request.setMethod(barmatz.net.Methods.GET);
	request.setData({f: fingerprint});
	loader = new barmatz.net.Loader();
	addLoaderListeners();
	loader.load(request);
	this.dispatchEvent(new barmatz.events.FormEvent(barmatz.events.FormEvent.LOADING_FORM));

	function addLoaderListeners()
	{
		loader.addEventListener(barmatz.events.LoaderEvent.SUCCESS, onLoaderSuccess);
		loader.addEventListener(barmatz.events.LoaderEvent.ERROR, onLoaderError);
	}
	
	function removeLoaderListeners()
	{
		loader.removeEventListener(barmatz.events.LoaderEvent.SUCCESS, onLoaderSuccess);
		loader.removeEventListener(barmatz.events.LoaderEvent.ERROR, onLoaderError);
	}
	
	function objectToFormModel(data)
	{
		var model, fieldModel;
		
		barmatz.utils.DataTypes.isTypeOf(data, 'object');
		
		model = barmatz.forms.factories.ModelFactory.createFormModel();
		model.setCreated(barmatz.utils.Date.toDate(data.created));
		model.setDirection(data.direction);
		model.setEncoding(data.encoding);
		model.setLanguage(data.language);
		model.setLayoutId(parseFloat(data.layoutId));
		model.setMethod(data.method);
		model.setName(data.name);
		model.setStylesheets(data.stylesheets);
		model.setSubmitButtonLabel(data.submitButtonLabel);
		model.setTargetEmail(data.email);
		model.setInternalAPI(data.internalAPI || '');
		model.setExternalAPI(data.externalAPI || '');
		barmatz.utils.Array.forEach(data.fields, function(item, index, collection)
		{
			fieldModel = barmatz.forms.factories.ModelFactory.createFormFieldModel(item.type, item.name || '');
				
			if(fieldModel instanceof barmatz.forms.fields.FieldModel)
			{
				fieldModel.setLabel(item.label || '');
				fieldModel.setMandatory(item.mandatory || false);
				fieldModel.setEnabled(item.enabled || true);
				fieldModel.setValidator(barmatz.forms.factories.ModelFactory.createValidatorModel(item.validator));
				fieldModel.setWidth(item.width || NaN);
			}
			
			if(fieldModel instanceof barmatz.forms.fields.HiddenFieldModel)
				fieldModel.setValue(item.value || '');
			
			if(fieldModel instanceof barmatz.forms.fields.FileFieldModel)
				fieldModel.setAccept(item.accept || []);
			
			if(fieldModel instanceof barmatz.forms.fields.TextFieldModel)
			{
				fieldModel.setMax(item.max || NaN);
				fieldModel.setDescription(item.description || '');
			}
			
			if(fieldModel instanceof barmatz.forms.fields.TextAreaFieldModel)
			{
				fieldModel.setRows(item.rows || 2);
				fieldModel.setCols(item.cols || 20);
			}
			
			if(fieldModel instanceof barmatz.forms.fields.CheckboxFieldModel)
				fieldModel.setChecked(item.checked || false);
			
			if(fieldModel instanceof barmatz.forms.fields.DropboxModel)
				barmatz.utils.Array.forEach(item.items, function(item, index, collection)
				{
					fieldModel.addItem(new barmatz.forms.fields.DropboxItemModel(item.label || '', item.value || ''))
				});
			
			if(fieldModel instanceof barmatz.forms.fields.HTMLContentModel)
				fieldModel.setContent(item.content || '');
			
			model.addItem(fieldModel);
		});
		
		return model;
	}
	
	function onLoaderSuccess(event)
	{
		var data;

		barmatz.utils.DataTypes.isInstanceOf(event, barmatz.events.LoaderEvent);

		removeLoaderListeners();
		
		try
		{
			data = JSON.parse(event.getResponse().getData());
			_this.copy(data.fingerprint, objectToFormModel(data));
			_this.dispatchEvent(new barmatz.events.FormEvent(barmatz.events.FormEvent.LOADING_FORM_COMPLETE));
		}
		catch(error)
		{
			console.error(error.stack);
			onLoaderError(event);
			return;
		}
	}
	
	function onLoaderError(event)
	{
		removeLoaderListeners();
		_this.dispatchEvent(new barmatz.events.FormEvent(barmatz.events.FormEvent.LOADING_FORM_ERROR));
	}
};
barmatz.forms.FormModel.prototype.deleteForm = function()
{
	var _this, request, loader;
	
	_this = this;
	
	this.dispatchEvent(new barmatz.events.FormEvent(barmatz.events.FormEvent.DELETING));

	request = new barmatz.net.Request(barmatz.forms.Config.BASE_URL + '/api/form/delete.php');
	request.setMethod(barmatz.net.Methods.POST);
	request.setData({f: this.getFingerprint()});
	
	loader = new barmatz.net.Loader();
	addLoaderListeners();
	loader.load(request);

	function addLoaderListeners()
	{
		loader.addEventListener(barmatz.events.LoaderEvent.SUCCESS, onLoaderSuccess);
		loader.addEventListener(barmatz.events.LoaderEvent.ERROR, onLoaderError);
	}
	
	function removeLoaderListeners()
	{
		loader.removeEventListener(barmatz.events.LoaderEvent.SUCCESS, onLoaderSuccess);
		loader.removeEventListener(barmatz.events.LoaderEvent.ERROR, onLoaderError);
	}
	
	function onLoaderSuccess(event)
	{
		barmatz.utils.DataTypes.isNotUndefined(event);
		barmatz.utils.DataTypes.isInstanceOf(event, barmatz.events.LoaderEvent);
		
		removeLoaderListeners();
		_this.dispatchEvent(new barmatz.events.FormEvent(barmatz.events.FormEvent.DELETED));
	}
	
	function onLoaderError(event)
	{
		removeLoaderListeners();
		_this.dispatchEvent(new barmatz.events.FormEvent(barmatz.events.FormEvent.DELETION_FAIL));
	}
};
barmatz.forms.FormModel.prototype.isValid = function()
{
	var invalidFields = 0;
	
	this.forEach(function(item, index, collection)
	{
		if(item instanceof barmatz.forms.fields.FieldModel && !item.validate())
			invalidFields++;
	});
	
	return invalidFields == 0;
};
barmatz.forms.FormModel.prototype.submit = function()
{
	var _this, request, loader, data;
	
	_this = this;
	data = {};
	
	this.dispatchEvent(new barmatz.events.FormEvent(barmatz.events.FormEvent.SUBMITTING));
	this.forEach(function(item, index, collection)
	{
		if(!(item instanceof barmatz.forms.fields.HTMLContentModel))
			data[item.getName()] = item.getValue();
	});

	request = new barmatz.net.Request(this.getInternalAPI());
	request.setMethod(this.getMethod());
	request.setData(this.getData(data));
	request.getHeaders().push(new barmatz.net.RequestHeader('Content-Type', this.getEncoding()));
	
	loader = new barmatz.net.Loader();
	addLoaderListeners();
	loader.load(request);

	function addLoaderListeners()
	{
		loader.addEventListener(barmatz.events.LoaderEvent.SUCCESS, onLoaderSuccess);
		loader.addEventListener(barmatz.events.LoaderEvent.ERROR, onLoaderError);
	}
	
	function removeLoaderListeners()
	{
		loader.removeEventListener(barmatz.events.LoaderEvent.SUCCESS, onLoaderSuccess);
		loader.removeEventListener(barmatz.events.LoaderEvent.ERROR, onLoaderError);
	}
	
	function onLoaderSuccess(event)
	{
		barmatz.utils.DataTypes.isInstanceOf(event, barmatz.events.LoaderEvent);
		removeLoaderListeners();
		_this.dispatchEvent(new barmatz.events.FormEvent(barmatz.events.FormEvent.SUBMITTED));
	}
	
	function onLoaderError(event)
	{
		removeLoaderListeners();
		_this.dispatchEvent(new barmatz.events.FormEvent(barmatz.events.FormEvent.SUBMISSION_FAILED));
	}
};
barmatz.forms.FormModel.prototype.getLeads = function()
{
	var _this, request, loader;
	
	_this = this;
	
	request = new barmatz.net.Request(barmatz.forms.Config.BASE_URL + '/api/form/leads.php');
	request.setMethod(barmatz.net.Methods.GET);
	request.setData({f: this.getFingerprint()});
	
	loader = new barmatz.net.Loader();
	addLoaderListeners();
	loader.load(request);
	
	function addLoaderListeners()
	{
		loader.addEventListener(barmatz.events.LoaderEvent.SUCCESS, onLoaderSuccess);
		loader.addEventListener(barmatz.events.LoaderEvent.ERROR, onLoaderError);
	}
	
	function removeLoaderListeners()
	{
		loader.removeEventListener(barmatz.events.LoaderEvent.SUCCESS, onLoaderSuccess);
		loader.removeEventListener(barmatz.events.LoaderEvent.ERROR, onLoaderError);
	}
	
	function onLoaderSuccess(event)
	{
		var data;
		
		barmatz.utils.DataTypes.isInstanceOf(event, barmatz.events.LoaderEvent);
		
		data = JSON.parse(event.getResponse().getData());
		
		removeLoaderListeners();
		_this.dispatchEvent(new barmatz.events.FormEvent(barmatz.events.FormEvent.GET_LEADS_SUCCESS, data));
	}
	
	function onLoaderError(event)
	{
		removeLoaderListeners();
		_this.dispatchEvent(new barmatz.events.FormEvent(barmatz.events.FormEvent.GET_LEADS_FAIL));
	}
	
};
barmatz.forms.FormModel.prototype.copy = function(fingerprint, data)
{
	var _this, field, fieldData, i;
	
	barmatz.utils.DataTypes.isTypeOf(fingerprint, 'string');
	barmatz.utils.DataTypes.isInstanceOf(data, barmatz.forms.FormModel);

	_this = this;
	
	this.setName(data.getName() || barmatz.forms.FormModel.defaults.name);
	this.setSubmitButtonLabel(data.getSubmitButtonLabel() || barmatz.forms.FormModel.defaults.submitButtonLabel);
	this.setCreated(new Date(data.getCreated().getTime()));
	this.setMethod(data.getMethod() || barmatz.forms.FormModel.defaults.method);
	this.setEncoding(data.getEncoding() || barmatz.forms.FormModel.defaults.encoding);
	this.setDirection(data.getDirection() || barmatz.forms.FormModel.defaults.direction);
	this.setTargetEmail(data.getTargetEmail() || barmatz.forms.FormModel.defaults.targetEmail);
	this.setLayoutId(data.getLayoutId() || barmatz.forms.FormModel.defaults.layoutId);
	this.setLanguage(data.getLanguage() || barmatz.forms.FormModel.defaults.language);
	this.setFingerprint(fingerprint);
	this.setStylesheets(data.getStylesheets().slice(0) || barmatz.forms.FormModel.defaults.stylesheets);
	this.setInternalAPI(data.getInternalAPI() || barmatz.forms.FormModel.defaults.internalAPI);
	this.setExternalAPI(data.getExternalAPI() || barmatz.forms.FormModel.defaults.externalAPI);

	while(this.getNumItems() > 0)
		this.removeItemAt(this.getNumItems() - 1);
	
	data.forEach(function(item, index, collection)
	{
		addField(item);
	});
	
	function addField(model)
	{
		var field, name, dataItem, i;

		barmatz.utils.DataTypes.isInstancesOf(model, [barmatz.forms.fields.AbstractFieldModel, barmatz.forms.fields.HTMLContentModel]);
		
		if(!(model instanceof barmatz.forms.fields.HTMLContentModel))
			name = model.getName();
		
		switch(model.getType())
		{
			default:
				throw new Error('Unknown type');
				break;
			case barmatz.forms.fields.FieldTypes.HTML_CONTENT:
				field = new barmatz.forms.fields.HTMLContentModel();
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
			case barmatz.forms.fields.FieldTypes.PHONE:
				field = new barmatz.forms.fields.PhoneFieldModel(name);
				break;
		}
		
		if(field instanceof barmatz.forms.fields.HTMLContentModel)
			field.setContent(model.getContent() || '');

		if(field instanceof barmatz.forms.fields.HiddenFieldModel)
			field.setValue(model.getValue() || '');
			
		if(field instanceof barmatz.forms.fields.FieldModel)
		{
			field.setLabel(model.getLabel() || '');
			field.setMandatory(model.getMandatory() || false);
			field.setEnabled(model.getEnabled() || true);
			field.setValidator(barmatz.forms.factories.ModelFactory.createValidatorModel(model.getValidator() || null));
			field.setWidth(model.getWidth() || NaN);
		}
		
		if(field instanceof barmatz.forms.fields.FileFieldModel)
			field.setAccept(model.getAccept());

		if(field instanceof barmatz.forms.fields.TextFieldModel)
		{
			field.setMax(parseInt(model.getMax() || NaN));
			field.setDescription(model.getDescription() || '');
		}
		
		if(field instanceof barmatz.forms.fields.CheckboxFieldModel)
			field.setChecked(model.getChecked());
		
		if(field instanceof barmatz.forms.fields.DropboxModel)
			model.forEach(function(item, index, collection)
			{
				field.addItem(barmatz.forms.factories.ModelFactory.createDropboxItemModel(item.getLabel(), item.getValue()));
			});
		
		_this.addItem(field);
	}
};
barmatz.forms.FormModel.prototype.loadLanguage = function()
{
	var _this, loader;
	
	_this = this;
	
	loader = new barmatz.net.Loader();
	loader.addEventListener(barmatz.events.LoaderEvent.SUCCESS, onLoadLanguageSuccess);
	loader.addEventListener(barmatz.events.LoaderEvent.ERROR, onLoadLanguageError);
	loader.load(new barmatz.net.Request(barmatz.forms.Config.BASE_URL + '/lang/form_' + _this.getLanguage() + '.php'));

	function removeLoadLanguageListeners(loader)
	{
		barmatz.utils.DataTypes.isInstanceOf(loader, barmatz.net.Loader);
		loader.removeEventListener(barmatz.events.LoaderEvent.SUCCESS, onLoadLanguageSuccess);
		loader.removeEventListener(barmatz.events.LoaderEvent.ERROR, onLoadLanguageError);
	}
	
	function onLoadLanguageSuccess(event)
	{
		var data;
	
		barmatz.utils.DataTypes.isInstanceOf(event, barmatz.events.LoaderEvent);
	
		removeLoadLanguageListeners(event.getTarget());
		
		try
		{
			data = JSON.parse(event.getResponse().getData());
			barmatz.forms.Language = data;
			_this.submitButtonLabel = barmatz.forms.Language.form.submit.label; 
		}
		catch(error)
		{
			console.error(error.stack);
			return;
		}
	}
	
	function onLoadLanguageError(event)
	{
		removeLoadLanguageListeners(event.getTarget());
	}
};
/** barmatz.forms.Language **/
barmatz.forms.Language = {
	form: {
		loading: 'טוען...',
		submit: {
			label: 'שלח',
			success: 'הטופס נשלח בהצלחה',
			error: 'שגי�?ה בשליחה! נסה שנית'
		},
		field: {
			errors: {
				emptyValue: 'השדה ריק',
				invalidValue: 'ערך ל�? נכון',
				invalidEmail: 'כתובת דו�?&quot;ל ל�? נכונה',
				invalidPhone: 'מספר טלפון ל�? תקין',
				minimumLength: 'הערך חייב להיות מינימו�? ${1} תווי�?',
				maximumLength: 'הערך חיי�? להיות מקסימו�? ${1} תווי�?',
				exactLength: 'הערך חיי�? להיות בדיוק ${1} תווי�?',
				greaterThan: 'הערך חייב להיות גדול מ-${1}',
				lesserThan: 'הערך חייב להיות קטן מ-${1}',
				digitsOnly: 'הערך יכול להכיל רק מספרי�?',
				noDigits: 'ערך �?ינו יכול להכיל מספרי�?'
			}
		}
	}
};
/** barmatz.forms.TypeModel **/
barmatz.forms.TypeModel = function(type)
{
	barmatz.utils.DataTypes.isNotUndefined(type);
	barmatz.utils.DataTypes.isTypeOf(type, 'string', true);
	barmatz.mvc.Model.call(this);
	this.set('type', type);
};
barmatz.forms.TypeModel.prototype = new barmatz.mvc.Model();
barmatz.forms.TypeModel.prototype.constructor = barmatz.forms.TypeModel;
barmatz.forms.TypeModel.prototype.getType = function()
{
	return this.get('type');
};
/** barmatz.forms.Validator **/
barmatz.forms.Validator = {
	NONE: 0X0,
	NOT_EMPTY: 0X1,
	EQUALS: 0x2,
	VALID_EMAIL: 0x4,
	VALID_PHONE: 0x8,
	MIN_LENGTH: 0x10,
	MAX_LENGTH: 0x20,
	EXACT_LENGTH: 0x40,
	GREATER_THAN: 0x80,
	LESSER_THAN: 0x100,
	DIGITS_ONLY: 0x200,
	NOT_DIGITS: 0x400,
	trim: function(string)
	{
		barmatz.utils.DataTypes.isTypeOf(string, 'string');
		return string.replace(/(^\s+|\s+$)/g, '');
	},
	notEmpty: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		return this.trim(value).length != 0;
	},
	equals: function(value, pattern)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		barmatz.utils.DataTypes.isTypesOrInstances(pattern, ['string'], [RegExp]);
		return new RegExp(pattern).test(value);
	},
	validEmail: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		return this.equals(value, /^[a-z0-9!#$%&'*+\/=?^_`"{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`"{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+([a-z].+)\b$/);
	},
	validPhone: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		return this.equals(value, new RegExp('^(' + barmatz.forms.fields.PhonePrefixes.join('|') + ')[2-9][0-9]{6}$'));
	},
	maxLength: function(value, length)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		barmatz.utils.DataTypes.isTypeOf(length, 'number');
		return value.length <= length;
	},
	minLength: function(value, length)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		barmatz.utils.DataTypes.isTypeOf(length, 'number');
		return value.length >= length;
	},
	exactLength: function(value, length)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		barmatz.utils.DataTypes.isTypeOf(length, 'number');
		return value.length == length;
	},
	greaterThan: function(valueA, valueB)
	{
		barmatz.utils.DataTypes.isTypeOf(valueA, 'number');
		barmatz.utils.DataTypes.isTypeOf(valueB, 'number');
		return valueA > valueB;
	},
	lesserThan: function(valueA, valueB)
	{
		barmatz.utils.DataTypes.isTypeOf(valueA, 'number');
		barmatz.utils.DataTypes.isTypeOf(valueB, 'number');
		return valueA < valueB;
	},
	digitsOnly: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		return this.equals(value, /^\d*$/);
	},
	notDigits: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		return this.equals(value, /^\D*$/);
	}
};
/** barmatz.forms.factories.ControllerFactory **/
barmatz.forms.factories.ControllerFactory = {
	createLoginController: function(model, userNameFieldView, passwordFieldView, submitButtonView, errorFieldView, dialogContainerView)
	{
		return new barmatz.forms.users.LoginController(model, userNameFieldView, passwordFieldView, submitButtonView, errorFieldView, dialogContainerView);
	},
	createToolboxController: function(model, view)
	{
		return new barmatz.forms.ui.ToolboxController(model, view);
	},
	createWorkspaceController: function(model, view, dialogContainerView)
	{
		return new barmatz.forms.ui.WorkspaceController(model, view, dialogContainerView);
	},
	createPropertiesController: function(view)
	{
		return new barmatz.forms.ui.PropertiesController(view);
	},
	createWorkspaceItemController: function(model, labelView, fieldView, mandatoryView, deleteButtonView)
	{
		return new barmatz.forms.ui.WorkspaceItemController(model, labelView, fieldView, mandatoryView, deleteButtonView);
	},
	createNewFieldDialogController: function(model, view, nameFieldView, labelFieldView, dialogContainerView)
	{
		return new barmatz.forms.ui.NewFieldDialogController(model, view, nameFieldView, labelFieldView, dialogContainerView);
	},
	createMenuController: function(model, iconView, itemsView)
	{
		return new barmatz.forms.ui.MenuController(model, iconView, itemsView);
	},
	createUserFormsListController: function(formModel, userModel, view, dialogView, dialogContainerView)
	{
		return new barmatz.forms.ui.UserFormsListController(formModel, userModel, view, dialogView, dialogContainerView);
	},
	createUserFormsListItemController: function(model, view, nameView, createdView, fingerprintView, dialogContainerView)
	{
		return new barmatz.forms.ui.UserFormsListItemController(model, view, nameView, createdView, fingerprintView, dialogContainerView);
	},
	createFormController: function(model, formView, submitButtonView)
	{
		return new barmatz.forms.FormController(model, formView, submitButtonView);
	},
	createDropboxItemsListController: function(model, view, addButtonView, resetButtonView, dialogContainerView)
	{
		return new barmatz.forms.fields.DropboxItemsListController(model, view, addButtonView, resetButtonView, dialogContainerView);
	},
	createDropboxItemsListItemController: function(model, labelView, valueView, editButtonView, dialogContainerView)
	{
		return new barmatz.forms.fields.DropboxItemsListItemController(model, labelView, valueView, editButtonView, dialogContainerView);
	},
	createFieldValidationOptionsController: function(model, options, dialogContainerView)
	{
		return new barmatz.forms.fields.FieldValidationOptionsController(model, options, dialogContainerView);
	},
	createFieldController: function(model, fieldView, errorMessageView)
	{
		return new barmatz.forms.fields.FieldController(model, fieldView, errorMessageView);
	},
	createJQueryDialogController: function(view)
	{
		return new barmatz.forms.ui.jquery.JQueryDialogController(view);
	},
	createLeadsController: function(userModel, formsListModel, formsListView, leadsListModel, leadsListWrapperView, leadsListView, containerView, panelsView, dialogContainerView)
	{
		return new barmatz.forms.ui.LeadsController(userModel, formsListModel, formsListView, leadsListModel, leadsListWrapperView, leadsListView, containerView, panelsView, dialogContainerView);
	},
	createLeadsListController: function(model, view)
	{
		return new barmatz.forms.ui.LeadsListController(model, view);
	},
	createLeadsFormsListController: function(model, view)
	{
		return new barmatz.forms.ui.LeadsFormsListController(model, view);
	},
	createContentController: function(model, view)
	{
		return new barmatz.forms.ui.ContentController(model, view);
	},
	createBuilderMenuController: function(formModel, userModel, newButtonView, saveButtonView, saveAsButtonView, loadButtonView, renameButtonView, exportButtonView, deleteButtonView, propertiesButtonView, logoutButtonView, dialogContainerView)
	{
		return new barmatz.forms.ui.BuilderMenuController(formModel, userModel, newButtonView, saveButtonView, saveAsButtonView, loadButtonView, renameButtonView, exportButtonView, deleteButtonView, propertiesButtonView, logoutButtonView, dialogContainerView);
	},
	createBuilderToolboxController: function(formModel, toolboxModel, toolboxView)
	{
		return new barmatz.forms.ui.BuilderToolboxController(formModel, toolboxModel, toolboxView);
	},
	createBuilderWorkspaceController: function(builderPageModel, formModel, formNameView, formSaveStatusView, itemsView, dialogContainerView)
	{
		return new barmatz.forms.ui.BuilderWorkspaceController(builderPageModel, formModel, formNameView, formSaveStatusView, itemsView, dialogContainerView)
	},
	createBuilderPropertiesController: function(builderPageModel, view)
	{
		return new barmatz.forms.ui.BuilderPropertiesController(builderPageModel, view);
	},
	createBuilderPageController: function(builderPageModel, formModel)
	{
		return new barmatz.forms.ui.pages.BuilderPageController(builderPageModel, formModel);
	},
	createPageController: function(contentView)
	{
		return new barmatz.forms.ui.pages.PageController(contentView);
	},
	createUsersMenuController: function(pageModel, newButtonView, findButtonView, allButtonView)
	{
		return new barmatz.forms.ui.UsersMenuController(pageModel, newButtonView, findButtonView, allButtonView);
	},
	createUsersPageController: function(pageModel, contentModel, newUserView, findUserView, allUsersView)
	{
		return new barmatz.forms.ui.pages.UsersPageController(pageModel, contentModel, newUserView, findUserView, allUsersView);
	},
	createTableController: function(model, tableView, headView, bodyView)
	{
		return new barmatz.forms.ui.DataTableController(model, tableView, headView, bodyView);
	},
	createTableUIDecoratorController: function(table, prevButtonView, nextButtonView, itemsPerPageView, currentPageView)
	{
		return new barmatz.forms.ui.DataTableUIDecoratorController(table, prevButtonView, nextButtonView, itemsPerPageView, currentPageView);
	}
}
/** barmatz.forms.factories.DOMFactory **/
barmatz.forms.factories.DOMFactory = {
	getBodyElement: function()
	{
		if(!this._bodyElement)
			this._bodyElement = document.getElementsByTagName('body')[0];
		return this._bodyElement;
	},
	createStylesheet: function(href)
	{
		var link;
		
		barmatz.utils.DataTypes.isNotUndefined(href);
		barmatz.utils.DataTypes.isTypeOf(href, 'string');
		
		link = this.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = href;
		return link;
	},
	addContent: function(content, container)
	{
		barmatz.utils.DataTypes.isNotUndefined(content);
		barmatz.utils.DataTypes.isInstanceOf(container, window.HTMLElement);
		
		if(content instanceof window.HTMLElement)
			container.appendChild(content);
		else if(content instanceof window.Array)
			barmatz.utils.Array.forEach(content, function(item, index, collection)
			{
				this.addContent(item, container);
			}, this);
		else
			container.innerHTML += content.toString();
	},
	clearElement: function(element)
	{
		barmatz.utils.DataTypes.isInstanceOf(element, window.HTMLElement);
		element.innerHTML = '';
	},
	createElement: function(tagName, className)
	{
		var element;
		
		barmatz.utils.DataTypes.isNotUndefined(tagName);
		barmatz.utils.DataTypes.isTypeOf(tagName, 'string');
		barmatz.utils.DataTypes.isTypeOf(className, 'string', true);
		
		element = document.createElement(tagName);
		
		if(className)
			element.className = className;
		
		return element;
	},
	createElementWithContent: function(tagName, className, content, appendChildWrapper)
	{
		var _this, element;
		
		barmatz.utils.DataTypes.isTypeOf(tagName, 'string');
		barmatz.utils.DataTypes.isTypeOf(className, 'string', true);
		barmatz.utils.DataTypes.isNotUndefined(content);
		barmatz.utils.DataTypes.isTypeOf(appendChildWrapper, 'function', true);
		
		_this = this;
		element = this.createElement(tagName, className);
		this.addContent(content, element);
		
		return element;
	},
	createButton: function(label, clickHandler, className)
	{
		var button;
		
		barmatz.utils.DataTypes.isTypeOf(label, 'string');
		barmatz.utils.DataTypes.isTypeOf(clickHandler, 'function', true);
		barmatz.utils.DataTypes.isTypeOf(className, 'string', true);
		
		button = this.createElementWithContent('button', className || '', label);
		
		if(clickHandler != null)
			button.addEventListener('click', clickHandler);
		
		this.formatButton(button);
		
		return button;
	},
	formatButton: function(button)
	{
		barmatz.utils.DataTypes.isInstanceOf(button, window.HTMLElement);
		jQuery(button).button();
	},
	createDropboxElement: function(model, selectedIndex)
	{
		var _this, dropbox;
		
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.DropboxModel);
		barmatz.utils.DataTypes.isTypeOf(selectedIndex, 'number', true);
		
		_this = this;
		dropbox = this.createElement('select');
		dropbox.name = model.getName();
		
		model.forEach(function(item, index, collection)
		{
			dropbox.appendChild(_this.createDropboxItemElement(item));
		});
		
		if(selectedIndex)
			dropbox.selectedIndex = selectedIndex;
		
		return dropbox;
	},
	createDropboxItemElement: function(model)
	{
		var item;
	
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.DropboxItemModel);
		
		item = this.createElementWithContent('option', '', model.getLabel());
		item.value = model.getValue();
		
		return item;
	},
	createFormWrapper: function(model)
	{
		var _this, wrapper;
		
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.FormModel);
		
		_this = this;
		wrapper = {
			form: barmatz.forms.factories.DOMFactory.createElement('form'),
			submitButton: barmatz.forms.factories.DOMFactory.createElementWithContent('button', 'forms-form-submit-button', model.getSubmitButtonLabel()),
			container: barmatz.forms.factories.DOMFactory.createElement('div', 'forms-form-wrapper forms-layout-' + model.getLayoutId())
		};

		wrapper.container.appendChild(this.createStylesheet(barmatz.forms.Config.BASE_URL + '/css/form.css'));

		barmatz.utils.Array.forEach(model.getStylesheets(), function(item, index, collection)
		{
			wrapper.container.appendChild(_this.createStylesheet(item));
		});

		
		switch(model.getDirection())
		{
			default:
				throw new Error('Unknown direction');
				break;
			case barmatz.forms.Directions.LTR:
				barmatz.utils.CSS.addClass(wrapper.container, 'forms-ltr');
				break;
			case barmatz.forms.Directions.RTL:
				barmatz.utils.CSS.addClass(wrapper.container, 'forms-rtl');
				break;
		}
		
		model.forEach(function(item, index, collection)
		{
			var field, errorMessage;
			
			field = _this.createFormFieldElement(item);
			
			if(!(item instanceof barmatz.forms.fields.HTMLContentModel))
				field.name = item.getName();
			
			if(item instanceof barmatz.forms.fields.FieldModel)
			{
				if(item instanceof barmatz.forms.fields.PhoneFieldModel)
					field.getElementsByTagName('input')[0].style.width = item.getWidth() + 'px';
				else
					field.style.width = item.getWidth() + 'px';
			}
			
			errorMessage = _this.createFormFieldErrorMessageElement();
			
			if(item instanceof barmatz.forms.fields.HTMLContentModel)
				wrapper.form.appendChild(_this.createFormFieldElement(item));
			else if(item instanceof barmatz.forms.fields.HiddenFieldModel)
				wrapper.form.appendChild(field);
			else
			{
				wrapper.form.appendChild(_this.createElementWithContent('div', 'forms-form-item', [
					_this.createElementWithContent('label', '', item.getLabel()), field,
				    _this.createElementWithContent('span', 'forms-form-item-mandatory', item.getMandatory() ? '*' : ''), errorMessage
				]));
				barmatz.forms.factories.ControllerFactory.createFieldController(item, field, errorMessage);
			}
		});

		wrapper.form.appendChild(this.createElementWithContent('div', 'forms-form-item forms-form-submit', wrapper.submitButton));
		wrapper.container.appendChild(wrapper.form);
		
		return wrapper;
		
	},
	createFormFieldElement: function(model)
	{
		var _this, field, type;
		
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.FormItemModel);
		
		_this = this;
		type = model.getType();
		field = this.createElement(getElementTagName(type || barmatz.forms.fields.FieldTypes.HTML_CONTENT));
		
		if(model instanceof barmatz.forms.fields.PhoneFieldModel)
			createPhoneField();
		
		if(field.tagName.toLowerCase() == 'input')
			field.type = type;
		
		setFieldPropertiesByModel(field, model);
		
		return field;
		
		function setFieldPropertiesByModel(field, model)
		{
			var max, prefix;
			
			barmatz.utils.DataTypes.isNotUndefined(field);
			barmatz.utils.DataTypes.isNotUndefined(model);
			barmatz.utils.DataTypes.isInstanceOf(field, window.HTMLElement);
			barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.FormItemModel);
			
			if(field.hasOwnProperty('value'))
				field.value = model.getValue();
			
			if(field.hasOwnProperty('enabled'))
				field.enabled = model.getEnabled();
			
			if(model instanceof barmatz.forms.fields.TextFieldModel)
			{
				max = model.getMax();
				if(!isNaN(max))
					field.maxLength = max;
			}
			
			if(model instanceof barmatz.forms.fields.CheckboxFieldModel)
				field.checked = model.getChecked();
			
			if(model instanceof barmatz.forms.fields.FileFieldModel)
				field.accept = model.getAccept();
			
			if(model instanceof barmatz.forms.fields.TextAreaFieldModel)
			{
				field.rows = model.getRows();
				field.cols = model.getCols();
			}
			
			if(model instanceof barmatz.forms.fields.DropboxModel)
			{
				field.multiple = model.getMultiple();
				
				model.forEach(function(item, index, collection)
				{
					field.appendChild(_this.createDropboxItemElement(item));
				});
			}
			
			if(model instanceof barmatz.forms.fields.PhoneFieldModel)
			{
				prefix = model.getPrefix();
				field.getElementsByTagName('select')[0].value = prefix;
				field.getElementsByTagName('input')[0].value = model.getValue().replace(prefix, '');
			}

			if(model instanceof barmatz.forms.fields.HTMLContentModel)
				field.innerHTML = model.getContent();
		}
		
		function getElementTagName(type)
		{
			barmatz.utils.DataTypes.isNotUndefined(type);
			barmatz.utils.DataTypes.isTypeOf(type, 'string');
			
			switch(type)
			{
				default:
					throw new Error('Unknown type');
					break;
				case barmatz.forms.fields.FieldTypes.HTML_CONTENT:
					return 'div';
					break;
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
				case barmatz.forms.fields.FieldTypes.PHONE:
					return 'div';
					break;
			}
		}
		
		function createPhoneField()
		{
			var phoneField, prefixModel;
			
			phoneField = _this.createElement('input');
			phoneField.name = 'phone';
			phoneField.maxLength = 7;
			
			prefixModel = barmatz.forms.factories.ModelFactory.createDropboxModel('phone-prefix');
			prefixModel.addItem(barmatz.forms.factories.ModelFactory.createDropboxItemModel('', ''));
			
			barmatz.forms.fields.PhonePrefixes.forEach(function(prefix)
			{
				prefixModel.addItem(barmatz.forms.factories.ModelFactory.createDropboxItemModel(prefix, prefix));
			});
	
			barmatz.utils.CSS.addClass(field, 'forms-phone-field');
			field.dir = 'ltr';
			field.appendChild(_this.createDropboxElement(prefixModel));
			field.appendChild(phoneField)
		}
	},
	createFieldWrapper: function(model, className)
	{
		var wrapper, label, field, mandatory;
		
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.FieldModel);
		barmatz.utils.DataTypes.isTypeOf(className, 'string', true);
		
		wrapper = this.createElement('div', className);
		label = wrapper.appendChild(this.createElementWithContent('label', '', model.getLabel() || ''));
		field = wrapper.appendChild(this.createFormFieldElement(model));
		mandatory = wrapper.appendChild(this.createElementWithContent('span', '', model.getMandatory() ? '*' : ''));
	
		return {wrapper: wrapper, label: label, field: field, mandatory: mandatory};
	},
	createSubmitButton: function(label, clickHandler)
	{
		var wrapper, button;
		
		barmatz.utils.DataTypes.isNotUndefined(label);
		barmatz.utils.DataTypes.isNotUndefined(clickHandler);
		barmatz.utils.DataTypes.isTypeOf(clickHandler, 'function');
		wrapper = this.createElement('div');
		button = this.createButton(label, clickHandler);
		wrapper.appendChild(button);
		
		return wrapper;
	},
	createToolbox: function()
	{
		return this.createElement('ul');
	},
	createWorkspaceWrapper: function(formName, saveStatus)
	{
		var formNameElement, saveStatusElement, workspaceElement;
		
		barmatz.utils.DataTypes.isTypeOf(formName, 'string', true);
		barmatz.utils.DataTypes.isTypeOf(saveStatus, 'string', true);
		
		formNameElement = this.createElementWithContent('h1', 'forms-workspace-header-form-name', formName || '');
		saveStatusElement = this.createElementWithContent('h3', 'forms-workspace-header-save-status', saveStatus || '');
		workspaceElement = this.createElement('table', 'forms-workspace-items');
	
		return {wrapper: this.createElementWithContent('div', 'forms-workspace-wrapper', [this.createElementWithContent('div', 'forms-workspace-header', [formNameElement, saveStatusElement]), workspaceElement]), formName: formNameElement, saveStatus: saveStatusElement, workspace: workspaceElement};
	},
	createProperties: function()
	{
		return this.createElement('div');
	},
	createToolboxItem: function(label)
	{
		barmatz.utils.DataTypes.isNotUndefined(label);
		barmatz.utils.DataTypes.isTypeOf(label, 'string');
		return this.createElementWithContent('li', 'forms-toolbox-item', label);
	},
	createWorkspaceItemWrapper: function(model)
	{
		var _this, isFieldModel, wrapper, grip, label, field, mandatory, deleteButton;
		
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.FormItemModel);
		
		_this = this;
		isFieldModel = model instanceof barmatz.forms.fields.FieldModel;
		wrapper = this.createElement('tr', 'forms-workspace-item');
		grip = this.createElement('span', 'forms-grip ui-icon ui-icon-grip-solid-vertical');
		label = this.createElementWithContent('label', '', isFieldModel && model.getLabel() ? model.getLabel() : '');
		field = this.createFormFieldElement(model);
		mandatory = this.createElementWithContent('span', 'forms-form-item-mandatory', isFieldModel && model.getMandatory() ? '*' : '');
		deleteButton = this.createDeleteButton();
		
		if(model instanceof barmatz.forms.fields.HiddenFieldModel)
		{
			field.type = 'text';
			field.disabled = true;
			barmatz.utils.CSS.addClass(field, 'opacity-quarter');
		}
		
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
	},
	createPropertiesItemWarpper: function(model)
	{
		var _this, returnWrapper;
		
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.FormItemModel);
		
		_this = this;
		returnWrapper = {};
		
		returnWrapper.wrapper = this.createElement('div');
		returnWrapper.wrapper.appendChild(this.createElementWithContent('h2', 'forms-header', barmatz.utils.String.firstLetterToUpperCase(model.getType()) + ' field'));
		
		if(model instanceof barmatz.forms.fields.AbstractFieldModel)
			returnWrapper.nameField = addFieldToWrapper('string', 'name', 'name', model.getName());
		
		if(model instanceof barmatz.forms.fields.HiddenFieldModel)
			returnWrapper.valueField = addFieldToWrapper('string', 'value', 'value', model.getValue());
		
		if(model instanceof barmatz.forms.fields.FieldModel)
		{
			returnWrapper.labelField = addFieldToWrapper('string', 'label', 'label', model.getLabel());
			returnWrapper.mandatoryField = addFieldToWrapper('boolean', 'mandatory', 'mandatory', model.getMandatory());
			returnWrapper.enabledField = addFieldToWrapper('boolean', 'enabled', 'enabled', model.getEnabled());
			returnWrapper.widthField = addFieldToWrapper('number', 'width', 'width', model.getWidth());
		}
		
		if(model instanceof barmatz.forms.fields.FileFieldModel)
			returnWrapper.acceptField = addFieldToWrapper('string', 'accept', 'accept', model.getAccept().toString());
	
		if(model instanceof barmatz.forms.fields.TextFieldModel)
		{
			returnWrapper.descriptionField = addFieldToWrapper('string', 'description', 'description', model.getDescription());
			returnWrapper.maxField = addFieldToWrapper('number', 'max', 'max', model.getMax());
		}
		
		if(model instanceof barmatz.forms.fields.TextAreaFieldModel)
		{
			returnWrapper.rowsField = addFieldToWrapper('number', 'rows', 'rows', model.getRows());
			returnWrapper.colsField = addFieldToWrapper('number', 'cols', 'columns', model.getCols());
		}
		
		if(model instanceof barmatz.forms.fields.CheckboxFieldModel)
			returnWrapper.checkedField = addFieldToWrapper('boolean', 'checked', 'checked', model.getChecked());
		
		if(model instanceof barmatz.forms.fields.DropboxModel)
		{
			returnWrapper.multipleField = addFieldToWrapper('boolean', 'multiple', 'multiple', model.getMultiple());
			returnWrapper.editItemsButton = addFieldToWrapper('button', '', 'Edit items');
		}
	
		if(model instanceof barmatz.forms.fields.FieldModel)
			returnWrapper.validationOptionsButton = addFieldToWrapper('button', '', 'Validation options');
		
		if(model instanceof barmatz.forms.fields.HTMLContentModel)
			returnWrapper.editContentButton = addFieldToWrapper('button', '', 'Edit content');
		
		return returnWrapper;
		
		function addFieldToWrapper(type, name, label, value)
		{
			var fieldWrapper;
			
			barmatz.utils.DataTypes.isTypeOf(type, 'string');
			barmatz.utils.DataTypes.isTypeOf(name, 'string');
			barmatz.utils.DataTypes.isTypeOf(label, 'string');
	
			fieldWrapper = _this.createPropertiesItemFieldWrapper(type, name, label, value, onFieldValueChange);
			returnWrapper.wrapper.appendChild(fieldWrapper.wrapper);
			return fieldWrapper.field;
		}
		
		function onFieldValueChange(event)
		{
			var key, value;
			
			key = 'set' + barmatz.utils.String.firstLetterToUpperCase(event.target.name);
			value = event.target.value;
	
			try
			{
				model[key](value);
			}
			catch(error)
			{
				try
				{
					model[key](value.replace(/(^\s+|(,)\s+|\s+$)/g, '$2').split(','));
				}
				catch(error)
				{
					try
					{
						model[key](value == true || value == 'true' ? true : false);
					}
					catch(error)
					{
						try
						{
							model[key](parseFloat(value));
						}
						catch(error)
						{
							throw new Error('Unable to assign value to model. ' + error.message);
						}
					}
				}
			}
		}
	},
	createPropertiesItemFieldWrapper: function(type, name, label, value, changeHandler)
	{
		var content, field;
		
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
				barmatz.utils.Array.forEach(value, function(item, index, collection)
				{
					field.appendChild(this.createElement('option')).innerHTML = item;
				});
				break;
			case 'boolean':
				field = this.createDropboxElement(barmatz.forms.factories.ModelFactory.createDropboxModel(name, [
					barmatz.forms.factories.ModelFactory.createDropboxItemModel('No', false),
					barmatz.forms.factories.ModelFactory.createDropboxItemModel('Yes', true)
				]), value ? 1 : 0);
				break;
			case 'button':
				field = this.createButton(label);
				break;
		}
		
		field.name = name;
		field.addEventListener('change', changeHandler);
		
		content = [];
	
		if(type != 'button')
			content.push(this.createElementWithContent('label', '', label));
		
		content.push(field);
	
		return {wrapper: this.createElementWithContent('div', 'forms-item', content), field: field};
	},
	createDialog: function(title, content, open, container)
	{
		var dialog;
		
		barmatz.utils.DataTypes.isTypeOf(title, 'string');
		barmatz.utils.DataTypes.isTypesOrInstances(content, ['string'], [window.HTMLElement, window.Array]);
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		barmatz.utils.DataTypes.isInstanceOf(container, window.HTMLElement, true);
		
		dialog = this.createElementWithContent('div', 'forms-dialog', content);
		dialog.title = title;
		(container || this.getBodyElement()).appendChild(dialog);
		jQuery(dialog).dialog({appendTo: dialog.parentElement, autoOpen: open === undefined ? true : open, modal: true});
		return dialog;
	},
	isDialog: function(dialog)
	{
		return /forms\-dialog/.test(dialog.className);
	},
	destroyDialog: function(dialog)
	{
		jQuery(dialog).dialog('destroy');
		barmatz.utils.CSS.removeClass(dialog, 'forms-dialog');
		dialog.parentElement.removeChild(dialog);
	},
	createNewFieldDialogWrapper: function(model, open, container)
	{
		var _this, dialog, nameField, labelField, wrapper, form, formTableOptions;
	
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.AbstractFieldModel);
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		barmatz.utils.DataTypes.isInstanceOf(container, window.HTMLElement, true);
		
		_this = this;
		wrapper = {};
		wrapper.nameField = getField(model.getName());
		formTableOptions = new barmatz.forms.ui.DataTableOptions();
		formTableOptions.getBodyRows().push(getRowContent('Name', wrapper.nameField));
		
		if(model.hasOwnProperty('getLabel'))
		{
			wrapper.labelField = getField(model.getLabel());
			formTableOptions.getBodyRows().push(getRowContent('Label', wrapper.labelField));
		}
		
		form = this.createTable(formTableOptions);
		wrapper.wrapper = this.createElementWithContent('div', '', form);
		wrapper.dialog = this.createDialog('New Field', wrapper.wrapper, open, container);
		
		jQuery(dialog).dialog({
			closeOnEscape: false,
			dialogClass: 'forms-dialog-prompt'
		});
		
		return wrapper;
		
		function getRowContent(label, field)
		{
			barmatz.utils.DataTypes.isNotUndefined(label);
			barmatz.utils.DataTypes.isNotUndefined(field);
			barmatz.utils.DataTypes.isTypeOf(label, 'string');
			barmatz.utils.DataTypes.isInstanceOf(field, window.HTMLElement);
			return [_this.createElementWithContent('label', '', label), field];
		}
		
		function getField(value)
		{
			var field;
	
			barmatz.utils.DataTypes.isNotUndefined(value);
			barmatz.utils.DataTypes.isTypeOf(value, 'string');
			
			field = _this.createElement('input');
			field.type = 'text';
			field.value = value;
			return field;
		}
	},
	createPromptDialog: function(title, content, confirmHandler, open, container)
	{
		var _this, dialog;
	
		barmatz.utils.DataTypes.isNotUndefined(title);
		barmatz.utils.DataTypes.isNotUndefined(content);
		barmatz.utils.DataTypes.isNotUndefined(confirmHandler);
		barmatz.utils.DataTypes.isTypeOf(title, 'string');
		barmatz.utils.DataTypes.isTypesOrInstances(content, ['string'], [window.HTMLElement, window.Array]);
		barmatz.utils.DataTypes.isTypeOf(confirmHandler, 'function');
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		barmatz.utils.DataTypes.isInstanceOf(container, window.HTMLElement, true);
		
		_this = this;
		dialog = this.createDialog(title, content, open, container);
		
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
	},
	createExportPromptDialog: function(fingerprint, loadingMessage, open, container)
	{
		var dir, embedCode, textarea;
		
		barmatz.utils.DataTypes.isNotUndefined(fingerprint);
		barmatz.utils.DataTypes.isTypeOf(loadingMessage, 'string', true);
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		barmatz.utils.DataTypes.isInstanceOf(container, window.HTMLElement, true);
		
		dir = location.href.replace(location.hash, '').replace(location.search, '').replace(/(^\w+:\/\/.+)\/.+\..+$/, '$1') + '/js'; 
		embedCode = '<div id="formContainer" name="formContainer" fingerprint="' + fingerprint + '">' + (loadingMessage || '') + '</div>' +
					'<script type="text/javascript">' +
					'(function(w,d)' +
					'{' +
						'w.barmatz && w.barmatz.forms && !w.barmatz.forms.embed' +
						' ? barmatz.forms.embed(\'' + fingerprint + '\')' +
						' : l(\'' + dir + '/embed.js\');' +
						'function l(s)' +
						'{' +
							'a=d.createElement(\'script\');' +
							'a.src=s;' +
							'b=d.getElementsByTagName(\'script\')[0];' +
							'b.parentNode.insertBefore(a,b);' +
						'}' +
					'})(window,document)' +
					'</script>';
		
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
		]), open, container);
	},
	createChangePropertyPromptDialogWrapper: function(title, key, value, confirmHandler, open, container)
	{
		var field, wrapper;
	
		barmatz.utils.DataTypes.isTypeOf(title, 'string');
		barmatz.utils.DataTypes.isTypeOf(key, 'string');
		barmatz.utils.DataTypes.isTypeOf(confirmHandler, 'function');
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		barmatz.utils.DataTypes.isInstanceOf(container, window.HTMLElement, true);
		
		field = this.createElement('input');
		field.type = 'text';
		field.value = value;
		wrapper = this.createElementWithContent('div', '', [this.createElementWithContent('label', '', key), field]);
		return {wrapper: wrapper, dialog: this.createPromptDialog(title, wrapper, confirmHandler, open, container), field: field};
	},
	createAlertPromptDialog: function(title, content, open, container)
	{
		var _this, dialog;
		
		barmatz.utils.DataTypes.isNotUndefined(title);
		barmatz.utils.DataTypes.isNotUndefined(content);
		barmatz.utils.DataTypes.isTypeOf(title, 'string');
		barmatz.utils.DataTypes.isTypesOrInstances(content, ['string'], [window.HTMLElement, window.Array]);
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		barmatz.utils.DataTypes.isInstanceOf(container, window.HTMLElement, true);
		
		_this = this;
		dialog = this.createDialog(title, content, open, container);
		
		jQuery(dialog).dialog({
			buttons: {OK: onOKButtonClick}
		});
		
		function onOKButtonClick(event)
		{
			_this.destroyDialog(dialog);
		}
		
		return dialog;
		
	},
	createConfirmPromptDialog: function(message, confirmHandler, open, container)
	{
		barmatz.utils.DataTypes.isNotUndefined(message);
		barmatz.utils.DataTypes.isNotUndefined(confirmHandler);
		barmatz.utils.DataTypes.isTypeOf(message, 'string');
		barmatz.utils.DataTypes.isTypeOf(confirmHandler, 'function');
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		barmatz.utils.DataTypes.isInstanceOf(container, window.HTMLElement, true);
		return this.createPromptDialog('Confirm', message, confirmHandler, open, container);
	},
	createPanels: function(panels)
	{
		var options, model, i; 
		
		barmatz.utils.DataTypes.isInstanceOf(panels, window.Array);
		
		options = new barmatz.forms.ui.DataTableOptions();
		options.setClassName('forms-wrapper');
		options.getBodyRows().push([]);
		barmatz.utils.Array.forEach(panels, function(item, index, collection)
		{
			options.getBodyRows()[0].push(item.getContent());
			options.getBodyColumnsClassNames().push(item.getClassName());
		});
		
		return this.createTable(options);
	},
	createMenuWrapper: function()
	{
		var icon, menu, wrapper;
		icon = this.createMenuIcon();
		menu = this.createMenu();
		wrapper = this.createElementWithContent('div', 'forms-menu', [icon, menu]);
		return {wrapper: wrapper, icon: icon, menu: menu};
	},
	createMenuIcon: function()
	{
		return this.createSettingsButton();
	},
	createMenu: function()
	{
		return this.createElement('ul');
	},
	createMenuItem: function(model)
	{
		var anchor;
	
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.ui.MenuItemModel);
	
		anchor = this.createElementWithContent('a', '', model.getLabel());
		anchor.href = 'javascript:void(0);';
		anchor.addEventListener('click', model.getClickHandler());
		
		return this.createElementWithContent('li', '', anchor);
	},
	createIconButton: function(name)
	{
		var button;
		
		barmatz.utils.DataTypes.isNotUndefined(name);
		barmatz.utils.DataTypes.isTypeOf(name, 'string');
		
		button = this.createElementWithContent('span', 'ui-icon-wrapper ui-state-default ui-corner-all', this.createElement('span', 'ui-icon ui-icon-' + name));
		jQuery(button).button();
		
		return button;
	},
	createEditButton: function()
	{
		return this.createIconButton('pencil');
	},
	createDeleteButton: function()
	{
		return this.createIconButton('trash');
	},
	createSettingsButton: function()
	{
		return this.createIconButton('gear');
	},
	createLoadingDialog: function(container)
	{
		barmatz.utils.DataTypes.isInstanceOf(container, window.HTMLElement, true);
		return (container || barmatz.forms.factories.DOMFactory.getBodyElement()).appendChild(this.createElement('div', 'loading-image ui-front'));
	},
	destroyLoadingDialog: function(dialog)
	{
		barmatz.utils.DataTypes.isInstanceOf(dialog, window.HTMLElement);
		
		if(dialog.parentElement)
			dialog.parentElement.removeChild(dialog);
	},
	createLoginFormDialogWrapper: function(open, container)
	{
		var _this, dialog, wrapper, wrapperOptions, userNameField, passwordField, errorField;

		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		barmatz.utils.DataTypes.isInstanceOf(container, window.HTMLElement, true);
		
		_this = this;
		wrapperOptions = new barmatz.forms.ui.DataTableOptions();
		userNameField = addField('username', 'User', 'text');
		passwordField = addField('password', 'Password', 'password');
		wrapper = this.createTable(wrapperOptions);
		errorField = this.createElementWithContent('div', 'forms-error-wrapper ui-state-error ui-corner-all', [this.createElement('span', 'ui-icon ui-icon-alert'), this.createElementWithContent('span', '', 'Username and/or password are incorrect')]);
		dialog = this.createDialog('Login', [wrapper, errorField], open, container);
	
		jQuery(dialog).dialog({dialogClass: 'forms-dialog-prompt', buttons: {Submit: function(){}}});
		
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
			wrapperOptions.getBodyRows().push([_this.createElementWithContent('label', '', label), field]);
			
			return field;
		}
	},
	createCollectionListDialog: function(title, content, className, open, container)
	{
		var dialog;
		
		barmatz.utils.DataTypes.isNotUndefined(title);
		barmatz.utils.DataTypes.isNotUndefined(content);
		barmatz.utils.DataTypes.isTypeOf(title, 'string');
		barmatz.utils.DataTypes.isTypesOrInstances(content, ['string'], [window.HTMLElement, window.Array]);
		barmatz.utils.DataTypes.isTypeOf(className, 'string', true);
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		barmatz.utils.DataTypes.isInstanceOf(container, window.HTMLElement, true);
		
		dialog = this.createDialog(title, content, open, container);
		jQuery(dialog).dialog({autoOpen: true, dialogClass: 'forms-dialog-collection-list' + (className ? ' ' + className : '')});
		return dialog;
	},
	createUserFormsListDialog: function(open, container)
	{
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		barmatz.utils.DataTypes.isInstanceOf(container, window.HTMLElement, true);
		return this.createCollectionListDialog('Your forms', this.createUserFormsList(), 'forms-dialog-user-forms forms-clickable-td', open, container);
	},
	createUserFormsList: function()
	{
		var options = new barmatz.forms.ui.DataTableOptions();
		options.getHeadColumns().push('Name');
		options.getHeadColumns().push('Created');
		options.getHeadColumns().push('Fingerprint');
		return this.createTable(options);
	},
	createUserFormsListItem: function(index)
	{
		barmatz.utils.DataTypes.isNotUndefined(index);
		barmatz.utils.DataTypes.isTypeOf(index, 'number');
		return this.createElementWithContent('tr', 'ui-widget ui-state-default ui-corner-all ui-button-text-only ' + (index % 2 == 0 ? 'even' : 'odd'), [this.createElement('td'), this.createElement('td'), this.createElement('td')]);
	},
	createDropboxItemsListDialogWrapper: function(open, container)
	{
		var addButton, resetButton;
		
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		barmatz.utils.DataTypes.isInstanceOf(container, window.HTMLElement, true);
		
		addButton = this.createButton('Add item');
		resetButton = this.createButton('Reset');
		
		return {dialog: this.createCollectionListDialog('Items', [this.createDropboxItemsList(), this.createElementWithContent('div', 'forms-dialog-footer', [addButton, resetButton])], 'forms-dialog-dropbox-items', open, container), addButton: addButton, resetButton: resetButton};
	},
	createDropboxItemsList: function()
	{
		var options = new barmatz.forms.ui.DataTableOptions();
		options.getHeadColumns().push('Key', 'Value', '');
		return this.createTable(options);
	},
	createDropboxItemDialog: function(label, value, confirmHandler, open, container)
	{
		var _this, options, keyField, valueField;
		
		barmatz.utils.DataTypes.isNotUndefined(label);
		barmatz.utils.DataTypes.isNotUndefined(value);
		barmatz.utils.DataTypes.isNotUndefined(confirmHandler);
		barmatz.utils.DataTypes.isTypeOf(label, 'string', true);
		barmatz.utils.DataTypes.isTypeOf(confirmHandler, 'function');
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		barmatz.utils.DataTypes.isInstanceOf(container, window.HTMLElement, true);
		
		_this = this;
		options = new barmatz.forms.ui.DataTableOptions();
		labelField = addRow('label', label || '');
		valueField = addRow('Value', value || '');
		return this.createPromptDialog(labelField != null ? 'Edit item' : 'New item', this.createTable(options), onConfirm, open, container);
		
		function addRow(key, value)
		{
			var field;
			
			barmatz.utils.DataTypes.isNotUndefined(key);
			barmatz.utils.DataTypes.isNotUndefined(value);
			barmatz.utils.DataTypes.isTypeOf(key, 'string');
			
			field = _this.createElement('input');
			field.value = value;
			options.getBodyRows().push([_this.createElementWithContent('label', '', key), field]);
			
			return field;
		}
		
		function onConfirm()
		{
			confirmHandler(labelField.value, valueField.value);
		}
	},
	createDropboxItemsListItemWrapper: function(index)
	{
		var wrapper, labelElement, valueElement, editButton, deleteButton;
		
		barmatz.utils.DataTypes.isNotUndefined(index);
		barmatz.utils.DataTypes.isTypeOf(index, 'number');
		
		labelElement = this.createElement('div');
		valueElement = this.createElement('div');
		editButton = this.createEditButton();
		deleteButton = this.createDeleteButton();
		wrapper = this.createTableRow([labelElement, valueElement, this.createElementWithContent('div', '', [editButton, deleteButton])], ['', '', 'forms-list-actions'], 'ui-widget ui-state-default ui-corner-all ui-button-text-only ' + (index % 2 == 0 ? 'even' : 'odd'));
		
		return {wrapper: wrapper, labelElement: labelElement, valueElement: valueElement, editButton: editButton, deleteButton: deleteButton};
	},
	createTable: function(options)
	{
		var _this, headColumns, content;
		
		barmatz.utils.DataTypes.isInstanceOf(options, barmatz.forms.ui.DataTableOptions);
		
		_this = this;
		headColumns = options.getHeadColumns();
		content = [];
		
		if(headColumns.length > 0)
			content.push(this.createElementWithContent('thead', options.getHeadClassName(), this.createTableRow(headColumns, options.getHeadColumnsClassNames(), options.getHeadRowClassName(), true)));
		
		content.push(this.createElementWithContent('tbody', options.getBodyClassName(), getBodyRows()));
		
		return this.createElementWithContent('table', options.getClassName(), content);
		
		function getBodyRows()
		{
			var rows = [], bodyRowsClassNames;
			
			bodyRowsClassNames = options.getBodyRowsClassNames();
			
			barmatz.utils.Array.forEach(options.getBodyRows(), function(item, index, collection)
			{
				rows.push(_this.createTableRow(item, options.getBodyColumnsClassNames(), bodyRowsClassNames[index % bodyRowsClassNames.length]));
			});
			
			return rows;
		}
	},
	createTableRow: function(content, contentClassNames, className, isHead)
	{
		var columns;
		
		barmatz.utils.DataTypes.isInstanceOf(content, window.Array);
		barmatz.utils.DataTypes.isInstanceOf(contentClassNames, window.Array, true);
		barmatz.utils.DataTypes.isTypeOf(className, 'string', true);
		barmatz.utils.DataTypes.isTypeOf(isHead, 'boolean', true);
		
		columns = [];
		
		barmatz.utils.Array.forEach(content, function(item, index, collection)
		{
			columns.push(this.createTableColumn(item, contentClassNames ? contentClassNames[index % contentClassNames.length] : null, isHead)); 
		}, this);
		
		return this.createElementWithContent('tr', className, columns);
	},
	createTableColumn: function(content, className, isHead)
	{
		barmatz.utils.DataTypes.isNotUndefined(content);
		barmatz.utils.DataTypes.isTypeOf(className, 'string', true);
		barmatz.utils.DataTypes.isTypeOf(isHead, 'boolean', true);
		return this.createElementWithContent(isHead ? 'th' : 'td', className, content);
	},
	createFormPropertiesDialogWrapper: function(model, confirmHandler, open, container)
	{
		var properties, dialog;
	
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.FormModel);
		barmatz.utils.DataTypes.isTypeOf(confirmHandler, 'function');
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		barmatz.utils.DataTypes.isInstanceOf(container, window.HTMLElement, true);
		
		properties = this.createFormPropertiesWrapper(model);
		dialog = this.createPromptDialog('Properties', properties.wrapper, confirmHandler, open, container);
		properties.dialog = dialog;
		
		jQuery(dialog).dialog({dialogClass: 'forms-dialog-form-properties'});
		
		return properties;
		
	},
	createFormPropertiesWrapper: function(model)
	{
		var _this, returnValue, options;
		
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.FormModel);
	
		_this = this;
		options = new barmatz.forms.ui.DataTableOptions();
		returnValue = {};
		
		returnValue.nameField = createField('Name');
		returnValue.nameField.value = model.getName();
		
		returnValue.submitButtonLabelField = createField('Submit button label');
		returnValue.submitButtonLabelField.value = model.getSubmitButtonLabel();
		
		returnValue.targetEmailField = createField('Target email');
		returnValue.targetEmailField.value = model.getTargetEmail();
		
		returnValue.directionField = createDropbox('Direction', 'formDirection', [barmatz.forms.Directions.LTR, barmatz.forms.Directions.RTL]);
		returnValue.directionField.value = model.getDirection();
		
		returnValue.languageField = createDropbox('Language', 'formlanguage', ['en', 'he']);
		returnValue.languageField.value = model.getLanguage();
		
		returnValue.layoutIdField = createDropbox('Layout', 'formLayoutId', ['1', '2']);
		returnValue.layoutIdField.value = model.getLayoutId();
		
		returnValue.stylesheetsField = createField('Stylesheets');
		returnValue.stylesheetsField.value = model.getStylesheets().join(' ');
		
		returnValue.methodField = createDropbox('Method', 'formMethod', [barmatz.forms.Methods.GET, barmatz.forms.Methods.POST]);
		returnValue.methodField.value = model.getMethod();
		
		returnValue.encodingField = createDropbox('Encoding', 'formEncoding', [barmatz.net.Encoding.FORM, barmatz.net.Encoding.FILES]);
		returnValue.encodingField.value = model.getEncoding();
		
		returnValue.externalAPIField = createField('External API');
		returnValue.externalAPIField.value = model.getExternalAPI() || '';
		
		returnValue.wrapper = this.createTable(options); 
		
		return returnValue;
		
		function createField(label, content)
		{
			var field, row;
			
			barmatz.utils.DataTypes.isNotUndefined(label);
			barmatz.utils.DataTypes.isTypeOf(label, 'string');
			
			field = content || _this.createElement('input');
			row = [_this.createElementWithContent('label', '', label), field];
			options.getBodyRows().push(row);
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
			barmatz.utils.DataTypes.isTypesOrInstances(values, ['object'], [window.Array]);
			
			model = barmatz.forms.factories.ModelFactory.createDropboxModel(name);
			
			if(values instanceof window.Array)
				for(key = 0; key < values.length; key++)
					model.addItem(barmatz.forms.factories.ModelFactory.createDropboxItemModel(values instanceof window.Array ? values[key] : key, values[key]));
			else
				for(key in values)
					model.addItem(barmatz.forms.factories.ModelFactory.createDropboxItemModel(values instanceof window.Array ? values[key] : key, values[key]));
	
			return createField(label, _this.createDropboxElement(model));
		}
	},
	createFieldValidationOptionsDialogWrapper: function(model, open, container)
	{
		var fieldValidationOptionsWrapper;
		
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.FieldModel);
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		barmatz.utils.DataTypes.isInstanceOf(container, window.HTMLElement, true);
		
		fieldValidationOptionsWrapper = this.createFieldValidationOptionsWrapper(model);
		
		return {
			dialog: this.createDialog(barmatz.utils.String.firstLetterToUpperCase(model.getType()) + ' field "' + model.getName() + '" validation options', fieldValidationOptionsWrapper.wrapper, open, container), 
			options: fieldValidationOptionsWrapper.options
		};
	},
	createFieldValidationOptionsWrapper: function(model)
	{
		var wrapper, options, fieldValidatorWrapper, bits;
		
		barmatz.utils.DataTypes.isNotUndefined(model);
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.FieldModel);
		
		wrapper = this.createElement('div');
		bits = barmatz.utils.Bitwise.parseBit(model.getAvailableValidators());
		options = {};
		barmatz.utils.Array.forEach(bits, function(item, index, collection)
		{
			fieldValidatorWrapper = this.createFieldValidatorWrapper(item);
			options[item] = fieldValidatorWrapper.checkbox;
			wrapper.appendChild(fieldValidatorWrapper.wrapper);
		}, this);
		
		barmatz.utils.DOM.sort(wrapper, function(elementA, elementB)
		{
			var a, b;
			
			a = elementA.getElementsByTagName('span')[0].innerHTML;
			b = elementB.getElementsByTagName('span')[0].innerHTML;
			
			return a > b ? 1 : a < b ? -1 : 0;
		});
	
		return {wrapper: wrapper, options: options};
	},
	createFieldValidatorWrapper: function(bit)
	{
		var wrapper, checkbox, label;
		
		barmatz.utils.DataTypes.isNotUndefined(bit);
		barmatz.utils.DataTypes.isTypeOf(bit, 'number');
		
		checkbox = this.createElement('input');
		checkbox.type = 'checkbox';
		
		label = this.createElement('span');
		
		wrapper = this.createElement('div');
		wrapper.appendChild(checkbox);
		wrapper.appendChild(label);
		
		switch(bit)
		{
			default:
				throw new Error('Unknown bit');
				break;
			case barmatz.forms.Validator.EQUALS:
				label.innerHTML = 'equals...';
				break;
			case barmatz.forms.Validator.VALID_EMAIL:
				label.innerHTML = 'valid email';
				break;
			case barmatz.forms.Validator.VALID_PHONE:
				label.innerHTML = 'valid phone number';
				break;
			case barmatz.forms.Validator.MIN_LENGTH:
				label.innerHTML = 'minimum length...';
				break;
			case barmatz.forms.Validator.MAX_LENGTH:
				label.innerHTML = 'maximum length...';
				break;
			case barmatz.forms.Validator.EXACT_LENGTH:
				label.innerHTML = 'exact length...';
				break;
			case barmatz.forms.Validator.GREATER_THAN:
				label.innerHTML = 'number greater than...';
				break;
			case barmatz.forms.Validator.LESSER_THAN:
				label.innerHTML = 'number lesser than...';
				break;
			case barmatz.forms.Validator.DIGITS_ONLY:
				label.innerHTML = 'only digits';
				break;
			case barmatz.forms.Validator.NOT_DIGITS:
				label.innerHTML = 'not digits';
				break;
		}
		
		return {wrapper: wrapper, checkbox: checkbox}; 
	},
	createFormFieldErrorMessageElement: function()
	{
		return this.createElement('ul', 'forms-form-item-error-message');
	},
	createFormFieldErrorMessageItemElement: function(message)
	{
		barmatz.utils.DataTypes.isNotUndefined(message);
		barmatz.utils.DataTypes.isTypeOf(message, 'string');
		return this.createElementWithContent('li', 'forms-form-item-error-message-item', message);
	},
	createHiddenValueDialogWrapper: function(fieldName, value, confirmHandler, open, container)
	{
		var _this, dialog, wrapper, valueField, specialValuesDropboxModel, specialValuesDropboxElement;
		
		barmatz.utils.DataTypes.isTypeOf(fieldName, 'string');
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		barmatz.utils.DataTypes.isTypeOf(confirmHandler, 'function');
		
		_this = this;

		valueField = this.createElement('input');
		valueField.value = value;
		
		wrapper = this.createElement('div');
		wrapper.appendChild(this.createElementWithContent('label', '', 'Value'));
		wrapper.appendChild(valueField);
		wrapper.appendChild(this.createButton('Special values', onSpecialValuesButtonClick));
		
		dialog = this.createPromptDialog('Hidden value for field ' + fieldName, wrapper, confirmHandler, open, container);
		jQuery(dialog).dialog({width: '395px'});
		
		return {dialog: dialog, valueField: valueField};
		
		function onSpecialValuesButtonClick(event)
		{
			var dialog;
			
			if(!specialValuesDropboxModel)
				specialValuesDropboxModel = barmatz.forms.factories.ModelFactory.createDropboxModel('specialValues', [
	  				barmatz.forms.factories.ModelFactory.createDropboxItemModel('Page referer', '${page_ref}')
	  			]);
			
			if(!specialValuesDropboxElement)
				specialValuesDropboxElement = _this.createDropboxElement(specialValuesDropboxModel);
			
			dialog = _this.createPromptDialog('Special values', specialValuesDropboxElement, onSpecialValueConfirmed, true, container);
			jQuery(dialog).dialog({width: '170px'});
			barmatz.forms.factories.ControllerFactory.createJQueryDialogController(dialog);
		}
		
		function onSpecialValueConfirmed(event)
		{
			valueField.value = specialValuesDropboxElement.value;
		}
	},
	createHTMLContentEditorDialogWrapper: function(content, confirmHandler, open, container, initHandler)
	{
		var wrapper, dialog, editor;
		
		barmatz.utils.DataTypes.isTypeOf(content, 'string', true);
		barmatz.utils.DataTypes.isTypeOf(confirmHandler, 'function');
		barmatz.utils.DataTypes.isTypeOf(open, 'boolean', true);
		barmatz.utils.DataTypes.isInstanceOf(container, window.HTMLElement, true);
		barmatz.utils.DataTypes.isTypeOf(initHandler, 'function', true);
		
		wrapper = this.createElement('div');
		dialog = this.createPromptDialog('HTML content editor', wrapper, confirmHandler, open, container);
		editor = this.createHTMLContentEditor(wrapper, content, onEditorInit);
		
		jQuery(dialog).dialog({dialogClass: 'forms-dialog-html-content-editor'});
	
		return {dialog: dialog, editor: editor};
		
		function onEditorInit(event)
		{
			setTimeout(function()
			{
				jQuery(dialog).dialog('close').dialog('open');

				if(initHandler != null)
					initHandler(event);
			},1);
		}
	},
	createHTMLContentEditor: function(parent, content, initHandler)
	{
		var editor, textArea;
		
		barmatz.utils.DataTypes.isInstanceOf(parent, window.HTMLElement);
		barmatz.utils.DataTypes.isTypeOf(content, 'string', true);
		barmatz.utils.DataTypes.isTypeOf(initHandler, 'function', true);
	
		textArea = this.createElement('textarea');
		textArea.id = 'htmlContentEditor' + new Date().getTime();
		textArea.innerHTML = content || '';
		parent.appendChild(textArea);
		editor = new tinymce.Editor(textArea.id, {
			plugins: 'advlist autolink lists link image charmap print preview hr anchor pagebreak ' +
					 'searchreplace wordcount visualblocks visualchars code fullscreen ' +
					 'insertdatetime media nonbreaking save table contextmenu directionality ' +
					 'emoticons template paste',
			toolbar1: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter ' +
					  'alignright alignjustify | bullist numlist outdent indent | link image'
		}, tinymce.EditorManager);
		editor.on('init', initHandler);
		editor.render();
			
		return textArea;
	},
	destroyHTMLContentEditor: function(editor)
	{
		barmatz.utils.DataTypes.isInstanceOf(editor, tinymce.Editor);
		editor.destroy(true);
	},
	createLeadsFormsListElement: function()
	{
		return this.createElement('ul');
	},
	createLeadsFormsListItem: function(model)
	{
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.FormModel);
		return this.createElementWithContent('li', 'forms-leads-forms-list-item', model.getName());
	},
	createLeadsListWrapper: function()
	{
		var options, table;
		
		options = new barmatz.forms.ui.DataTableOptions();
		options.setHeadRowClassName('forms-leads-list-head');
		options.getHeadColumns().push('Received', 'Referer', 'IP');
		
		table = this.createTable(options);
		
		return {wrapper: this.createElementWithContent('div', 'forms-leads-list-wrapper', table), table: table, body: table.getElementsByTagName('tbody')[0]};
	},
	createLeadsListItem: function(model, index)
	{
		barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.LeadModel);
		barmatz.utils.DataTypes.isTypeOf(index, 'number');
		return this.createTableRow([barmatz.utils.Date.toString(model.getCreated(), 'dd/mm/yyyy hh:ii'), model.getReferer() || '', model.getIP() || ''], [], 'forms-leads-list-item ' + (index % 2 == 0 ? 'even' : 'odd'));
	}
}
/** barmatz.forms.factories.ModelFactory **/
barmatz.forms.factories.ModelFactory = {
	createUserModel: function()
	{
		return new barmatz.forms.users.UserModel();
	},
	createFormFieldModel: function(type, name)
	{
		barmatz.utils.DataTypes.isNotUndefined(type);
		barmatz.utils.DataTypes.isTypeOf(type, 'string');
		
		switch(type)
		{
			default:
				return new barmatz.forms.fields.FieldModel(type, name);
				break;
			case barmatz.forms.fields.FieldTypes.HTML_CONTENT:
				return new barmatz.forms.fields.HTMLContentModel();
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
			case barmatz.forms.fields.FieldTypes.PHONE:
				return new barmatz.forms.fields.PhoneFieldModel(name);
				break;
		}
	},
	createToolboxModel: function()
	{
		return new barmatz.forms.ui.ToolboxModel();
	},
	createToolboxItemModel: function(type, label, fieldModel)
	{
		return new barmatz.forms.ui.ToolboxItemModel(type, label, fieldModel);
	},
	createCollectionModel: function()
	{
		return new barmatz.forms.CollectionModel();
	},
	createDropboxItemModel: function(label, value)
	{
		return new barmatz.forms.fields.DropboxItemModel(label, value);
	},
	createDropboxModel: function(name, items)
	{
		return new barmatz.forms.fields.DropboxModel(name, items);
	},
	createBuilderPageModel: function()
	{
		return new barmatz.forms.ui.pages.BuilderPageModel();
	},
	createMenuModel: function()
	{
		return new barmatz.forms.ui.MenuModel();
	},
	createMenuItemModel: function(label, clickHandler)
	{
		return new barmatz.forms.ui.MenuItemModel(label, clickHandler);
	},
	createFormModel: function()
	{
		return new barmatz.forms.FormModel();
	},
	createPanelModel: function(className, content)
	{
		return new barmatz.forms.ui.PanelModel(className, content);
	},
	createValidatorModel: function(data)
	{
		return new barmatz.forms.fields.ValidatorModel(data);
	},
	createLeadModel: function()
	{
		return new barmatz.forms.LeadModel();
	},
	createContentModel: function()
	{
		return new barmatz.forms.ui.ContentModel();
	},
	createUsersPageModel: function()
	{
		return new barmatz.forms.ui.pages.UsersPageModel();
	},
	createTableModel: function()
	{
		return new barmatz.forms.ui.DataTableModel();
	}
}
/** barmatz.forms.fields.FormItemModel **/
barmatz.forms.fields.FormItemModel = function(type)
{
	barmatz.utils.DataTypes.isTypeOf(type, 'string', true);
	barmatz.forms.TypeModel.call(this, type);
};
barmatz.forms.fields.FormItemModel.prototype = new barmatz.forms.TypeModel(null);
barmatz.forms.fields.FormItemModel.prototype.constructor = barmatz.forms.fields.FormItemModel;
/** barmatz.forms.fields.AbstractFieldModel **/
barmatz.forms.fields.AbstractFieldModel = function(type, name)
{
	barmatz.utils.DataTypes.isNotUndefined(type);
	barmatz.utils.DataTypes.isNotUndefined(name);
	barmatz.utils.DataTypes.isTypeOf(type, 'string', true);
	barmatz.utils.DataTypes.isTypeOf(name, 'string', true);
	barmatz.forms.fields.FormItemModel.call(this, type);
	this.set('name', name);
	this.set('value', '');
};
barmatz.forms.fields.AbstractFieldModel.prototype = new barmatz.forms.fields.FormItemModel(null);
barmatz.forms.fields.AbstractFieldModel.prototype.constructor = barmatz.forms.fields.AbstractFieldModel;
barmatz.forms.fields.AbstractFieldModel.prototype.getName = function()
{
	return this.get('name');
};
barmatz.forms.fields.AbstractFieldModel.prototype.setName = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'string');
	this.set('name', value);
};
barmatz.forms.fields.AbstractFieldModel.prototype.getValue = function()
{
	return this.get('value');
};
barmatz.forms.fields.AbstractFieldModel.prototype.setValue = function(value)
{
	this.set('value', value);
};
barmatz.forms.fields.AbstractFieldModel.prototype.clone = function()
{
	var clone = new barmatz.forms.fields.AbstractFieldModel(this.getType(), this.getName());
	clone.setValue(this.getValue());
	return clone;
};
/** barmatz.forms.fields.FieldController **/
barmatz.forms.fields.FieldController = function(model, fieldView, errorMessageView)
{
	var settingValue, cachedErrorMessageVisibility, valueIsDescription;
	
	barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.FieldModel);
	barmatz.utils.DataTypes.isInstancesOf(fieldView, [HTMLInputElement, HTMLTextAreaElement, HTMLSelectElement, HTMLDivElement]);
	barmatz.utils.DataTypes.isInstanceOf(errorMessageView, window.HTMLElement, true);
	barmatz.mvc.Controller.call(this);
	
	model.addEventListener(barmatz.events.ModelEvent.VALUE_CHANGED, onModelValueChanged);
	model.addEventListener(barmatz.events.FieldEvent.VALID, onModelValid);
	model.addEventListener(barmatz.events.FieldEvent.INVALID, onModelInvalid);
	fieldView.addEventListener('focus', onFieldViewFocus);
	fieldView.addEventListener('change', onFieldViewChange);
	setModelValue();
	addDescription();
	
	if(errorMessageView)
	{
		setErrorMessageContent();
		hideErrorMessage();
	}
	
	function addDescription()
	{
		if(model instanceof barmatz.forms.fields.TextFieldModel && !barmatz.forms.Validator.notEmpty(model.getValue()))
		{
			fieldView.value = model.getDescription();
			barmatz.utils.CSS.addClass(fieldView, 'forms-empty-field');
			valueIsDescription = true;
		}
	}
	
	function removeDescription()
	{
		if(valueIsDescription)
		{
			fieldView.value = '';
			barmatz.utils.CSS.removeClass(fieldView, 'forms-empty-field');
			valueIsDescription = false;
		}
	}
	
	function setModelValue()
	{
		if(!settingValue)
		{
			settingValue = true;
			
			if(model instanceof barmatz.forms.fields.PhoneFieldModel)
				model.setValue(fieldView.getElementsByTagName('select')[0].value + fieldView.getElementsByTagName('input')[0].value);
			else if(model instanceof barmatz.forms.fields.CheckboxFieldModel)
				model.setChecked(fieldView.checked);
			else
				model.setValue(fieldView.value);
			
			model.validate();
			settingValue = false;
		}
	}
	
	function setErrorMessageContent()
	{
		if(errorMessageView)
			errorMessageView.innerHTML = 'invalid';
	}
	
	function showErrorMessage()
	{
		if(errorMessageView)
		{
			errorMessageView.style.visibility = cachedErrorMessageVisibility;
			cachedErrorMessageVisibility = null;
		}
	}
	
	function hideErrorMessage()
	{
		if(errorMessageView)
		{
			if(cachedErrorMessageVisibility == null)
				cachedErrorMessageVisibility = errorMessageView.style.visibility;
			errorMessageView.style.visibility = 'hidden';
		}
	}
	
	function isErrorMessageHidden()
	{
		return errorMessageView && errorMessageView.style.visibility == 'hidden';
	}
	
	function onModelValueChanged(event)
	{
		barmatz.utils.DataTypes.isInstanceOf(event, barmatz.events.ModelEvent);

		switch(event.getKey())
		{
			case 'value':
				if(!settingValue)
				{
					settingValue = true;
					fieldView.value = model.getValue();
					settingValue = false;
				}
				break;
			case 'description':
				addDescription();
				break;
		}
	}
	
	function onModelValid(event)
	{
		if(errorMessageView)
			barmatz.forms.factories.DOMFactory.clearElement(errorMessageView);
		
		if(!isErrorMessageHidden())
			hideErrorMessage();
	}
	
	function onModelInvalid(event)
	{
		var validator;
		
		barmatz.utils.DataTypes.isInstanceOf(event, barmatz.events.FieldEvent);
		
		if(errorMessageView)
		{
			barmatz.forms.factories.DOMFactory.clearElement(errorMessageView);
			validator = model.getValidator();
			barmatz.utils.Array.forEach(barmatz.utils.Bitwise.parseBit(event.getErrors()), function(item, index, collection)
			{
				switch(item)
				{
					default:
						throw new Error('Unknown error code');
					break;
					case barmatz.forms.Validator.NONE:
						break;
					case barmatz.forms.Validator.NOT_EMPTY:
						errorMessageView.appendChild(barmatz.forms.factories.DOMFactory.createFormFieldErrorMessageItemElement(validator.getErrorMessage() || barmatz.forms.Language.form.field.errors.emptyValue));
						break;
					case barmatz.forms.Validator.EQUALS:
						errorMessageView.appendChild(barmatz.forms.factories.DOMFactory.createFormFieldErrorMessageItemElement(validator.getErrorMessage() || barmatz.forms.Language.form.field.errors.invalidValue));
						break;
					case barmatz.forms.Validator.VALID_EMAIL:
						errorMessageView.appendChild(barmatz.forms.factories.DOMFactory.createFormFieldErrorMessageItemElement(validator.getErrorMessage() || barmatz.forms.Language.form.field.errors.invalidEmail));
						break;
					case barmatz.forms.Validator.VALID_PHONE:
						errorMessageView.appendChild(barmatz.forms.factories.DOMFactory.createFormFieldErrorMessageItemElement(validator.getErrorMessage() || barmatz.forms.Language.form.field.errors.invalidPhone));
						break;
					case barmatz.forms.Validator.MIN_LENGTH:
						errorMessageView.appendChild(barmatz.forms.factories.DOMFactory.createFormFieldErrorMessageItemElement(validator.getErrorMessage() || barmatz.forms.Language.form.field.errors.minimumLength.replace(/\$\{1\}/, validator.minLength)));
						break;
					case barmatz.forms.Validator.MAX_LENGTH:
						errorMessageView.appendChild(barmatz.forms.factories.DOMFactory.createFormFieldErrorMessageItemElement(validator.getErrorMessage() || barmatz.forms.Language.form.field.errors.maximumLength.replace(/\$\{1\}/, validator.maxLength)));
						break;
					case barmatz.forms.Validator.EXACT_LENGTH:
						errorMessageView.appendChild(barmatz.forms.factories.DOMFactory.createFormFieldErrorMessageItemElement(validator.getErrorMessage() || barmatz.forms.Language.form.field.errors.exactLength.replace(/\$\{1\}/, validator.exactLength)));
						break;
					case barmatz.forms.Validator.GREATER_THAN:
						errorMessageView.appendChild(barmatz.forms.factories.DOMFactory.createFormFieldErrorMessageItemElement(validator.getErrorMessage() || barmatz.forms.Language.form.field.errors.greaterThan.replace(/\$\{1\}/, validator.greaterThan)));
						break;
					case barmatz.forms.Validator.LESSER_THAN:
						errorMessageView.appendChild(barmatz.forms.factories.DOMFactory.createFormFieldErrorMessageItemElement(validator.getErrorMessage() || barmatz.forms.Language.form.field.errors.lesserThan.replace(/\$\{1\}/, validator.lesserThan)));
						break;
					case barmatz.forms.Validator.DIGITS_ONLY:
						errorMessageView.appendChild(barmatz.forms.factories.DOMFactory.createFormFieldErrorMessageItemElement(validator.getErrorMessage() || barmatz.forms.Language.form.field.errors.digitsOnly));
						break;
					case barmatz.forms.Validator.NOT_DIGITS:
						errorMessageView.appendChild(barmatz.forms.factories.DOMFactory.createFormFieldErrorMessageItemElement(validator.getErrorMessage() || barmatz.forms.Language.form.field.errors.noDigits));
						break;
				}
			});
			
			if(isErrorMessageHidden())
				showErrorMessage();
		}
	}
	
	function onFieldViewFocus(event)
	{
		fieldView.removeEventListener('focus', onFieldViewFocus);
		fieldView.addEventListener('blur', onFieldViewBlur);
		removeDescription();
	}
	
	function onFieldViewBlur(event)
	{
		fieldView.addEventListener('focus', onFieldViewFocus);
		fieldView.removeEventListener('blur', onFieldViewBlur);
		addDescription();
	}
	
	function onFieldViewChange(event)
	{
		if(model instanceof barmatz.forms.fields.PhoneFieldModel && !model.getValue() && event.target.tagName.toLowerCase() == 'select')
			return;
			
		setModelValue();
	}
};
barmatz.forms.fields.FieldController.prototype = new barmatz.mvc.Controller();
barmatz.forms.fields.FieldController.prototype.constructor = barmatz.forms.fields.FieldController;
/** barmatz.forms.fields.FieldModel **/
barmatz.forms.fields.FieldModel = function(type, name)
{
	barmatz.utils.DataTypes.isNotUndefined(type);
	barmatz.utils.DataTypes.isNotUndefined(name);
	barmatz.utils.DataTypes.isTypeOf(type, 'string', true);
	barmatz.utils.DataTypes.isTypeOf(name, 'string', true);
	barmatz.forms.fields.AbstractFieldModel.call(this, type, name);
	this.set('label', '');
	this.set('mandatory', false);
	this.set('enabled', true);
	this.set('validator', barmatz.forms.factories.ModelFactory.createValidatorModel());
	this.set('width', NaN);
};

barmatz.forms.fields.FieldModel.prototype = new barmatz.forms.fields.AbstractFieldModel(null, null);
barmatz.forms.fields.FieldModel.prototype.constructor = barmatz.forms.fields.FieldModel;
barmatz.forms.fields.FieldModel.prototype.getLabel = function()
{
	return this.get('label');
};
barmatz.forms.fields.FieldModel.prototype.setLabel = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'string');
	this.set('label', value);
};
barmatz.forms.fields.FieldModel.prototype.getMandatory = function()
{
	return this.get('mandatory');
};
barmatz.forms.fields.FieldModel.prototype.setMandatory = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'boolean');
	this.set('mandatory', value);
};
barmatz.forms.fields.FieldModel.prototype.getEnabled = function()
{
	return this.get('enabled');
};
barmatz.forms.fields.FieldModel.prototype.setEnabled = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'boolean');
	this.set('enabled', value);
};
barmatz.forms.fields.FieldModel.prototype.getAvailableValidators = function()
{
	return barmatz.forms.Validator.EQUALS +
		   barmatz.forms.Validator.VALID_EMAIL +
		   barmatz.forms.Validator.VALID_PHONE +
		   barmatz.forms.Validator.MIN_LENGTH +
		   barmatz.forms.Validator.MAX_LENGTH +
		   barmatz.forms.Validator.EXACT_LENGTH +
		   barmatz.forms.Validator.GREATER_THAN +
		   barmatz.forms.Validator.LESSER_THAN +
		   barmatz.forms.Validator.DIGITS_ONLY +
		   barmatz.forms.Validator.NOT_DIGITS;
};
barmatz.forms.fields.FieldModel.prototype.getValidator = function()
{
	return this.get('validator');
};
barmatz.forms.fields.FieldModel.prototype.setValidator = function(value)
{
	barmatz.utils.DataTypes.isInstanceOf(value, barmatz.forms.fields.ValidatorModel);
	this.set('validator', value);
};
barmatz.forms.fields.FieldModel.prototype.getWidth = function()
{
	return this.get('width');
};
barmatz.forms.fields.FieldModel.prototype.setWidth = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'number');
	this.set('width', value);
};
barmatz.forms.fields.FieldModel.prototype.validate = function()
{
	var errors, code, bits, value;
	
	errors = 0;
	
	if(this.getMandatory())
		if(!barmatz.forms.Validator.notEmpty(this.getValue()))
			errors = barmatz.utils.Bitwise.concat(errors, barmatz.forms.Validator.NOT_EMPTY);
	
	code = this.getValidator().getCode();
	
	if(code)
	{
		bits = barmatz.utils.Bitwise.parseBit(code);
		value = this.getValue();
		barmatz.utils.Array.forEach(bits, function(item, index, collection)
		{
			switch(item)
			{
				default:
					throw new Error('Unknown validation code');
				break;
				case barmatz.forms.Validator.NONE:
					break;
				case barmatz.forms.Validator.NOT_EMPTY:
					if(!this.getMandatory() && !barmatz.forms.Validator.notEmpty(this.getValue()))
						errors = barmatz.utils.Bitwise.concat(errors, barmatz.forms.Validator.NOT_EMPTY);
					break;
				case barmatz.forms.Validator.EQUALS:
					if(!barmatz.forms.Validator.equals(value, typeof this.getValidator().equals == 'function' ? this.getValidator().equals() : this.getValidator().equals))
						errors = barmatz.utils.Bitwise.concat(errors, barmatz.forms.Validator.EQUALS);
					break;
				case barmatz.forms.Validator.VALID_EMAIL:
					if(!barmatz.forms.Validator.validEmail(value))
						errors = barmatz.utils.Bitwise.concat(errors, barmatz.forms.Validator.VALID_EMAIL);
					break;
				case barmatz.forms.Validator.VALID_PHONE:
					if(!barmatz.forms.Validator.validPhone(value))
						errors = barmatz.utils.Bitwise.concat(errors, barmatz.forms.Validator.VALID_PHONE);
					break;
				case barmatz.forms.Validator.MIN_LENGTH:
					if(!barmatz.forms.Validator.minLength(value, this.getValidator().minLength))
						errors = barmatz.utils.Bitwise.concat(errors, barmatz.forms.Validator.MIN_LENGTH);
					break;
				case barmatz.forms.Validator.MAX_LENGTH:
					if(!barmatz.forms.Validator.maxLength(value, this.getValidator().maxLength))
						errors = barmatz.utils.Bitwise.concat(errors, barmatz.forms.Validator.MAX_LENGTH);
					break;
				case barmatz.forms.Validator.EXACT_LENGTH:
					if(!barmatz.forms.Validator.exactLength(value, this.getValidator().exactLength))
						errors = barmatz.utils.Bitwise.concat(errors, barmatz.forms.Validator.EXACT_LENGTH);
					break;
				case barmatz.forms.Validator.GREATER_THAN:
					if(!barmatz.forms.Validator.greaterThan(parseFloat(value), this.getValidator().greaterThan))
						errors = barmatz.utils.Bitwise.concat(errors, barmatz.forms.Validator.GREATER_THAN);
					break;
				case barmatz.forms.Validator.LESSER_THAN:
					if(!barmatz.forms.Validator.lesserThan(parseFloat(value), this.getValidator().lesserThan))
						errors = barmatz.utils.Bitwise.concat(errors, barmatz.forms.Validator.LESSER_THAN);
					break;
				case barmatz.forms.Validator.DIGITS_ONLY:
					if(!barmatz.forms.Validator.digitsOnly(value))
						errors = barmatz.utils.Bitwise.concat(errors, barmatz.forms.Validator.DIGITS_ONLY);
					break;
				case barmatz.forms.Validator.NOT_DIGITS:
					if(!barmatz.forms.Validator.notDigits(value))
						errors = barmatz.utils.Bitwise.concat(errors, barmatz.forms.Validator.NOT_DIGITS);
					break;
			}
		}, this);
	}
	
	if(errors > 0)
	{
		this.dispatchEvent(new barmatz.events.FieldEvent(barmatz.events.FieldEvent.INVALID, errors));
		return false;
	}
	else
	{
		this.dispatchEvent(new barmatz.events.FieldEvent(barmatz.events.FieldEvent.VALID));
		return true;
	}
		
};
barmatz.forms.fields.FieldModel.prototype.clone = function()
{
	var clone = new barmatz.forms.fields.FieldModel(this.getType(), this.getName());
	clone.setLabel(this.getLabel());
	clone.setMandatory(this.getMandatory());
	clone.setValue(this.getValue());
	clone.setEnabled(this.getEnabled());
	clone.setValidator(this.getValidator().clone());
	clone.setWidth(this.getWidth());
	return clone;
};
/** barmatz.forms.fields.ValidatorModel **/
barmatz.forms.fields.ValidatorModel = function(data)
{
	var i;
	
	barmatz.utils.DataTypes.isTypeOf(data, 'object', true);
	barmatz.mvc.Model.call(this);
	this.set('code', barmatz.forms.Validator.NONE);
	this.set('errorMessage', null);

	if(data)
	{
		if(data.code)
			this.set('code', data.code);
		
		for(i in data)
			this[i] = data[i];
	}
};
barmatz.forms.fields.ValidatorModel.prototype = new barmatz.mvc.Model();
barmatz.forms.fields.ValidatorModel.prototype.constructor = barmatz.forms.fields.ValidatorModel;
barmatz.forms.fields.ValidatorModel.prototype.getCode = function()
{
	return this.get('code');
};
barmatz.forms.fields.ValidatorModel.prototype.setCode = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'number');
	this.set('code', value);
};
barmatz.forms.fields.ValidatorModel.prototype.getErrorMessage = function()
{
	return this.get('errorMessage');
},
barmatz.forms.fields.ValidatorModel.prototype.setErrorMessage = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'string', true);
	this.set('errorMessage', value || null);
},
barmatz.forms.fields.ValidatorModel.prototype.clone = function()
{
	var object, i;
	
	object = new barmatz.forms.fields.ValidatorModel();
	object.setCode(this.getCode());
	object.setErrorMessage(this.getErrorMessage());
	
	for(i in this)
		object[i] = this[i];
	
	return object;
};
barmatz.forms.fields.ValidatorModel.prototype.toJSON = function()
{
	var object, key, getter, i;
	
	object = {code: this.getCode(), errorMessage: this.getErrorMessage()};
	
	for(i in this)
		if(typeof this[i] != 'function' && i != '_target' && i != '_listeners')
		{
			if(/^_/.test(i))
			{
				key = i.replace('_', '');
				getter = 'get' + barmatz.utils.String.firstLetterToUpperCase(key);
				object[key] = /^_/.test(i) && this.hasOwnProperty(getter) ? this[getter]() : this[i];
			}
			else
				object[i] = this[i];
		}
	
	return object;
};
/** barmatz.forms.fields.TextFieldModel **/
barmatz.forms.fields.TextFieldModel = function(name)
{
	barmatz.utils.DataTypes.isTypeOf(name, 'string', true);
	barmatz.forms.fields.FieldModel.call(this, barmatz.forms.fields.FieldTypes.TEXT_FIELD, name);
	this.set('max', NaN);
	this.set('description', '');
};
barmatz.forms.fields.TextFieldModel.prototype = new barmatz.forms.fields.FieldModel(null, null);
barmatz.forms.fields.TextFieldModel.prototype.constructor = barmatz.forms.fields.TextFieldModel;
barmatz.forms.fields.TextFieldModel.prototype.getMax = function()
{
	return this.get('max');
};
barmatz.forms.fields.TextFieldModel.prototype.setMax = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'number');
	this.set('max', value);
};
barmatz.forms.fields.TextFieldModel.prototype.getDescription = function()
{
	return this.get('description');
};
barmatz.forms.fields.TextFieldModel.prototype.setDescription = function(value)
{
	this.set('description', value);
};
barmatz.forms.fields.TextFieldModel.prototype.clone = function()
{
	var clone = new barmatz.forms.fields.TextFieldModel(this.getName());
	clone.setLabel(this.getLabel());
	clone.setMandatory(this.getMandatory());
	clone.setValue(this.getValue());
	clone.setEnabled(this.getEnabled());
	clone.setValidator(this.getValidator().clone());
	clone.setMax(this.getMax());
	clone.setDescription(this.getDescription());
	return clone;
};
/** barmatz.forms.fields.CheckboxFieldModel **/
barmatz.forms.fields.CheckboxFieldModel = function(name)
{
	barmatz.utils.DataTypes.isNotUndefined(name);
	barmatz.utils.DataTypes.isTypeOf(name, 'string', true);
	barmatz.forms.fields.FieldModel.call(this, barmatz.forms.fields.FieldTypes.CHECKBOX, name);
	this.set('checked', false);
};
barmatz.forms.fields.CheckboxFieldModel.prototype = new barmatz.forms.fields.FieldModel(null, null);
barmatz.forms.fields.CheckboxFieldModel.prototype.constructor = barmatz.forms.fields.CheckboxFieldModel;
barmatz.forms.fields.CheckboxFieldModel.prototype.getChecked = function()
{
	return this.get('checked');
};
barmatz.forms.fields.CheckboxFieldModel.prototype.setChecked = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'boolean');
	this.set('checked', value);
};
barmatz.forms.fields.CheckboxFieldModel.prototype.getValue = function()
{
	return this.getChecked() ? this.get('value') : '';
};
barmatz.forms.fields.CheckboxFieldModel.prototype.clone = function()
{
	var clone = new barmatz.forms.fields.CheckboxFieldModel(this.getName());
	clone.setLabel(this.getLabel());
	clone.setMandatory(this.getMandatory());
	clone.setValue(this.getValue());
	clone.setEnabled(this.getEnabled());
	clone.setValidator(this.getValidator().clone());
	clone.setChecked(this.getChecked());
	return clone;
};
/** barmatz.forms.fields.DropboxItemModel **/
barmatz.forms.fields.DropboxItemModel = function(label, value)
{
	barmatz.utils.DataTypes.isNotUndefined(label);
	barmatz.utils.DataTypes.isTypeOf(label, 'string');
	barmatz.mvc.Model.call(this);
	this.set('label', label);
	this.set('value', barmatz.utils.DataTypes.applySilent('isNotUndefined', value) ? value : null);
};
barmatz.forms.fields.DropboxItemModel.prototype = new barmatz.mvc.Model();
barmatz.forms.fields.DropboxItemModel.prototype.constructor = barmatz.forms.fields.DropboxItemModel;
barmatz.forms.fields.DropboxItemModel.prototype.getLabel = function()
{
	return this.get('label');
};
barmatz.forms.fields.DropboxItemModel.prototype.setLabel = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'string');
	this.set('label', value);
};
barmatz.forms.fields.DropboxItemModel.prototype.getValue = function()
{
	return this.get('value');
};
barmatz.forms.fields.DropboxItemModel.prototype.setValue = function(value)
{
	this.set('value', value);
};
barmatz.forms.fields.DropboxItemModel.prototype.toString = function()
{
	return this.getLabel() + '=' + this.getValue();
};
/** barmatz.forms.fields.DropboxItemsListController **/
barmatz.forms.fields.DropboxItemsListController = function(model, view, addButtonView, resetButtonView, dialogContainerView)
{
	var _this, cachedResetButtonViewDisplay;
	
	barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.DropboxModel);
	barmatz.utils.DataTypes.isInstanceOf(view, window.HTMLElement);
	barmatz.utils.DataTypes.isInstanceOf(addButtonView, window.HTMLElement);
	barmatz.utils.DataTypes.isInstanceOf(resetButtonView, window.HTMLElement);
	
	_this = this;
	this._itemsDictionary = new barmatz.utils.Dictionary();
	this._itemsDeleteButtonDictionary = new barmatz.utils.Dictionary();
	this._model = model;
	this._dialogContainerView = dialogContainerView;

	barmatz.forms.CollectionController.call(this, model, view);
	
	model.addEventListener(barmatz.events.CollectionEvent.ITEM_ADDED, onModelItemAdded);
	model.addEventListener(barmatz.events.CollectionEvent.ITEM_REMOVED, onModelItemRemoved);
	addButtonView.addEventListener('click', onAddButtonViewClick);
	resetButtonView.addEventListener('click', onResetButtonViewClick);

	if(model.getNumItems() == 0)
		hideResetButtonView();
	
	function showResetButtonView()
	{
		resetButtonView.style.display = cachedResetButtonViewDisplay;
		cachedResetButtonViewDisplay = null;
	}
	
	function hideResetButtonView()
	{
		cachedResetButtonViewDisplay = resetButtonView.style.display;
		resetButtonView.style.display = 'none';
	}
	
	function onModelItemAdded(event)
	{
		if(model.getNumItems() > 0 && resetButtonView.style.display == 'none')
			showResetButtonView();
	}
	
	function onModelItemRemoved(event)
	{
		if(model.getNumItems() == 0)
			hideResetButtonView();
	}
	
	function onAddButtonViewClick(event)
	{
		barmatz.forms.factories.ControllerFactory.createJQueryDialogController(barmatz.forms.factories.DOMFactory.createDropboxItemDialog(null, null, onAddItemConfirm, true, dialogContainerView));
	}
	
	function onResetButtonViewClick(event)
	{
		while(model.getNumItems() > 0)
			model.removeItemAt(model.getNumItems() - 1);
	}
	
	function onAddItemConfirm(key, value)
	{
		barmatz.utils.DataTypes.isTypeOf(key, 'string');
		model.addItem(barmatz.forms.factories.ModelFactory.createDropboxItemModel(key, value));
	}
};
barmatz.forms.fields.DropboxItemsListController.prototype = new barmatz.forms.CollectionController(null, null);
barmatz.forms.fields.DropboxItemsListController.prototype.constructor = barmatz.forms.fields.DropboxItemsListController;
barmatz.forms.fields.DropboxItemsListController.prototype._createItemViewFromModel = function(model)
{
	var _this, itemViewWrapper;
	
	barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.DropboxItemModel);
	
	_this = this;
	itemViewWrapper = barmatz.forms.factories.DOMFactory.createDropboxItemsListItemWrapper(this._model.getItemIndex(model));
	itemViewWrapper.deleteButton.addEventListener('click', onItemDeleteButtonClick);
	this._itemsDeleteButtonDictionary.add(itemViewWrapper.deleteButton, model);
	this._itemsDictionary.add(model, _this._view.appendChild(itemViewWrapper.wrapper));
	barmatz.forms.factories.ControllerFactory.createDropboxItemsListItemController(model, itemViewWrapper.labelElement, itemViewWrapper.valueElement, itemViewWrapper.editButton, _this._dialogContainerView);
	
	return null;
	
	function onItemDeleteButtonClick(event)
	{
		_this._model.removeItem(_this._itemsDeleteButtonDictionary.get(event.currentTarget));
	}
};
/** barmatz.forms.fields.DropboxItemsListItemController **/
barmatz.forms.fields.DropboxItemsListItemController = function(model, labelView, valueView, editButtonView, dialogContainerView)
{
	barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.DropboxItemModel);
	barmatz.utils.DataTypes.isInstanceOf(labelView, window.HTMLElement);
	barmatz.utils.DataTypes.isInstanceOf(valueView, window.HTMLElement);
	barmatz.utils.DataTypes.isInstanceOf(editButtonView, window.HTMLElement);
	barmatz.utils.DataTypes.isInstanceOf(dialogContainerView, window.HTMLElement, true);
	barmatz.mvc.Controller.call(this);
	
	labelView.innerHTML = model.getLabel();
	valueView.innerHTML = model.getValue();
	
	model.addEventListener(barmatz.events.ModelEvent.VALUE_CHANGED, onModelValueChanged);
	editButtonView.addEventListener('click', onEditButtonViewClick);
	
	function onModelValueChanged(event)
	{
		var value;
		
		barmatz.utils.DataTypes.isInstanceOf(event, barmatz.events.ModelEvent);
		
		value = event.getValue();
		
		switch(event.getKey())
		{
			case 'label':
				labelView.innerHTML = value;
				break;
			case 'value':
				valueView.innerHTML = value;
				break;
		}
	}
	
	function onEditButtonViewClick(event)
	{
		barmatz.forms.factories.ControllerFactory.createJQueryDialogController(barmatz.forms.factories.DOMFactory.createDropboxItemDialog(model.getLabel(), model.getValue(), onEditConfirm, true, dialogContainerView));
	}
	
	function onEditConfirm(label, value)
	{
		barmatz.utils.DataTypes.isTypeOf(label, 'string');
		barmatz.utils.DataTypes.isTypeOf(value, 'string');
		model.setLabel(label);
		model.setValue(value);
	}
};
barmatz.forms.fields.DropboxItemsListItemController.prototype = new barmatz.mvc.Controller();
barmatz.forms.fields.DropboxItemsListItemController.prototype.constructor = barmatz.forms.fields.DropboxItemsListItemController;
/** barmatz.forms.fields.DropboxModel **/
barmatz.forms.fields.DropboxModel = function(name, items)
{
	var _this;
	
	barmatz.utils.DataTypes.isNotUndefined(name);
	barmatz.utils.DataTypes.isTypeOf(name, 'string', true);
	barmatz.utils.DataTypes.isInstanceOf(items, window.Array, true);
	barmatz.forms.fields.FieldModel.call(this, barmatz.forms.fields.FieldTypes.DROPBOX, name);
	
	_this = this;
	
	this.set('multiple', false);
	this.set('items', new barmatz.forms.CollectionModel());
	this.get('items').addEventListener(barmatz.events.CollectionEvent.ITEM_ADDED, onItemsItemAdded);
	this.get('items').addEventListener(barmatz.events.CollectionEvent.ITEM_REMOVED, onItemsItemRemoved);
	
	if(items)
		while(items.length > this.getNumItems())
			this.addItem(items[this.getNumItems()]);
	
	function onItemsItemAdded(event)
	{
		_this.dispatchEvent(event);
	}
	
	function onItemsItemRemoved(event)
	{
		_this.dispatchEvent(event);
	}
};

barmatz.forms.fields.DropboxModel.prototype = new barmatz.forms.fields.FieldModel(null, null);
barmatz.forms.fields.DropboxModel.prototype.constructor = barmatz.forms.fields.DropboxModel;
barmatz.forms.fields.DropboxModel.prototype.getMultiple = function()
{
	return this.get('multiple');
};
barmatz.forms.fields.DropboxModel.prototype.setMultiple = function(value)
{
	barmatz.utils.DataTypes.isTypeOf(value, 'boolean');
	this.set('multiple', value);
};
barmatz.forms.fields.DropboxModel.prototype.getNumItems = function()
{
	return this.get('items').getNumItems();
};
barmatz.forms.fields.DropboxModel.prototype.addItem = function(item)
{
	barmatz.utils.DataTypes.isNotUndefined(item);
	barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.DropboxItemModel);
	return this.get('items').addItem(item);
};
barmatz.forms.fields.DropboxModel.prototype.addItemAt = function(item, index)
{
	barmatz.utils.DataTypes.isNotUndefined(item);
	barmatz.utils.DataTypes.isNotUndefined(index);
	barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.DropboxItemModel);
	barmatz.utils.DataTypes.isTypeOf(index, 'number');
	return this.get('items').addItemAt(item, index);
};
barmatz.forms.fields.DropboxModel.prototype.removeItem = function(item)
{
	barmatz.utils.DataTypes.isNotUndefined(item);
	barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.DropboxItemModel);
	return this.get('items').removeItem(item);
};
barmatz.forms.fields.DropboxModel.prototype.removeItemAt = function(index)
{
	barmatz.utils.DataTypes.isNotUndefined(index);
	barmatz.utils.DataTypes.isTypeOf(index, 'number');
	return this.get('items').removeItemAt(index);
};
barmatz.forms.fields.DropboxModel.prototype.getItemAt = function(index)
{
	barmatz.utils.DataTypes.isNotUndefined(index);
	barmatz.utils.DataTypes.isTypeOf(index, 'number');
	return this.get('items').getItemAt(index);
};
barmatz.forms.fields.DropboxModel.prototype.getItemIndex = function(item)
{
	barmatz.utils.DataTypes.isNotUndefined(item);
	barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.DropboxItemModel);
	return this.get('items').getItemIndex(item);
};
barmatz.forms.fields.DropboxModel.prototype.setItemIndex = function(item, index)
{
	barmatz.utils.DataTypes.isNotUndefined(item);
	barmatz.utils.DataTypes.isNotUndefined(index);
	barmatz.utils.DataTypes.isInstanceOf(item, barmatz.forms.fields.DropboxItemModel);
	barmatz.utils.DataTypes.isTypeOf(index, 'number');
	return this.get('items').setItemIndex(item, index);
};
barmatz.forms.fields.DropboxModel.prototype.forEach = function(handler)
{
	barmatz.utils.DataTypes.isNotUndefined(handler);
	barmatz.utils.DataTypes.isTypeOf(handler, 'function');
	return this.get('items').forEach(handler);
};
barmatz.forms.fields.DropboxModel.prototype.find = function(filter)
{
	return this.get('items').find(filter);
};
barmatz.forms.fields.DropboxModel.prototype.clone = function()
{
	var clone = new barmatz.forms.fields.DropboxModel(this.getName(), this.get('items').toArray());
	clone.setLabel(this.getLabel());
	clone.setMandatory(this.getMandatory());
	clone.setValue(this.getValue());
	clone.setEnabled(this.getEnabled());
	clone.setValidator(this.getValidator().clone());
	clone.setMultiple(this.getMultiple());
	return clone;
};
barmatz.forms.fields.DropboxModel.prototype.toString = function()
{
	return this.get('items').toString();
};
/** barmatz.forms.fields.FieldTypes **/
barmatz.forms.fields.FieldTypes = {
	HTML_CONTENT: 'htmlContent',
	TEXT_AREA: 'textArea',
	TEXT_FIELD: 'text',
	DROPBOX: 'dropbox',
	PASSWORD: 'password',
	CHECKBOX: 'checkbox',
	RADIO: 'radio',
	FILE: 'file',
	HIDDEN: 'hidden',
	PHONE: 'phone'
};


/** barmatz.forms.fields.FieldValidationOptionsController **/
barmatz.forms.fields.FieldValidationOptionsController = function(model, views, dialogContainerView)
{
	barmatz.utils.DataTypes.isInstanceOf(model, barmatz.forms.fields.FieldModel);
	barmatz.utils.DataTypes.isTypeOf(views, 'object');
	barmatz.utils.DataTypes.isInstanceOf(dialogContainerView, window.HTMLElement, true);
	barmatz.mvc.Controller.call(this);
	
	initViews();
	
	function initViews()
	{
		var i;
		for(i in views)
			initView(views[i], parseInt(i));
	}
	
	function initView(view, bit)
	{
		var code; 
		
		barmatz.utils.DataTypes.isInstanceOf(view, HTMLInputElement);
		barmatz.utils.DataTypes.isTypeOf(bit, 'number');
		
		code = model.getValidator().getCode();

		view.addEventListener('click', onViewClick);
		
		if(barmatz.utils.Bitwise.contains(code, bit))
			view.checked = true;
		
		if(model instanceof barmatz.forms.fields.PhoneFieldModel && barmatz.utils.Bitwise.contains(code, barmatz.forms.Validator.VALID_PHONE))
			view.disabled = true;
	}
	
	function changeModelByView(view, bit)
	{
		var code;
		
		barmatz.utils.DataTypes.isInstanceOf(view, HTMLInputElement);
		barmatz.utils.DataTypes.isTypeOf(bit, 'number');
		
		code = model.getValidator().getCode();
		
		switch(bit)
		{
			case barmatz.forms.Validator.EQUALS:
				setViewParameters(view, 'Equals to', 'equals');
				break;
			case barmatz.forms.Validator.EXACT_LENGTH:
				setViewParameters(view, 'Exact length', 'exactLength', true);
				break;
			case barmatz.forms.Validator.MAX_LENGTH:
				setViewParameters(view, 'Maximum length', 'maxLength', true);
				break;
			case barmatz.forms.Validator.MIN_LENGTH:
				setViewParameters(view, 'Minimum length', 'minLength', true);
				break;
			case barmatz.forms.Validator.GREATER_THAN:
				setViewParameters(view, 'Greater than', 'greaterThan', true);
				break;
			case barmatz.forms.Validator.LESSER_THAN:
				setViewParameters(view, 'Lesser than', 'lesserThan', true);
				break;
		}

		if(view.checked)
		{
			if(code)
				bit = barmatz.utils.Bitwise.concat(code, bit);
		}
		else
			bit = barmatz.utils.Bitwise.slice(code, bit); 
		
		model.getValidator().setCode(bit); 
	}
	
	function setViewParameters(view, label, key, isNumber)
	{
		var dialogWrapper, field;
		
		barmatz.utils.DataTypes.isInstanceOf(view, HTMLInputElement);
		barmatz.utils.DataTypes.isTypeOf(label, 'string');
		barmatz.utils.DataTypes.isTypeOf(key, 'string');
		
		if(view.checked)
		{
			dialogWrapper = barmatz.forms.factories.DOMFactory.createChangePropertyPromptDialogWrapper('', label, model.getValidator()[key] || '', function(event)
			{
				model.getValidator()[key] = isNumber ? parseFloat(field.value) : field.value;
			}, true, dialogContainerView);
			field = dialogWrapper.field;
			barmatz.forms.factories.ControllerFactory.createJQueryDialogController(dialogWrapper.dialog);
		}
		else
			delete model.getValidator()[key];
	}
	
	function onViewClick(event)
	{
		var i;
		for(i in views)
			if(views[i] == event.currentTarget)
				changeModelByView(views[i], parseInt(i));
	}
};
barmatz.forms.fields.FieldValidationOptionsController.prototype = new barmatz.mvc.Controller();
barmatz.forms.fields.FieldValidationOptionsController.prototype.constructor = barmatz.forms.fields.FieldValidationOptionsController;
/** barmatz.forms.fields.FileFieldModel **/
barmatz.forms.fields.FileFieldModel = function(name)
{
	barmatz.utils.DataTypes.isTypeOf(name, 'string');
	barmatz.forms.fields.FieldModel.call(this, barmatz.forms.fields.FieldTypes.FILE, name);
	this.set('accept', []);
};
barmatz.forms.fields.FileFieldModel.prototype = new barmatz.forms.fields.FieldModel(null, null);
barmatz.forms.fields.FileFieldModel.prototype.constructor = barmatz.forms.fields.FileFieldModel;
barmatz.forms.fields.FileFieldModel.prototype.getAccept = function()
{
	return this.get('accept');
};
barmatz.forms.fields.FileFieldModel.prototype.setAccept = function(value)
{
	barmatz.utils.DataTypes.isInstanceOf(value, window.Array);
	this.set('accept', value);
};
barmatz.forms.fields.FileFieldModel.prototype.clone = function()
{
	var clone = new barmatz.forms.fields.FileFieldModel(this.getName());
	clone.setLabel(this.getLabel());
	clone.setMandatory(this.getMandatory());
	clone.setValue(this.getValue());
	clone.setEnabled(this.getEnabled());
	clone.setValidator(this.getValidator().clone());
	clone.setAccept(this.getAccept());
	return clone;
};
/** barmatz.forms.fields.HTMLContentModel **/
barmatz.forms.fields.HTMLContentModel = function()
{
	barmatz.forms.fields.FormItemModel.call(this, barmatz.forms.fields.FieldTypes.HTML_CONTENT);
	this.set('content', '');
};
barmatz.forms.fields.HTMLContentModel.prototype = new barmatz.forms.fields.FormItemModel(null);
barmatz.forms.fields.HTMLContentModel.prototype.constructor = barmatz.forms.fields.HTMLContentModel;
barmatz.forms.fields.HTMLContentModel.prototype.getContent = function()
{
	return this.get('content');
};
barmatz.forms.fields.HTMLContentModel.prototype.setContent = function(value)
{
	this.set('content', value);
};
barmatz.forms.fields.HTMLContentModel.prototype.clone = function()
{
	var clone = new barmatz.forms.fields.HTMLContentModel();
	clone.setContent(this.getContent());
	return clone;
};
/** barmatz.forms.fields.HiddenFieldModel **/
barmatz.forms.fields.HiddenFieldModel = function(name)
{
	barmatz.utils.DataTypes.isTypeOf(name, 'string');
	barmatz.forms.fields.AbstractFieldModel.call(this, barmatz.forms.fields.FieldTypes.HIDDEN, name);
};
barmatz.forms.fields.HiddenFieldModel.prototype = new barmatz.forms.fields.AbstractFieldModel(null, null);
barmatz.forms.fields.HiddenFieldModel.prototype.constructor = barmatz.forms.fields.HiddenFieldModel;
barmatz.forms.fields.HiddenFieldModel.prototype.clone = function()
{
	var clone = new barmatz.forms.fields.HiddenFieldModel(this.getName());
	clone.setValue(this.getValue());
	return clone;
};
/** barmatz.forms.fields.PasswordFieldModel **/
barmatz.forms.fields.PasswordFieldModel = function(name)
{
	barmatz.utils.DataTypes.isTypeOf(name, 'string');
	barmatz.forms.fields.TextFieldModel.call(this, name);
	this.set('type', barmatz.forms.fields.FieldTypes.PASSWORD);
};
barmatz.forms.fields.PasswordFieldModel.prototype = new barmatz.forms.fields.TextFieldModel(null);
barmatz.forms.fields.PasswordFieldModel.prototype.constructor = barmatz.forms.fields.PasswordFieldModel;
barmatz.forms.fields.PasswordFieldModel.prototype.clone = function()
{
	var clone = new barmatz.forms.fields.PasswordFieldModel(this.getName());
	clone.setLabel(this.getLabel());
	clone.setMandatory(this.getMandatory());
	clone.setValue(this.getValue());
	clone.setEnabled(this.getEnabled());
	clone.setValidator(this.getValidator().clone());
	clone.setMax(this.getMax());
	clone.setDescription(this.getDescription());
	return clone;
};
/** barmatz.forms.fields.PhoneFieldModel **/
barmatz.forms.fields.PhoneFieldModel = function(name)
{
	barmatz.utils.DataTypes.isNotUndefined(name);
	barmatz.forms.fields.FieldModel.call(this, barmatz.forms.fields.FieldTypes.PHONE, name);
	this.getValidator().setCode(barmatz.forms.Validator.VALID_PHONE); 
	this.set('prefix', '');
};
barmatz.forms.fields.PhoneFieldModel.prototype = new barmatz.forms.fields.FieldModel(null, null);
barmatz.forms.fields.PhoneFieldModel.prototype.constructor = barmatz.forms.fields.PhoneFieldModel;
barmatz.forms.fields.PhoneFieldModel.prototype.getPrefix = function()
{
	return this.get('prefix');
};
barmatz.forms.fields.PhoneFieldModel.prototype.getValue = function()
{
	return this.get('value');
};
barmatz.forms.fields.PhoneFieldModel.prototype.setValue = function(value)
{
	var prefixes, prefix, prefixesRegex, maxLength;
	
	barmatz.utils.DataTypes.isTypeOf(value, 'string', true);
	
	prefixes = [];
	
	barmatz.forms.fields.PhonePrefixes.forEach(function(prefix)
	{
		prefixes.push(prefix);
	});
	
	prefixesRegex = '^(' + prefixes.join('|') + ')';
	
	if(new RegExp(prefixesRegex).test(value))
		this.set('prefix', value.replace(new RegExp(prefixesRegex + '.+$'), '$1'));
	else
		this.set('prefix', '');
	
	prefix = this.getPrefix();
	maxLength = 7;
	
	if(value.replace(prefix, '').length > maxLength)
		value = prefix + value.substring(prefix.length, maxLength);
	
	this.set('value', value);
};
barmatz.forms.fields.PhoneFieldModel.prototype.clone = function()
{
	var clone = new barmatz.forms.fields.PhoneFieldModel(this.getName());
	clone.setLabel(this.getLabel());
	clone.setMandatory(this.getMandatory());
	clone.setValue(this.getValue());
	clone.setEnabled(this.getEnabled());
	clone.setValidator(this.getValidator().clone());
	return clone;
};
/** barmatz.forms.fields.PhonePrefixes **/
barmatz.forms.fields.PhonePrefixes = [
	'02', '03', '04', '08', '09', 
	'050', '052', '053', '054', '055', '056', '057', '058', '059', 
	'072', '073', '074', '075', '076', '077', '078'
];
barmatz.forms.fields.PhonePrefixes.forEach = function(callback)
{
	barmatz.utils.DataTypes.isTypeOf(callback, 'function');
	barmatz.utils.Array.forEach(this, function(item, index, collection)
	{
		callback(item);
	});
};
/** barmatz.forms.fields.RadioFieldModel **/
barmatz.forms.fields.RadioFieldModel = function(name)
{
	barmatz.utils.DataTypes.isTypeOf(name, 'string');
	barmatz.forms.fields.CheckboxFieldModel.call(this, name);
	this.set('type', barmatz.forms.fields.FieldTypes.RADIO);
};
barmatz.forms.fields.RadioFieldModel.prototype = new barmatz.forms.fields.CheckboxFieldModel(null);
barmatz.forms.fields.RadioFieldModel.prototype.constructor = barmatz.forms.fields.RadioFieldModel;
barmatz.forms.fields.RadioFieldModel.prototype.clone = function()
{
	var clone = new barmatz.forms.fields.RadioFieldModel(this.getName());
	clone.setLabel(this.getLabel());
	clone.setMandatory(this.getMandatory());
	clone.setValue(this.getValue());
	clone.setEnabled(this.getEnabled());
	clone.setValidator(this.getValidator().clone());
	clone.setChecked(this.getChecked());
	return clone;
};
/** barmatz.forms.fields.TextAreaFieldModel **/
barmatz.forms.fields.TextAreaFieldModel = function(name)
{
	barmatz.utils.DataTypes.isTypeOf(name, 'string', true);
	barmatz.forms.fields.FieldModel.call(this, barmatz.forms.fields.FieldTypes.TEXT_AREA, name);
	this.set('rows', 2);
	this.set('cols', 20);
};
barmatz.forms.fields.TextAreaFieldModel.prototype = new barmatz.forms.fields.FieldModel(null, null);
barmatz.forms.fields.TextAreaFieldModel.prototype.constructor = barmatz.forms.fields.TextAreaFieldModel;
barmatz.forms.fields.TextAreaFieldModel.prototype.getRows = function()
{
	return this.get('rows');
};
barmatz.forms.fields.TextAreaFieldModel.prototype.setRows = function(value)
{
	this.set('rows', value);
};
barmatz.forms.fields.TextAreaFieldModel.prototype.getCols = function()
{
	return this.get('cols');
};
barmatz.forms.fields.TextAreaFieldModel.prototype.setCols = function(value)
{
	this.set('cols', value);
};
barmatz.forms.fields.TextAreaFieldModel.prototype.clone = function()
{
	var clone = new barmatz.forms.fields.TextAreaFieldModel(this.getName());
	clone.setLabel(this.getLabel());
	clone.setMandatory(this.getMandatory());
	clone.setValue(this.getValue());
	clone.setEnabled(this.getEnabled());
	clone.setValidator(this.getValidator().clone());
	clone.setRows(this.getRows());
	clone.setCols(this.getCols());
	return clone;
};
/** embed **/
barmatz.forms.embed = function(fingerprint)
{
	var dictionary = new barmatz.utils.Dictionary();
	
	getContainers();
	
	function getContainers()
	{
		var containers = barmatz.utils.Array.filter(barmatz.utils.Array.toArray(document.getElementsByName('formContainer')), filterFormContainers);
		barmatz.utils.Array.forEach(containers, function(item, index, collection)
		{
			embedForm(item);
		});
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
		model.addEventListener(barmatz.events.FormEvent.LOADING_FORM_COMPLETE, onLoadingFormComplete);
		model.addEventListener(barmatz.events.FormEvent.LOADING_FORM_ERROR, onLoadingFormError);
	}
	
	function removeFormModelListeners(model)
	{
		model.removeEventListener(barmatz.events.FormEvent.LOADING_FORM_COMPLETE, onLoadingFormComplete);
		model.removeEventListener(barmatz.events.FormEvent.LOADING_FORM_ERROR, onLoadingFormError);
	}
	
	function addFormToContainer(model)
	{
		var container, wrapper;
		
		container = dictionary.get(model);
		wrapper = barmatz.forms.factories.DOMFactory.createFormWrapper(model);
		barmatz.forms.factories.DOMFactory.clearElement(container);
		container.appendChild(wrapper.container);
		barmatz.forms.factories.ControllerFactory.createFormController(model, wrapper.form, wrapper.submitButton);
	}
	
	function onLoadingFormComplete(event)
	{
		var model;
		
		barmatz.utils.DataTypes.isInstanceOf(event, barmatz.events.FormEvent);
		
		model = event.getTarget();
		
		addFormToContainer(model);
		removeFormModelListeners(model);
		dictionary.remove(model);
	}
	
	function onLoadingFormError(event)
	{
		var model
		
		barmatz.utils.DataTypes.isInstanceOf(event, barmatz.events.FormEvent);
		
		model = event.getTarget();
		
		removeFormModelListeners(model);
		dictionary.get(model).innerHTML = 'Error loading form';
		dictionary.remove(model);
	}
};
barmatz.forms.embed();
