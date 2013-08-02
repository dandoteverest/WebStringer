Ext.create('Ext.data.Store', {
  model: 'CustomerDetailsModel',
  storeId: 'usersOfStringStore',
  autoLoad: false,
  proxy: {
    type: 'ajax',
    reader: 'json'
  }
});

Ext.define('UsersOfStringPanel', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.usersofstring',
  border: false,
  autoScroll: true,
  store: Ext.StoreManager.lookup('usersOfStringStore'),

  items: [
    {
      xtype: 'panel',
      border: false,
      layout: 'anchor',
      autoScroll: true,
      items: [ ]
    }
  ],

    initComponent: function() {
        var me = this;
        this.callParent(arguments);
        this.store.on('load', function(store) {
            me.removeAll();
            store.each(function(record) {
                var html = "<p style='margin-left: 5px; margin-top: 5px'>" + record.get('first_name') + " " + record.get('last_name') + "</p>";
                var comp = Ext.create('Ext.Component', {
                    html: html,
                    cls: 'users-of-racket-item'
                });
                comp = me.add(comp);
                if (comp && comp.el) {
                    comp.el.on('click', function() {
                        me.fireEvent('userselected', me, record);
                    });
                }
            });
        });
    },

    initEvents: function() {
        this.addEvents('userselected');
    }
});
