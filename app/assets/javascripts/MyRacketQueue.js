Ext.define('RacketQueueItem', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.racketQueueItem',
  layout: 'fit',
  height: 33
});

Ext.define('MyRacketQueuePanel', {
  extend: 'Ext.panel.Panel',
  store: null,
  alias: 'widget.myracketqueue',
  layout: 'column',
  xTemplate: null,
  emptyTemplat: null,

  items: [
    {
      itemId: 'column1',
      xtype: 'racketQueueItem',
      columnWidth: .3333
    },
    {
      itemId: 'column2',
      xtype: 'racketQueueItem',
      columnWidth: .3334
    },
    {
      itemId: 'column3',
      xtype: 'racketQueueItem',
      columnWidth: .3333
    }
  ],
  

  initComponent: function() {
    var me = this;

    this.callParent(arguments);
    this.xTemplate = new Ext.XTemplate(
      '<table width=100% class="my-racket-queue">',
        '<col width=50%>',
        '<col width=50%>',
        '<tr>',
          '<td valign=top>',
            '<table>',
              '<tr>',
                '<td><b>Customer:</b></td>',
                '<td style="padding-left: 5px"><tpl for="customers">{first_name} {last_name}</tpl></td>',
              '</tr>',
            '</table>',
          '</td>',
          '<td>',
            '<table>',
              '<tpl if="is_late == true"><tr class="my-racket-queue-late"></tpl>',
              '<tpl if="is_late == false"><tr></tpl>',
                '<td><b>Requested By:</b></td>',
                '<td style="padding-left: 5px">{[Ext.util.Format.date(values.requested_by, "M j, Y")]}</td>',
              '</tr>',
              '<tr>',
                '<td><b>Dropped Off:</b></td>',
                '<td style="padding-left: 5px">{[Ext.util.Format.date(values.dropped_off, "M j, Y")]}</td>',
              '</tr>',
            '</table>',
          '</td>',
        '</tr>',
      '</table>');

    this.emptyTemplate = new Ext.XTemplate('<p style="text-align: center"></p>');
    this.store = Ext.StoreManager.lookup('racketQueueStore'),

    this.addDocked({
      xtype: 'pagingtoolbar',
      store: me.store,
      dock: 'bottom',
      displayInfo: true
    });

    this.store.on('load', this.loadItems, this);
    this.on('afterrender', this.onAfterRender, this);

    this.addEvents('itemselected');
  },

  onAfterRender: function() {
    var me = this;

    Ext.Array.each(['column1', 'column2', 'column3'], function(item, index) {
      var el = me.getComponent(item);
      el.body.on('click', me.fireItemSelected, me, el);
    });
  },

  fireItemSelected: function(theEvent, element, component) {
    this.fireEvent('itemselected', this, component.racket_stringing);
  },

  loadItems: function(store, records) {
    var me = this;

    Ext.Array.each(['column1', 'column2', 'column3'], function(item, index) {
      var el = me.getComponent(item);
      if (records[index]) {
        var data = records[index].data;
        //Ext.Object.merge(data, 'customers', records[index].getAssociatedData().customers);
        data.customers = records[index].getAssociatedData().customers;
        me.xTemplate.overwrite(el.body, data);
        el.racket_stringing = records[index];
      } else {
        me.emptyTemplate.overwrite(el.body);
        delete el.body.racket_stringing;
      }
    });
  }
});
