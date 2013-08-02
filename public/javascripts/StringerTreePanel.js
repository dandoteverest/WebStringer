

Ext.define('StringerTreePanel', {
  extend: 'Ext.tree.Panel',
  alias: 'widget.stringerstreepanel',
  rootVisible: false,
  selectedString: null,

  columns: [
    {
      xtype: 'treecolumn',
      flex: 1,
      text: 'Name',
      sortable: true,
      dataIndex: 'full_name'
    }
  ],

  buttons: [
    {
      text: 'Add Stringer',
      itemId: 'addStringerBtn',
      disabled: true,
      handler: function() {
      }
    }
  ],

  initComponent: function() {
    var me = this;
    this.callParent(arguments);

    this.on('selectionchange', function(obj, selections, options) {
      if (selections.length != 1) {
        return;
      }
      if (selections[0].isLeaf() == true) {
        var id = selections[0].get('id');
        var store = Ext.data.StoreManager.lookup('stringDetailsStore');
        store.load({url: store.getProxy().url + "/" + id + ".json"});

        store = Ext.StoreManager.lookup('usersOfStringStore');
        store.load({url: "/tennis_strings/" + id + "/users_of"});
      }
      me.query('#addStringerBtn')[0].setDisabled(false);
    });

    this.store.on('load', function(store) {
      me.selectedString = null;
    });
  },

  onRender: function() {
    var me = this;

    this.callParent(arguments);
    Ext.ComponentQuery.query('#racketQueue').first().on('itemselected', function(queue, stringing) {
      document.location = "/customers?customer_id=" + stringing.get('customer_id') + "&racket_id=" + stringing.get('customer_racket_id')
    });
  }
});
