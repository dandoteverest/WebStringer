

  Ext.define('HTMLPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'htmlpanel',
    layout: 'fit',
    border: false,
    elementId: null,

    initEvents: function() {
      this.addEvents('click');
      this.on('click', this._onClick, this);
    },

    onRender: function() {
      var me = this;
      this.callParent(arguments);
      this.getEl(this.elementId).on('click', function() {
        me.fireEvent('click');
      });
    },

    _onClick: function() {
      if (Ext.isDefined(this.onClick)) {
        this.onClick();
      }
    }
  });

