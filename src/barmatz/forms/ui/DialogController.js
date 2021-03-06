/** barmatz.forms.ui.DialogController **/
barmatz.forms.ui.DialogController = function(model, view)
{
	barmatz.utils.DataTypes.isNotUndefined(model);
	barmatz.utils.DataTypes.isNotUndefined(view);
	barmatz.utils.DataTypes.isInstanceOf(model, barmatz.mvc.Model, true);
	barmatz.utils.DataTypes.isInstanceOf(view, window.HTMLElement, true);
	barmatz.mvc.Controller.call(this);
	this._model = model;
	this._view = view;
};
barmatz.forms.ui.DialogController.prototype = new barmatz.mvc.Controller();
barmatz.forms.ui.DialogController.prototype.constructor = barmatz.forms.ui.DialogController;