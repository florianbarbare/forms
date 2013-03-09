/** barmatz.forms.ui.MenuItemModel **/
window.barmatz.forms.ui.MenuItemModel = function(label)
{
	barmatz.utils.DataTypes.isTypeOf(label, 'string');
	barmatz.mvc.Model.call(this);
	this.set('label', label);
	this.set('clickHandler', null);
};

barmatz.forms.ui.MenuItemModel.prototype = new barmatz.mvc.Model();
barmatz.forms.ui.MenuItemModel.prototype.constructor = barmatz.forms.ui.MenuItemModel;

Object.defineProperties(barmatz.forms.ui.MenuItemModel.prototype, 
{
	label: {get: function()
	{
		return this._label;
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(label, 'string');
		this._label = value;
	}},
	clickHandler: {get: function()
	{
		return this.get('clickHandler');
	}, set: function(value)
	{
		barmatz.utils.DataTypes.isTypeOf(value, 'function', true);
		this.set('clickHandler', value);
	}}
});