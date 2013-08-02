

Ext.define('HeadSizeSpinner', {
  extend: 'Ext.form.field.Spinner',
  alias: 'widget.headsizespinner',
  regex: new RegExp('[0-9]+'),

  value: '95 sq in',

  onSpinUp: function() {
    var me = this;
    if (!me.readOnly) {
      var val = me.step; // set the default value to the step value
      if(me.getValue() !== '') {
        val = parseInt(me.regex.exec(me.getValue()).first());
      }                          
      me.setValue((val + me.step) + ' sq in');
    }
  },

  // override onSpinDown
  onSpinDown: function() {
    var me = this;
    if (!me.readOnly) {
      if(me.getValue() !== '') {
        val = parseInt(me.regex.exec(me.getValue()).first());
      }            
      me.setValue((val - me.step) + ' sq in');
    }
  }

});


