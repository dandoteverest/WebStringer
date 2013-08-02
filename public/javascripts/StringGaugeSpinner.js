

Ext.define('StringGaugeSpinner', {
  extend: 'Ext.form.field.Spinner',
  alias: 'widget.stringgaugespinner',
  regex: new RegExp('[0-9]+(\.[0-9]+)?'),

  value: '1.25 mm',
  step: 0.01,

  onSpinUp: function() {
    var me = this;
    if (!me.readOnly) {
      var val = me.step; // set the default value to the step value
      if(me.getValue() !== '') {
        val = parseFloat(me.regex.exec(me.getValue()).first());
      }                          
      me.setValue((val + me.step).toFixed(2) + ' mm');
    }
  },

  // override onSpinDown
  onSpinDown: function() {
    var me = this;
    if (!me.readOnly) {
      if(me.getValue() !== '') {
        val = parseFloat(me.regex.exec(me.getValue()).first());
      }            
      me.setValue((val - me.step).toFixed(2) + ' mm');
    }
  }

});


